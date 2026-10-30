/**
 * Response and request shapes for the Newton device HTTP API.
 *
 * These mirror the firmware contracts in `src/web/handler.cpp` and the config
 * struct in `src/config.h`. GET response interfaces match the JSON the device
 * actually emits; request payload interfaces are the fields the POST handlers
 * read from a form-urlencoded body.
 */

/** GET /api/status. `uptime` is seconds since boot. */
export interface DeviceStatus {
  wifiStatus: 'connected' | 'disconnected';
  freeHeap: number;
  uptime: number;
  lastResetReason: string;
}

/** GET /healthcheck/healty (misspelled intentionally by the firmware lib). */
export interface HealthResponse {
  healty: boolean;
}

/** GET /healthcheck/ready. */
export interface ReadyResponse {
  ready: boolean;
  message: string;
}

/**
 * GET /api/settings/modbus and POST /api/settings/modbus.
 *
 * The POST requires all six fields to be present. `modbusSpeed` must be one of
 * the firmware's supported baud rates and every address must be 1..254.
 */
export interface ModbusPayload {
  modbusSpeed: number;
  addressWBMSW: number;
  addressWBLED1: number;
  addressWBLED2: number;
  addressWBM1W2: number;
  addressMTD262MB: number;
}

/**
 * GET /api/settings/mqtt and POST /api/settings/mqtt.
 *
 * The POST always receives `mqttIsHADiscovery` as a literal "true"/"false"
 * (an absent value would silently become false). Field names are identical
 * between GET and POST.
 */
export interface MqttPayload {
  host: string;
  port: number;
  login: string;
  password: string;
  haDiscoveryPrefix: string;
  mqttIsHADiscovery: boolean;
  topicPrefix: string;
}

/** One read-only sensor reading in GET /api/sensors. */
export interface SensorReading {
  id: string;
  name: string;
  unit: string;
  /** Number for the five environmental sensors, boolean for presence. */
  value: number | boolean;
  available: boolean;
}

/** Warm-floor state in GET /api/sensors. */
export interface WarmFloorState {
  mode: 'off' | 'heat';
  setPoint: number;
  currentTemperature: number;
  currentTemperatureAvailable: boolean;
  heating: boolean;
}

/** One controllable light in GET /api/sensors (`lights[]`). */
export interface LightSnapshot {
  id: 'main' | 'back';
  name: string;
  hasColor: boolean;
  enabled: boolean;
  enabledAvailable: boolean;
  brightness: number;
  brightnessAvailable: boolean;
  temperature: number;
  temperatureAvailable: boolean;
  colorAvailable: boolean;
  colorR: number;
  colorG: number;
  colorB: number;
}

/** Night-mode automation state in GET /api/sensors. */
export interface NightModeState {
  value: boolean;
  available: boolean;
}

/** GET /api/sensors payload. */
export interface SensorsSnapshot {
  sensors: SensorReading[];
  warmFloor: WarmFloorState;
  lights: LightSnapshot[];
  nightMode: NightModeState;
}

/**
 * POST /api/warm_floor/set.
 *
 * At least one of the two fields must be present. The client sends only the
 * fields the user changed; the firmware clamps the setpoint to 16..40 itself,
 * but the client enforces the same range before sending.
 */
export interface WarmFloorSetPayload {
  warmFloorMode?: 'off' | 'heat';
  warmFloorSetPoint?: number;
}

/**
 * POST /api/light/set.
 *
 * `light` is required; at least one control field must be present. `color` is
 * only valid for the backlight (`id === 'back'`).
 */
export interface LightSetPayload {
  light: 'main' | 'back';
  enabled?: boolean;
  brightness?: number;
  tempColor?: number;
  color?: { r: number; g: number; b: number };
}

/** POST /api/light_automation/set. */
export interface NightModeSetPayload {
  enabled: boolean;
}

/** Successful response data for mutating endpoints (the device replies `{}`). */
export type EmptyObject = Record<string, never>;
