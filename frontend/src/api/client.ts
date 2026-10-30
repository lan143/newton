import type {
  DeviceStatus,
  EmptyObject,
  HealthResponse,
  LightSetPayload,
  ModbusPayload,
  MqttPayload,
  NightModeSetPayload,
  ReadyResponse,
  SensorsSnapshot,
  WarmFloorSetPayload,
} from './types';

/**
 * Client-side safety limits derived from the firmware contract.
 *
 * The firmware `strcpy`s into fixed char buffers, only accepts a fixed Modbus
 * speed enum, and rejects out-of-range values with HTTP 422, so pages must
 * enforce the same (or stricter) caps before a request is sent. String caps
 * mirror the `*_LEN - 1` checks in `src/web/handler.cpp` and `src/config.h`.
 */
export const LIMITS = {
  mqtt: {
    /** `host[64]` (HOST_LEN 64); must be non-empty. */
    hostMin: 1,
    hostMax: 63,
    portMin: 1,
    portMax: 65535,
    /** `login[32]` / `password[32]`; may be empty but must be present. */
    loginMax: 31,
    passwordMax: 31,
    /** `mqttHADiscoveryPrefix[64]` (MQTT_TOPIC_LEN 64); must be non-empty. */
    haDiscoveryPrefixMin: 1,
    haDiscoveryPrefixMax: 63,
    /** `mqttTopicPrefix` (MQTT_TOPIC_PREFIX_MAX_LEN 46); must be non-empty. */
    topicPrefixMin: 1,
    topicPrefixMax: 46,
  },
  modbus: {
    /** The only speeds the firmware switch statement accepts. */
    speeds: [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200],
    addressMin: 1,
    addressMax: 254,
  },
  warmFloor: {
    /** Thermostat clamps the setpoint to 16..40 (`thermostat.cpp`). */
    setPointMin: 16,
    setPointMax: 40,
  },
  lights: {
    /** `brightness` is 0..100 (the EDCommon scale=100 convention). */
    brightnessMin: 0,
    brightnessMax: 100,
    /** CCT is Kelvin 2700..6000 (the WB-LED CCT mapping). */
    tempColorMin: 2700,
    tempColorMax: 6000,
    /** RGB channels are 0..255. */
    rgbMin: 0,
    rgbMax: 255,
  },
} as const;

/** Failure side of every API call. */
export interface ApiFailure {
  ok: false;
  /** HTTP status when a response was received; absent for network failures. */
  status?: number;
  message: string;
}

/** Result of every API call. */
export type ApiResult<T> = { ok: true; data: T } | ApiFailure;

/** Result of a mutating call; the device replies `{}` on success. */
export type ActionResult = ApiResult<EmptyObject>;

const EMPTY_CONFIG_MESSAGE =
  'Device returned an empty response. Check the device logs and try again.';
const EMPTY_BODY_MESSAGE = 'Device returned an empty response.';
const NETWORK_MESSAGE =
  'Could not reach the device. Check that you are connected to its network and try again.';

const EMPTY_OBJECT: EmptyObject = {};

function networkFailure(): ApiFailure {
  return { ok: false, message: NETWORK_MESSAGE };
}

function messageFromBody(text: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
      const value = (parsed as { message?: unknown }).message;
      if (typeof value === 'string' && value) {
        return value;
      }
    }
  } catch {
    // Not JSON; caller falls back to a generic message.
  }
  return undefined;
}

async function failureFromResponse(res: Response): Promise<ApiFailure> {
  let message = `Request failed (HTTP ${res.status}).`;
  try {
    const text = await res.text();
    if (text) {
      message = messageFromBody(text) ?? message;
    }
  } catch {
    // Keep the generic message.
  }
  return { ok: false, status: res.status, message };
}

/** GET a JSON endpoint. `emptyMessage` is used for empty/unparseable 200s. */
async function getJson<T>(
  path: string,
  emptyMessage: string,
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(path, { headers: { Accept: 'application/json' } });
  } catch {
    return networkFailure();
  }

  if (!res.ok) {
    return failureFromResponse(res);
  }

  let text: string;
  try {
    text = await res.text();
  } catch {
    return { ok: false, status: res.status, message: NETWORK_MESSAGE };
  }

  if (!text.trim()) {
    return { ok: false, status: res.status, message: emptyMessage };
  }

  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, status: res.status, message: emptyMessage };
  }
}

