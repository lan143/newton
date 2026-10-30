import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import {
  getSensors,
  postLightSet,
  postNightModeSet,
  postWarmFloorSet,
  LIMITS,
} from '../api/client';
import type {
  LightSnapshot,
  SensorsSnapshot,
  WarmFloorSetPayload,
} from '../api/types';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Select } from '../components/Select';

const POLL_INTERVAL_MS = 5_000;
const WARM_FLOOR_REFETCH_MS = 300;
const LIGHT_REFETCH_MS = 700;
const NIGHT_MODE_REFETCH_MS = 1_500;
const DEFAULT_TEMP_KELVIN = '4000';

interface ControlCardProps {
  snapshot: SensorsSnapshot;
  scheduleRefetch: (delayMs: number) => void;
  beginSave: () => void;
  endSave: () => void;
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!match) {
    return null;
  }
  const value = parseInt(match[1], 16);
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  };
}

// --- Warm floor card --------------------------------------------------------

function WarmFloorCard({
  snapshot,
  scheduleRefetch,
  beginSave,
  endSave,
}: ControlCardProps) {
  const [mode, setMode] = useState<'off' | 'heat'>(snapshot.warmFloor.mode);
  const [setPoint, setSetPoint] = useState(() => String(snapshot.warmFloor.setPoint));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Values last seeded from the snapshot; a form string equal to them is
  // untouched by the user, so a later poll may resync it (unedited-resync).
  const prevSeedRef = useRef({
    mode: snapshot.warmFloor.mode,
    setPoint: String(snapshot.warmFloor.setPoint),
  });

  useEffect(() => {
    const prev = prevSeedRef.current;
    const nextSeed = {
      mode: snapshot.warmFloor.mode,
      setPoint: String(snapshot.warmFloor.setPoint),
    };
    if (mode === prev.mode && mode !== nextSeed.mode) {
      setMode(nextSeed.mode);
    }
    if (setPoint === prev.setPoint && setPoint !== nextSeed.setPoint) {
      setSetPoint(nextSeed.setPoint);
    }
    prevSeedRef.current = nextSeed;
  }, [snapshot.warmFloor, mode, setPoint]);

  const setPointNumber = Number(setPoint);
  const dirty =
    mode !== snapshot.warmFloor.mode ||
    setPointNumber !== snapshot.warmFloor.setPoint;

  const handleSave = useCallback(
    async (event: Event) => {
      event.preventDefault();
      setSaveError(null);

      const payload: WarmFloorSetPayload = {};
      if (mode !== snapshot.warmFloor.mode) {
        payload.warmFloorMode = mode;
      }

      if (
        !Number.isFinite(setPointNumber) ||
        setPointNumber < LIMITS.warmFloor.setPointMin ||
        setPointNumber > LIMITS.warmFloor.setPointMax
      ) {
        setSaveError(
          `Setpoint must be between ${LIMITS.warmFloor.setPointMin} and ${LIMITS.warmFloor.setPointMax}.`,
        );
        return;
      }
      if (setPointNumber !== snapshot.warmFloor.setPoint) {
        payload.warmFloorSetPoint = setPointNumber;
      }

      if (
        payload.warmFloorMode === undefined &&
        payload.warmFloorSetPoint === undefined
      ) {
        return;
      }

      beginSave();
      setSaving(true);
      try {
        const result = await postWarmFloorSet(payload);
        if (result.ok) {
          scheduleRefetch(WARM_FLOOR_REFETCH_MS);
        } else {
          setSaveError(result.message);
        }
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : String(error));
      } finally {
        setSaving(false);
        endSave();
      }
    },
    [mode, setPointNumber, snapshot.warmFloor, scheduleRefetch, beginSave, endSave],
  );

  return (
    <Card title="Warm floor">
      <dl class="kv">
        <dt>Current temperature</dt>
        <dd
          class={
            snapshot.warmFloor.currentTemperatureAvailable ? undefined : 'muted'
          }
        >
          {snapshot.warmFloor.currentTemperatureAvailable
            ? `${snapshot.warmFloor.currentTemperature.toFixed(1)} \u00B0C`
            : 'no data'}
        </dd>
        <dt>Heating</dt>
        <dd>
          <span
            class={
              snapshot.warmFloor.heating ? 'badge badge-on' : 'badge badge-off'
            }
          >
            {snapshot.warmFloor.heating ? 'Heating' : 'Idle'}
          </span>
        </dd>
      </dl>

      {/* novalidate: JS validators own error rendering. */}
      <form onSubmit={handleSave} novalidate>
        <Select
          label="Mode"
          value={mode}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'heat', label: 'Heat' },
          ]}
          onChange={(value) => setMode(value as 'off' | 'heat')}
          disabled={saving}
        />
        <Field
          label="Setpoint (\u00B0C)"
          value={setPoint}
          onInput={setSetPoint}
          type="number"
          min={LIMITS.warmFloor.setPointMin}
          max={LIMITS.warmFloor.setPointMax}
          step={0.5}
          inputMode="decimal"
          help="Between 16 and 40 \u00B0C."
          disabled={saving}
        />
        {saveError ? (
          <Banner
            kind="error"
            message={saveError}
            onClose={() => setSaveError(null)}
          />
        ) : null}
        <div class="form-actions">
          <Button type="submit" variant="primary" disabled={saving || !dirty}>
            {saving ? 'Saving\u2026' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// --- Light card (main / backlight) ------------------------------------------

interface LightCardProps {
  light: LightSnapshot;
  scheduleRefetch: (delayMs: number) => void;
  beginSave: () => void;
  endSave: () => void;
}

function LightCard({
  light,
  scheduleRefetch,
  beginSave,
  endSave,
}: LightCardProps) {
  const [brightnessStr, setBrightnessStr] = useState(() => String(light.brightness));
  const [tempColorStr, setTempColorStr] = useState(() =>
    light.temperatureAvailable ? String(light.temperature) : DEFAULT_TEMP_KELVIN,
  );
  const [colorHex, setColorHex] = useState(() =>
    light.hasColor && light.colorAvailable
      ? rgbToHex(light.colorR, light.colorG, light.colorB)
      : '#ffffff',
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Snapshot-derived seed values (same expressions as the useState initializers).
  // A form string equal to its seed is untouched by the user, so a later poll
  // may resync it (unedited-resync); edited fields are left alone.
  const prevSeedRef = useRef({
    brightness: String(light.brightness),
    temperature: light.temperatureAvailable
      ? String(light.temperature)
      : DEFAULT_TEMP_KELVIN,
    color:
      light.hasColor && light.colorAvailable
        ? rgbToHex(light.colorR, light.colorG, light.colorB)
        : '#ffffff',
  });

  useEffect(() => {
    const prev = prevSeedRef.current;
    const nextSeed = {
      brightness: String(light.brightness),
      temperature: light.temperatureAvailable
        ? String(light.temperature)
        : DEFAULT_TEMP_KELVIN,
      color:
        light.hasColor && light.colorAvailable
          ? rgbToHex(light.colorR, light.colorG, light.colorB)
          : '#ffffff',
    };
    if (brightnessStr === prev.brightness && brightnessStr !== nextSeed.brightness) {
      setBrightnessStr(nextSeed.brightness);
    }
    if (
      light.temperatureAvailable &&
      tempColorStr === prev.temperature &&
      tempColorStr !== nextSeed.temperature
    ) {
      setTempColorStr(nextSeed.temperature);
    }
    if (
      light.hasColor &&
      light.colorAvailable &&
      colorHex === prev.color &&
      colorHex !== nextSeed.color
    ) {
      setColorHex(nextSeed.color);
    }
    prevSeedRef.current = nextSeed;
  }, [light, brightnessStr, tempColorStr, colorHex]);

  const togglePower = useCallback(async () => {
    setError(null);
    beginSave();
    setSaving(true);
    try {
      const result = await postLightSet({ light: light.id, enabled: !light.enabled });
      if (result.ok) {
        scheduleRefetch(LIGHT_REFETCH_MS);
      } else {
        setError(result.message);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
      endSave();
    }
  }, [light.id, light.enabled, scheduleRefetch, beginSave, endSave]);

  const handleSave = useCallback(
    async (event: Event) => {
      event.preventDefault();
      setError(null);

      const brightness = Number(brightnessStr);
      if (
        brightnessStr.trim() === '' ||
        !Number.isInteger(brightness) ||
        brightness < LIMITS.lights.brightnessMin ||
        brightness > LIMITS.lights.brightnessMax
      ) {
        setError(
          `Brightness must be an integer between ${LIMITS.lights.brightnessMin} and ${LIMITS.lights.brightnessMax}.`,
        );
        return;
      }

      const tempColor = Number(tempColorStr);
      if (
        tempColorStr.trim() === '' ||
        !Number.isInteger(tempColor) ||
        tempColor < LIMITS.lights.tempColorMin ||
        tempColor > LIMITS.lights.tempColorMax
      ) {
        setError(
          `Color temperature must be an integer between ${LIMITS.lights.tempColorMin} and ${LIMITS.lights.tempColorMax} K.`,
        );
        return;
      }

      const payload: Parameters<typeof postLightSet>[0] = { light: light.id };
      if (brightness !== light.brightness) {
        payload.brightness = brightness;
      }
      // Send tempColor only when the user edited the field (differs from the last seed) or the live value differs — never for the untouched placeholder seed.
      if (
        tempColorStr !== prevSeedRef.current.temperature ||
        (light.temperatureAvailable && tempColor !== light.temperature)
      ) {
        payload.tempColor = tempColor;
      }

      if (light.hasColor) {
        const rgb = hexToRgb(colorHex);
        if (!rgb) {
          setError('Invalid color.');
          return;
        }
        if (rgb.r !== light.colorR || rgb.g !== light.colorG || rgb.b !== light.colorB) {
          payload.color = rgb;
        }
      }

      // handleSave never sets `enabled`, so only the control fields can be
      // empty here; `color` is only ever set when hasColor.
      if (
        payload.brightness === undefined &&
        payload.tempColor === undefined &&
        payload.color === undefined
      ) {
        return;
      }

      beginSave();
      setSaving(true);
      try {
        const result = await postLightSet(payload);
        if (result.ok) {
          scheduleRefetch(LIGHT_REFETCH_MS);
        } else {
          setError(result.message);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setSaving(false);
        endSave();
      }
    },
    [
      light,
      brightnessStr,
      tempColorStr,
      colorHex,
      scheduleRefetch,
      beginSave,
      endSave,
    ],
  );

  const handleColorInput = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setColorHex(event.currentTarget.value);
  };

  return (
    <Card title={light.name}>
      <div class="row">
        <span
          class={
            light.enabledAvailable
              ? light.enabled
                ? 'badge badge-on'
                : 'badge badge-off'
              : 'badge badge-off'
          }
        >
          {light.enabledAvailable ? (light.enabled ? 'On' : 'Off') : 'no data'}
        </span>
        <Button onClick={() => void togglePower()} disabled={saving}>
          {light.enabled ? 'Turn off' : 'Turn on'}
        </Button>
      </div>

      {/* novalidate: JS validators own error rendering. */}
      <form onSubmit={handleSave} novalidate>
        <Field
          label="Brightness (0-100)"
          value={brightnessStr}
          onInput={setBrightnessStr}
          type="number"
          min={LIMITS.lights.brightnessMin}
          max={LIMITS.lights.brightnessMax}
          inputMode="numeric"
          help={light.brightnessAvailable ? undefined : 'Current value not available.'}
          disabled={saving}
        />
        <Field
          label="Color temperature (K)"
          value={tempColorStr}
          onInput={setTempColorStr}
          type="number"
          min={LIMITS.lights.tempColorMin}
          max={LIMITS.lights.tempColorMax}
          step={100}
          inputMode="numeric"
          help={light.temperatureAvailable ? undefined : 'Current value not available.'}
          disabled={saving}
        />
        {light.hasColor ? (
          <div class="field">
            <span class="field-label">Color</span>
            <div class="color-picker">
              <input
                type="color"
                value={colorHex}
                disabled={saving}
                aria-label="Color"
                onInput={handleColorInput}
              />
              <span class="mono">{colorHex.toUpperCase()}</span>
            </div>
            {!light.colorAvailable ? (
              <span class="field-help">Current color not available.</span>
            ) : null}
          </div>
        ) : null}
        {error ? (
          <Banner kind="error" message={error} onClose={() => setError(null)} />
        ) : null}
        <div class="form-actions">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving\u2026' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// --- Night mode card --------------------------------------------------------

function NightModeCard({
  snapshot,
  scheduleRefetch,
  beginSave,
  endSave,
}: ControlCardProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = snapshot.nightMode.available;
  const value = snapshot.nightMode.value;

  // Shared explicit-value submit: the available path inverts the known value,
  // the unknown-state path sends a chosen value directly.
  const submit = useCallback(
    async (enabled: boolean) => {
      setError(null);
      beginSave();
      setSaving(true);
      try {
        const result = await postNightModeSet({ enabled });
        if (result.ok) {
          scheduleRefetch(NIGHT_MODE_REFETCH_MS);
        } else {
          setError(result.message);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setSaving(false);
        endSave();
      }
    },
    [scheduleRefetch, beginSave, endSave],
  );

  return (
    <Card title="Night mode">
      <div class="row">
        <span class={value ? 'badge badge-on' : 'badge badge-off'}>
          {available ? (value ? 'On' : 'Off') : 'no data'}
        </span>
        {available ? (
          <Button
            variant="primary"
            onClick={() => void submit(!value)}
            disabled={saving}
          >
            {saving ? 'Saving\u2026' : value ? 'Turn off' : 'Turn on'}
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={() => void submit(true)}
              disabled={saving}
            >
              Turn on
            </Button>
            <Button onClick={() => void submit(false)} disabled={saving}>
              Turn off
            </Button>
          </>
        )}
      </div>
      {error ? (
        <Banner kind="error" message={error} onClose={() => setError(null)} />
      ) : null}
      {!available ? (
        <p class="muted">
          Night-mode state unknown (no MQTT echo, no boot seed); commands are
          still available via the explicit buttons.
        </p>
      ) : null}
    </Card>
  );
}

// --- Page -------------------------------------------------------------------

export function ControlPage() {
  const [snapshot, setSnapshot] = useState<SensorsSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const savingCountRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const load = useCallback(async () => {
    const result = await getSensors();
    if (result.ok) {
      setSnapshot(result.data);
      setLoadError(null);
    } else {
      setLoadError(result.message);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      if (savingCountRef.current === 0) {
        void load();
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    return () => {
      for (const t of timersRef.current) {
        window.clearTimeout(t);
      }
    };
  }, []);

  const scheduleRefetch = useCallback(
    (delayMs: number) => {
      const timer = window.setTimeout(() => {
        timersRef.current = timersRef.current.filter((t) => t !== timer);
        void load();
      }, delayMs);
      timersRef.current.push(timer);
    },
    [load],
  );

  const beginSave = useCallback(() => {
    savingCountRef.current += 1;
  }, []);
  const endSave = useCallback(() => {
    savingCountRef.current = Math.max(0, savingCountRef.current - 1);
  }, []);

  if (!loaded) {
    return (
      <Card title="Control">
        <p class="muted">Loading control snapshot&hellip;</p>
      </Card>
    );
  }

  return (
    <div class="stack">
      {loadError ? (
        <>
          <Banner kind="error" message={loadError} />
          <div class="form-actions">
            <Button onClick={() => void load()}>Retry</Button>
          </div>
        </>
      ) : null}

      {snapshot ? (
        <>
          <WarmFloorCard
            snapshot={snapshot}
            scheduleRefetch={scheduleRefetch}
            beginSave={beginSave}
            endSave={endSave}
          />
          {snapshot.lights.map((light) => (
            <LightCard
              key={light.id}
              light={light}
              scheduleRefetch={scheduleRefetch}
              beginSave={beginSave}
              endSave={endSave}
            />
          ))}
          <NightModeCard
            snapshot={snapshot}
            scheduleRefetch={scheduleRefetch}
            beginSave={beginSave}
            endSave={endSave}
          />
        </>
      ) : null}

      <p class="muted">
        Control values refresh automatically every 5 seconds; after a change the
        device settles within about a second.
      </p>
    </div>
  );
}
