# AGENTS.md — Newton firmware

Operating manual for AI coding agents. Read this before editing. User-facing setup lives in `README.md`; RTK workflow in `RTK.md`.

## 1. What this project is

Newton is ESP32 firmware for a Kincony KC868-A2 home-automation controller. It drives WirenBoard Modbus devices on RS-485 (lights, warm floor, climate and presence sensors), publishes state to MQTT, and registers HA entities through MQTT discovery. A LittleFS web UI configures Wi-Fi, MQTT and Modbus. Networking is Wi-Fi today: LAN8720 constants exist, but `networkMgr.init(..., false, ...)` passes `hasEth = false` in `src/main.cpp`.

Hardware identity (`src/defines.h`): model `KC868-A2`, manufacturer `Kincony`, HW `1.0.0`, FW `0.1.0`, controller `Newton` (`Newton dev` in the dev env).

## 2. Toolchain and commands

PlatformIO + Arduino, board `esp32dev`, LittleFS. Build success is the **only** automated validation — this repo has no test framework and no test command.

```bash
pio run -e kc868a2                 # production build
pio run -e kc868a2_dev             # same code, CONTROLLER_NAME="Newton dev"
pio run -e kc868a2 -t upload       # USB upload
pio run -e kc868a2 -t uploadfs     # data/ (web UI) to LittleFS — required for the UI
pio run -e kc868a2_ota -t upload   # OTA; upload_port/--auth live in platformio.ini
pio device monitor -e kc868a2      # serial monitor, 115200 8N1
```