/** Send a mutating request; a 200 is success even with an empty body. */
async function send(path: string, init: RequestInit): Promise<ActionResult> {
  let res: Response;
  try {
    res = await fetch(path, init);
  } catch {
    return networkFailure();
  }

  if (!res.ok) {
    return failureFromResponse(res);
  }

  let text = '';
  try {
    text = await res.text();
  } catch {
    return { ok: true, data: EMPTY_OBJECT };
  }

  if (!text.trim()) {
    return { ok: true, data: EMPTY_OBJECT };
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    return {
      ok: true,
      data:
        parsed && typeof parsed === 'object'
          ? (parsed as EmptyObject)
          : EMPTY_OBJECT,
    };
  } catch {
    return { ok: true, data: EMPTY_OBJECT };
  }
}

function sendForm(path: string, body: URLSearchParams): Promise<ActionResult> {
  return send(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: body.toString(),
  });
}

// --- runtime guards ---------------------------------------------------------
// These throw before a request can reach the device with a payload that would
// overflow a firmware buffer or be rejected with HTTP 422.

function requireString(
  value: unknown,
  field: string,
  max: number,
  allowEmpty = false,
): string {
  if (typeof value !== 'string') {
    throw new Error(`${field} is required.`);
  }
  if (!allowEmpty && value.length === 0) {
    throw new Error(`${field} must not be empty.`);
  }
  if (value.length > max) {
    throw new Error(`${field} must be at most ${max} characters.`);
  }
  return value;
}

function requireNumber(
  value: unknown,
  field: string,
  min: number,
  max: number,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${field} must be a number.`);
  }
  if (value < min || value > max) {
    throw new Error(`${field} must be between ${min} and ${max}.`);
  }
  return value;
}

function requireEnum(
  value: unknown,
  field: string,
  allowed: readonly number[],
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${field} must be a number.`);
  }
  if (!allowed.includes(value)) {
    throw new Error(`${field} must be one of: ${allowed.join(', ')}.`);
  }
  return value;
}

// --- reads ------------------------------------------------------------------

/** GET /api/status */
export function getStatus(): Promise<ApiResult<DeviceStatus>> {
  return getJson<DeviceStatus>('/api/status', EMPTY_BODY_MESSAGE);
}

/** GET /healthcheck/healty (misspelled path and key intentionally). */
export function getHealth(): Promise<ApiResult<HealthResponse>> {
  return getJson<HealthResponse>('/healthcheck/healty', EMPTY_BODY_MESSAGE);
}

/**
 * GET /healthcheck/ready. Returns HTTP 500 with `{ready:false,message}` while
 * the device is not ready; that surfaces here as `ok:false` with the reason.
 */
export function getReady(): Promise<ApiResult<ReadyResponse>> {
  return getJson<ReadyResponse>('/healthcheck/ready', EMPTY_BODY_MESSAGE);
}

/** GET /api/settings/modbus */
export function getModbusSettings(): Promise<ApiResult<ModbusPayload>> {
  return getJson<ModbusPayload>('/api/settings/modbus', EMPTY_CONFIG_MESSAGE);
}

/** GET /api/settings/mqtt */
export function getMqttSettings(): Promise<ApiResult<MqttPayload>> {
  return getJson<MqttPayload>('/api/settings/mqtt', EMPTY_CONFIG_MESSAGE);
}

/** GET /api/sensors (cached snapshot, refresh every ~5 s). */
export function getSensors(): Promise<ApiResult<SensorsSnapshot>> {
  return getJson<SensorsSnapshot>('/api/sensors', EMPTY_BODY_MESSAGE);
}

// --- writes -----------------------------------------------------------------

