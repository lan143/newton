# AGENTS.md — Newton firmware

Operating manual for AI coding agents. Read this before editing. User-facing setup lives in `README.md`; RTK workflow in `RTK.md`.

## 1. What this project is

Newton is ESP32 firmware for a Kincony KC868-A2 home-automation controller. It drives WirenBoard Modbus devices on RS-485 (lights, warm floor, climate and presence sensors), publishes state to MQTT, and registers HA entities through MQTT discovery. A LittleFS web UI configures Wi-Fi, MQTT and Modbus. Networking is Wi-Fi today: LAN8720 constants exist, but `networkMgr.init(..., false, ...)` passes `hasEth = false` (`src/main.cpp:104`).

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

The OTA env targets `192.168.1.43` and carries an auth value in `platformio.ini`; never copy that value into docs, logs or commits.

## 3. Architecture map

```
src/
├── main.cpp              Global singletons, constructor injection, setup()/loop()
├── defines.h             GPIO pins, serial speed, device identity strings
├── config.h              Config persisted raw-binary to /config.bin; CURRENT_VERSION = 1
├── automation/
│   ├── light.h/.cpp      Light automation, HA discovery, manual override, night mode
│   └── light_state.h     Persisted LightState (enabled, nightMode, brightness, temperature, color)
├── command/
│   ├── command.h/.cpp    Parses command JSON into optional light/thermostat fields
│   ├── command_consumer.*  Subscribes to mqttCommandTopic; applies parsed commands
│   └── switch_command_consumer.*  Subscribes to light-switch topic; plain "ON"/"OFF"
├── light/
│   ├── light.h           Abstract Light interface
│   ├── main.h/.cpp       MainLight: WB-LED1 CCTWW, physical buttons, Kelvin mapping
│   └── backlight.h/.cpp  Backlight: WB-LED2 RGBW, CRGB→HSV→RGB+W split
├── sensor/
│   ├── complex.h/.cpp    WB-MSW: temperature, humidity, air quality, CO2, lux
│   ├── mtd262mb.h/.cpp   MTD262MB presence sensor, input register 0x0
│   └── one_wire.h/.cpp   WB-M1W2 1-Wire channel 1 for warm-floor temperature
├── state/
│   ├── state.h/.cpp      State with EDUtils::Nullable fields and marshalJSON()
│   ├── producer.h/.cpp   StateProducer: State → MQTT (non-retained)
│   └── (no state_mgr.h)  StateMgr<State> comes from ed-utils: <state/state_mgr.h> is a lib header
├── thermostat/
│   ├── thermostat.h/.cpp Warm-floor on/off, hysteresis, sensor-fault protection
│   └── state.h           Persisted ThermostatState (mode, setPoint, isActive)
└── web/handler.h/.cpp    Async web server :80, JSON API, LittleFS static files
data/                     Web UI + vendored minified jquery/bootstrap
```

Wiring: every subsystem is a global in `main.cpp`, dependencies are constructor-injected (no service locator, no dynamic registration). Add a subsystem by constructing it globally and injecting what it needs.

`setup()` order: random seed → unconditional 10 s delay → `Serial` → LittleFS (returns early on failure) → config defaults/load → network logger → `Serial2` + `modbus.init(15)` → network → ArduinoOTA → consumers → MQTT → healthcheck → producer → web → HA device → sensors → lights → automation → thermostat.

`loop()` order: `networkMgr`, `discoveryMgr`, `ArduinoOTA.handle`, `healthCheck`, `complexSensor`, `stateMgr`, `lightAutomation`, `warmFloor`, `mtd262mb`, `networkLogger.update`. Preserve it unless a change requires it.

Data flow: sensors/automation call `stateMgr.getState().set*()`; `stateMgr.loop()` sees changed snapshots and asks `StateProducer` to publish. `StateProducer` serializes `marshalJSON()` and publishes MQTT retain `false`, skipping while disconnected. `mqttCommandTopic` → `CommandConsumer` (JSON); `mqttLightSwitchCommandTopic` → `SwitchCommandConsumer` (plain ON/OFF) → `LightAutomation` / `Thermostat` → WB-LED / relay over Modbus. HA discovery comes from `EDHA::DiscoveryMgr`; one device is created in `setup()` and shared by all registrations.

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
| MTD262MB | 6 | Presence, input register `0x0`, id 1 only |

Default serial: 9600 8N1, configurable. `modbus.init(15)` sets a 15 ms RTU timeout (not a pin). UI accepts speeds 1200–115200 and addresses 1–254; speed changes apply live via `WirenBoard::changeSpeed`.

### MQTT defaults and payloads

| Purpose | Default |
|---|---|
| State | `newton/<chipid>/state` |
| Command | `newton/<chipid>/set` |
| Light switch | `newton/<chipid>/light/switch` |
| HA discovery prefix | `homeassistant` |
| Port | 1883 |