`ed-common` is pinned to git tag `0.3.1` in lib_deps (upstream https://github.com/lan143/ed-common); the local sibling checkout, when present, is for library development only and is not used by the build.

The OTA env targets `192.168.1.43` and carries an auth value in `platformio.ini`; never copy that value into docs, logs or commits.

## 3. Architecture map

```
src/
├── main.cpp              Global singletons, setup()/loop(); creates EDCommon sensors/lights/automation
├── defines.h             GPIO pins, serial speed, device identity strings
├── config.h              Config persisted raw-binary to /config.bin; CURRENT_VERSION = 2
├── config_migration.*    One-shot v1→v2 config migration and /light_state.bin seed
├── command/
│   ├── command.h/.cpp    Parses warm-floor command JSON (mode, setPoint)
│   └── command_consumer.*  Subscribes to <prefix>/warm_floor/set
├── sensor/one_wire.h/.cpp  WB-M1W2 1-Wire channel 1 for warm-floor temperature
├── state/
│   ├── state.h/.cpp      Warm-floor State with EDUtils::Nullable fields and marshalJSON()
│   ├── producer.h/.cpp   StateProducer: State → MQTT (non-retained)
│   └── (no state_mgr.h)  StateMgr<State> comes from ed-utils: <state/state_mgr.h> is a lib header
├── thermostat/
│   ├── thermostat.h/.cpp Warm-floor on/off, hysteresis, sensor-fault protection
│   └── state.h           Persisted ThermostatState (mode, setPoint, isActive)
└── web/handler.h/.cpp    Async web server :80, JSON API, LittleFS static files
data/                     Web UI + vendored minified jquery/bootstrap
```

Wiring: every Newton subsystem is a global in `main.cpp`, dependencies are constructor-injected (no service locator, no dynamic registration). Light, sensors, presence and automation are `EDCommon` objects from `ed-common`, created in `setup()` with the option pattern after device/MQTT/Modbus init; they share the configured topic prefix and HA device. Add a Newton subsystem by constructing it globally and injecting what it needs.

`setup()` order: random seed → unconditional 10 s delay → `Serial` → LittleFS (returns early on failure) → config defaults → `migrateConfigV1ToV2` → config load → warm-floor topics → network logger → `Serial2` + `modbus.init(15)` → network → ArduinoOTA → `CommandConsumer` → MQTT → MQTT healthcheck → `StateProducer` → web → HA discovery/device → Modbus devices → 5 EDCommon sensors → presence → 1-Wire → main light → backlight → light automation → thermostat.

`loop()` order: `networkMgr`, `discoveryMgr`, `ArduinoOTA.handle`, `healthCheck`, the 5 sensor `update()` calls, `stateMgr.loop()`, `mainLight`, `backLight`, `lightAutomation`, `warmFloor.loop()`, `presenceSensor.update()`, `networkLogger.update()`. Preserve it unless a change requires it.

Data flow: EDCommon sensors and the presence binary sensor publish retained plain-number/`true`/`false` topics per entity on change plus a 60 s heartbeat. EDCommon lights publish non-retained per-light JSON on change plus a 60 s heartbeat; the light automation subscribes to `<prefix>/light_automation/set` and persists state in `/light_state.bin`. Warm floor keeps Newton's `StateMgr`/`StateProducer`: `State` holds only the four `warmFloor*` fields and publishes `<prefix>/warm_floor/state` non-retained on change; `<prefix>/warm_floor/set` → `CommandConsumer` → `Thermostat` → relay over Modbus. HA discovery comes from `EDHA::DiscoveryMgr`; one device is created in `setup()` and shared by all registrations.

## 4. Contracts

### GPIO / board (`src/defines.h`)

| Constant | Value | Use |
|---|---|---|
| `RELAY_WARM_FLOOR` | GPIO 2 | Warm-floor relay (HIGH = on) |
| `RELAY_UNKNOW` | GPIO 15 | Defined, unused |
| `RS485RX` | GPIO 35 | `Serial2` RX (input-only) |
| `RS485TX` | GPIO 32 | `Serial2` TX |
| `ETH_ADDR` | 0 | LAN8720 PHY address (Ethernet not enabled) |
| `ETH_MDC_PIN` | GPIO 23 | Ethernet MDC |
| `ETH_MDIO_PIN` | GPIO 18 | Ethernet MDIO |
| `ETH_POWER_PIN` | -1 | No separate PHY power pin |
| `ETH_TYPE` | `ETH_PHY_LAN8720` | Ethernet PHY type |
| `ETH_CLK_MODE` | `ETH_CLOCK_GPIO17_OUT` | 50 MHz clock on GPIO 17 |

### Modbus defaults (`src/main.cpp`)

| Device | Address | Notes |
|---|---|---|
| WB-MSW | 1 | Climate/air-quality/light sensor |
| WB-LED1 | 3 | Main CCT light (`LED_MODE_CCTWW`) |
| WB-LED2 | 4 | RGBW backlight (`LED_MODE_RGBW`) |
| WB-M1W2 | 5 | 1-Wire channel 1 = warm-floor temperature |
| MTD262MB | 6 | Presence, input register `0x0` |

Default serial: 9600 8N1, configurable. `modbus.init(15)` sets a 15 ms RTU timeout (not a pin). UI accepts speeds 1200–115200 and addresses 1–254; speed changes apply live via `WirenBoard::changeSpeed`.

### MQTT defaults and payloads

| Purpose | Default |
|---|---|
| Topic prefix (`mqttTopicPrefix`) | `newton/<chipid>`; max 46 chars (bounded via /warm_floor/state + Producer::_topic[64]) |
| HA discovery prefix | `homeassistant` |
| Port | 1883 |

All entity topics are built from the topic prefix. `<prefix>` below means `newton/<chipid>` by default.

| Entity | State topic | Command topic | Payload / retention |
|---|---|---|---|
| Temperature, humidity, air quality, CO2, light level | `<prefix>/<entity>/state` | — | plain number, retained, 60 s heartbeat |
| Presence | `<prefix>/human_detected_1/state` | — | `"true"`/`"false"`, retained, 60 s heartbeat |
| Main light | `<prefix>/light/state` | `<prefix>/light/set` | JSON; commands `on`/`off` or JSON; non-retained |
| Backlight | `<prefix>/backlight/state` | `<prefix>/backlight/set` | JSON; commands `on`/`off` or JSON; non-retained |
| Light automation night mode | `<prefix>/light_automation/state` | `<prefix>/light_automation/set` | `"true"`/`"false"`, non-retained |
| Warm floor | `<prefix>/warm_floor/state` | `<prefix>/warm_floor/set` | JSON; non-retained |

Sensor entities use their sanitized names: `temperature`, `humidity`, `air_quality`, `co2`, `light_level`, `human_detected_1`.

Light state JSON (EDCommon library, not this repo): `enabled` (`"on"`/`"off"`), `brightness` (0–100), `tempColor` (Kelvin), `color` (`"r,g,b"`); fields depend on the light's capabilities. Commands: plain `on`/`off`, or one JSON object with any of `brightness`, `tempColor`, `color`.

Warm-floor state keys (`src/state/state.cpp`): `warmFloorCurrentTemperature`, `warmFloorMode` (`"off"`/`"heat"`), `warmFloorSetPoint`, `warmFloorState` (`"heating"`/`"idle"`). Invalid `Nullable` fields are omitted.

Warm-floor command keys (`src/command/command.cpp`): `warmFloorMode` (`"off"`/`"heat"`), `warmFloorSetPoint` (Thermostat clamps 16–40). Newton itself no longer handles light commands.

## 5. Invariants and rules

- **Config is raw binary.** `Config` uses `EDConfig::DataMgr` + `StorageLittleFS("/config.bin")`, currently `CURRENT_VERSION = 2`. A one-shot `migrateConfigV1ToV2()` (exact v1 size + CRC) copies the old layout, derives the topic prefix by stripping `/state` from the old state topic (default fallback), and seeds `/light_state.bin` from the embedded light state. Corrupt or absent v1 files fall back to fresh defaults. Reordering/changing fields still breaks stored configs; add migration before layout changes and never "just bump" the version.
- **Dependencies.** All ed-* libraries come from git; `ed-common` is pinned to tag `0.3.1`, the rest track git master. Read the checked-out headers/sources in `.pio/libdeps/kc868a2/<lib>/src` before using an API; do not guess.
- **Flash is tight.** Pinned versions fit flash (commit `69b4568`); ed-common's color module replaced FastLED (commit `fb957ff`). Never reintroduce FastLED or add heavy libraries for small features.
- **Time is microseconds.** Use `esp_timer_get_time()`. Magic intervals: light/automation loop 500 000; manual-on 300 000 000 (5 min); manual-off/human 600 000 000 (10 min); automation state persist ~51 000 000; light/sensor/automation heartbeat 60 000 000; thermostat 2 000 000; sensor poll 10 000 000; presence poll 1 000 000. Newton config stores immediately on change.
- **HA unique IDs:** `<entity>_newton_<chipid>`. Sensors, main light and presence keep `temperature`, `humidity`, `air_quality`, `co2`, `light_level`, `light`, `human_detected_1`. New: `backlight_newton_<chipid>`. The night-mode switch is now `light_automation_newton_<chipid>` (was `light_night_mode_newton_<chipid>`; the old entity goes stale in HA and must be deleted). Thermostat exception: `<chipid>_warm_floor_newton`. Do not rename casually; HA treats it as identity.
- **Nullable:** always check `Valid()` before `Value()`, and marshal only valid fields. This applies to Newton's warm-floor `State` only; light/sensor state lives in EDCommon. `State::operator==` takes non-const references — preserve that unless all call sites change.
- **Logging:** use `LOGx("tag", ...)`; verbose logging comes from `esp_log_level_set("*", ESP_LOG_VERBOSE)` and `CORE_DEBUG_LEVEL=5`. Never log credentials or the OTA auth value.
- **Compiler:** `-Wshadow` is on in every env; do not shadow. English comments and identifiers only.
- **MQTT:** EDCommon sensors and presence publish retained; EDCommon lights and the light-automation night-mode state publish non-retained; Newton's warm-floor aggregate state is non-retained. Do not switch retention without considering HA stale-state behavior.
- **Brightness:** EDCommon lights and automation state use 0–100 (HA scale 100); the old 0–255 `LightState` unit is gone.
- **Vendored:** never edit `data/jquery-3.6.0.min.js`, `data/bootstrap.min.js`, `data/bootstrap.min.css`, or `.pio/libdeps`.

## 6. Known bugs and caveats

- `src/thermostat/thermostat.cpp:13` — the second clause `MIN_TEMPERATURE > MAX_TEMPERATURE` is always false; it should compare `_state.setPoint > MAX_TEMPERATURE`. A stored setpoint above 40 is not reset.
- `GET /api/settings` returns Wi-Fi and MQTT passwords in plaintext; the web server has no authentication. Trusted LAN only.
- ArduinoOTA uses a hardcoded password in `src/main.cpp`; the upload auth value is in `platformio.ini`. Reference locations, never values.
- `setup()` waits 10 s unconditionally and returns early if LittleFS mount fails (`src/main.cpp`).
- Network logger is temporary: `192.168.1.2:5555`, `/_bulk`, marked `// tmp`.
- Ethernet constants exist, but `hasEth = false`; current firmware is Wi-Fi only.
- `data/index.html` exposes status/settings, not light/thermostat control.

## 7. Style and definition of done

- Smallest correct change; preserve constructor injection and loop order.
- English comments/identifiers; match formatting, no drive-by reformatting.
- Keep env names and pinned versions stable unless the task is about them.
- Commit subjects: concise, imperative English ("Fix thermostat setpoint clamp").
- Done: `pio run -e kc868a2` succeeds; no new secrets; no FastLED; config layout unchanged or migrated; MQTT/HA keys unchanged or documented (including stale HA entities); flash checked after dependency/large changes; docs updated for user-visible changes.
- Review: pins match `defines.h`; addresses/speeds match defaults; logs contain no credentials; vendored files untouched; `-Wshadow` clean; no tests exist.