/**
 * POST /api/settings/modbus — speed applies live; addresses need a reboot.
 *
 * `modbusSpeed` must be one of the firmware's statically supported speeds and
 * every address must be 1..254, otherwise the device answers HTTP 422.
 * Invalid input throws client-side instead of being sent.
 */
export function postModbusSettings(
  payload: ModbusPayload,
): Promise<ActionResult> {
  const modbusSpeed = requireEnum(
    payload.modbusSpeed,
    'Modbus speed',
    LIMITS.modbus.speeds,
  );
  const addressWBMSW = requireNumber(
    payload.addressWBMSW,
    'WB-MSW address',
    LIMITS.modbus.addressMin,
    LIMITS.modbus.addressMax,
  );
  const addressWBLED1 = requireNumber(
    payload.addressWBLED1,
    'WB-LED 1 address',
    LIMITS.modbus.addressMin,
    LIMITS.modbus.addressMax,
  );
  const addressWBLED2 = requireNumber(
    payload.addressWBLED2,
    'WB-LED 2 address',
    LIMITS.modbus.addressMin,
    LIMITS.modbus.addressMax,
  );
  const addressWBM1W2 = requireNumber(
    payload.addressWBM1W2,
    'WB-M1W2 address',
    LIMITS.modbus.addressMin,
    LIMITS.modbus.addressMax,
  );
  const addressMTD262MB = requireNumber(
    payload.addressMTD262MB,
    'MTD262MB address',
    LIMITS.modbus.addressMin,
    LIMITS.modbus.addressMax,
  );

  const body = new URLSearchParams();
  body.set('modbusSpeed', String(modbusSpeed));
  body.set('addressWBMSW', String(addressWBMSW));
  body.set('addressWBLED1', String(addressWBLED1));
  body.set('addressWBLED2', String(addressWBLED2));
  body.set('addressWBM1W2', String(addressWBM1W2));
  body.set('addressMTD262MB', String(addressMTD262MB));
  return sendForm('/api/settings/modbus', body);
}

/**
 * POST /api/settings/mqtt — applies after reboot.
 *
 * Always sends all seven parameters. `mqttIsHADiscovery` must always be sent
 * as a literal "true"/"false" (the device rejects the request with HTTP 422
 * when the parameter is absent).
 * `topicPrefix` and `haDiscoveryPrefix` must be non-empty.
 */
export function postMqttSettings(payload: MqttPayload): Promise<ActionResult> {
  const host = requireString(payload.host, 'MQTT host', LIMITS.mqtt.hostMax);
  const port = requireNumber(
    payload.port,
    'MQTT port',
    LIMITS.mqtt.portMin,
    LIMITS.mqtt.portMax,
  );
  const login = requireString(
    payload.login,
    'MQTT login',
    LIMITS.mqtt.loginMax,
    true,
  );
  const password = requireString(
    payload.password,
    'MQTT password',
    LIMITS.mqtt.passwordMax,
    true,
  );
  const haDiscoveryPrefix = requireString(
    payload.haDiscoveryPrefix,
    'HA discovery prefix',
    LIMITS.mqtt.haDiscoveryPrefixMax,
  );
  const topicPrefix = requireString(
    payload.topicPrefix,
    'MQTT topic prefix',
    LIMITS.mqtt.topicPrefixMax,
  );

  const body = new URLSearchParams();
  body.set('host', host);
  body.set('port', String(port));
  body.set('login', login);
  body.set('password', password);
  body.set('haDiscoveryPrefix', haDiscoveryPrefix);
  body.set('mqttIsHADiscovery', payload.mqttIsHADiscovery ? 'true' : 'false');
  body.set('topicPrefix', topicPrefix);
  return sendForm('/api/settings/mqtt', body);
}

/**
 * POST /api/warm_floor/set — takes effect immediately.
 *
 * Sends only the fields that were provided. At least one must be present or
 * the client throws before sending. The setpoint is clamped client-side to
 * 16..40 (the firmware clamps identically, so this is a UX guard, not new
 * behaviour).
 */