State keys (`src/state/state.cpp`): `temperature`, `humidity`, `airQuality`, `co2`, `lightLevel`, `lightNightMode` (`"true"`/`"false"`), `lightSwitchState` (`"ON"`/`"OFF"`), `lightBrightness`, `lightColor` (`"r,g,b"`), `lightColorTemp`, `warmFloorCurrentTemperature`, `warmFloorMode`, `warmFloorSetPoint`, `warmFloorState` (`"heating"`/`"idle"`), `humanDetected1` (`"true"`/`"false"`). Invalid `Nullable` fields are omitted.

Command keys (`src/command/command.cpp`): `lightNightMode` (string `"true"`/`"false"`), `lightBrightness` (0 ignored), `lightColor` (`"r,g,b"`), `lightColorTemp` (clamped 2700–6000), `warmFloorMode` (`"off"`/`"heat"`), `warmFloorSetPoint` (clamped 16–40). The switch topic accepts only `ON`/`OFF`.

## 5. Invariants and rules

- **Config is raw binary.** `Config` uses `EDConfig::DataMgr` + `StorageLittleFS("/config.bin")`, currently `CURRENT_VERSION = 1`; there is no migration. Reordering/changing fields breaks stored configs; add migration before layout changes and never "just bump" the version.
- **ed-* libraries float on git master.** Read the checked-out headers/sources in `.pio/libdeps/kc868a2/<lib>/src` before using an API; do not guess.
- **Flash is tight.** Pinned versions fit flash (commit `69b4568`); ed-common's color module replaced FastLED (commit `fb957ff`). Never reintroduce FastLED or add heavy libraries for small features.
- **Time is microseconds.** Use `esp_timer_get_time()`. Magic intervals: light loop 500 000; manual-on 300 000 000 (5 min); manual-off/human 600 000 000 (10 min); config persist 10 000 000; thermostat 2 000 000; complex sensor 10 000 000; MTD262MB 1 000 000.
- **HA unique IDs:** `<entity>_newton_<chipid>` (e.g. `light_newton_<chipid>`, `light_night_mode_newton_<chipid>`, `temperature_newton_<chipid>`, `human_detected_1_newton_<chipid>`). Thermostat exception: `<chipid>_warm_floor_newton`. Do not rename casually; HA treats it as identity.
- **Nullable:** always check `Valid()` before `Value()`, and marshal only valid fields. `State::operator==` / `LightState::operator==` take non-const references — preserve that unless all call sites change.
- **Logging:** use `LOGx("tag", ...)`; verbose logging comes from `esp_log_level_set("*", ESP_LOG_VERBOSE)` and `CORE_DEBUG_LEVEL=5`. Never log credentials or the OTA auth value.
- **Compiler:** `-Wshadow` is on in every env; do not shadow. English comments and identifiers only.
- **MQTT:** state is non-retained and only published while connected; do not switch to retained without considering HA stale-state behavior.
- **Vendored:** never edit `data/jquery-3.6.0.min.js`, `data/bootstrap.min.js`, `data/bootstrap.min.css`, or `.pio/libdeps`.

## 6. Known bugs and caveats

- `src/thermostat/thermostat.cpp:13` — the second clause `MIN_TEMPERATURE > MAX_TEMPERATURE` is always false; it should compare `_state.setPoint > MAX_TEMPERATURE`. A stored setpoint above 40 is not reset.
- `GET /api/settings` returns Wi-Fi and MQTT passwords in plaintext; the web server has no authentication. Trusted LAN only.
- ArduinoOTA uses a hardcoded password in `src/main.cpp`; the upload auth value is in `platformio.ini`. Reference locations, never values.
- `setup()` waits 10 s unconditionally (`src/main.cpp:63`) and returns early if LittleFS mount fails.
- Network logger is temporary: `192.168.1.2:5555`, `/_bulk`, marked `// tmp`.
- MTD262MB supports only id 1; its `ready()` passes an argument to a non-variadic format string (cosmetic).
- Brightness units differ: `LightState.brightness` is `uint8_t` default 255 and HA scale is 100; `Backlight` maps 0–100 to 0–255 while WB-LED setters clamp above 100. Do not assume one global unit.
- Ethernet constants exist, but `hasEth = false`; current firmware is Wi-Fi only.
- `data/index.html` exposes status/settings, not light/thermostat control.

## 7. Style and definition of done

- Smallest correct change; preserve constructor injection and loop order.
- English comments/identifiers; match formatting, no drive-by reformatting.
- Keep env names and pinned versions stable unless the task is about them.
- Commit subjects: concise, imperative English ("Fix thermostat setpoint clamp").
- Done: `pio run -e kc868a2` succeeds; no new secrets; no FastLED; config layout unchanged or migrated; MQTT/HA keys unchanged unless intended; flash checked after dependency/large changes; docs updated for user-visible changes.
- Review: pins match `defines.h`; addresses/speeds match defaults; logs contain no credentials; vendored files untouched; `-Wshadow` clean; no tests exist.