export function postWarmFloorSet(
  payload: WarmFloorSetPayload,
): Promise<ActionResult> {
  const body = new URLSearchParams();

  if (payload.warmFloorMode !== undefined) {
    if (
      payload.warmFloorMode !== 'off' &&
      payload.warmFloorMode !== 'heat'
    ) {
      throw new Error('Mode must be "off" or "heat".');
    }
    body.set('warmFloorMode', payload.warmFloorMode);
  }

  if (payload.warmFloorSetPoint !== undefined) {
    const setPoint = requireNumber(
      payload.warmFloorSetPoint,
      'Setpoint',
      LIMITS.warmFloor.setPointMin,
      LIMITS.warmFloor.setPointMax,
    );
    body.set('warmFloorSetPoint', String(setPoint));
  }

  if (!body.has('warmFloorMode') && !body.has('warmFloorSetPoint')) {
    throw new Error('Nothing to save: provide a mode and/or a setpoint.');
  }

  return sendForm('/api/warm_floor/set', body);
}

/**
 * POST /api/light/set — applies immediately (queue-based, drained on the next
 * device `update()` tick).
 *
 * Sends only the fields the user changed. At least one control field must be
 * present, and `color` is rejected for the main light (no color control).
 */
export function postLightSet(payload: LightSetPayload): Promise<ActionResult> {
  if (payload.light !== 'main' && payload.light !== 'back') {
    throw new Error('Light must be "main" or "back".');
  }

  const body = new URLSearchParams();
  body.set('light', payload.light);

  if (payload.enabled !== undefined) {
    if (typeof payload.enabled !== 'boolean') {
      throw new Error('Enabled must be true or false.');
    }
    body.set('enabled', payload.enabled ? 'on' : 'off');
  }

  if (payload.brightness !== undefined) {
    const brightness = requireNumber(
      payload.brightness,
      'Brightness',
      LIMITS.lights.brightnessMin,
      LIMITS.lights.brightnessMax,
    );
    if (!Number.isInteger(brightness)) {
      throw new Error('Brightness must be an integer.');
    }
    body.set('brightness', String(brightness));
  }

  if (payload.tempColor !== undefined) {
    const tempColor = requireNumber(
      payload.tempColor,
      'Color temperature',
      LIMITS.lights.tempColorMin,
      LIMITS.lights.tempColorMax,
    );
    if (!Number.isInteger(tempColor)) {
      throw new Error('Color temperature must be an integer.');
    }
    body.set('tempColor', String(tempColor));
  }

  if (payload.color !== undefined) {
    if (payload.light === 'main') {
      throw new Error('The main light has no color control.');
    }
    const r = requireNumber(payload.color.r, 'Red', LIMITS.lights.rgbMin, LIMITS.lights.rgbMax);
    const g = requireNumber(payload.color.g, 'Green', LIMITS.lights.rgbMin, LIMITS.lights.rgbMax);
    const b = requireNumber(payload.color.b, 'Blue', LIMITS.lights.rgbMin, LIMITS.lights.rgbMax);
    if (!Number.isInteger(r) || !Number.isInteger(g) || !Number.isInteger(b)) {
      throw new Error('Color channels must be integers.');
    }
    body.set('color', `${r},${g},${b}`);
  }

  if (
    !body.has('enabled') &&
    !body.has('brightness') &&
    !body.has('tempColor') &&
    !body.has('color')
  ) {
    throw new Error('Nothing to send: provide a control value.');
  }

  return sendForm('/api/light/set', body);
}

/**
 * POST /api/light_automation/set — toggles night mode. Takes effect on the next
 * device `update()`; the reflected value echoes back via MQTT.
 */
export function postNightModeSet(
  payload: NightModeSetPayload,
): Promise<ActionResult> {
  if (typeof payload.enabled !== 'boolean') {
    throw new Error('Enabled must be true or false.');
  }

  const body = new URLSearchParams();
  body.set('enabled', payload.enabled ? 'true' : 'false');
  return sendForm('/api/light_automation/set', body);
}

/** POST /api/reboot — the device replies `{}` then restarts. */
export function reboot(): Promise<ActionResult> {
  return send('/api/reboot', { method: 'POST' });
}
