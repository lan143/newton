import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { getModbusSettings, postModbusSettings, LIMITS } from '../api/client';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { NeedsRebootNotice } from '../components/NeedsRebootNotice';
import { Select, type SelectOption } from '../components/Select';

interface ModbusForm {
  modbusSpeed: string;
  addressWBMSW: string;
  addressWBLED1: string;
  addressWBLED2: string;
  addressWBM1W2: string;
  addressMTD262MB: string;
}

interface ModbusErrors {
  addressWBMSW?: string;
  addressWBLED1?: string;
  addressWBLED2?: string;
  addressWBM1W2?: string;
  addressMTD262MB?: string;
}

const EMPTY_MODBUS: ModbusForm = {
  modbusSpeed: '9600',
  addressWBMSW: '',
  addressWBLED1: '',
  addressWBLED2: '',
  addressWBM1W2: '',
  addressMTD262MB: '',
};

function parseNumber(raw: string): number | null {
  if (raw.trim() === '') {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function hasErrors(errors: object): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}

function speedOptions(current: string): SelectOption[] {
  const options: SelectOption[] = LIMITS.modbus.speeds.map((speed) => ({
    value: String(speed),
    label: `${speed} baud`,
  }));
  const value = parseNumber(current);
  if (
    value !== null &&
    !(LIMITS.modbus.speeds as readonly number[]).includes(value)
  ) {
    options.unshift({ value: current, label: `${current} (current)` });
  }
  return options;
}

function validateAddress(raw: string, label: string): string | undefined {
  const value = parseNumber(raw);
  if (
    value === null ||
    !Number.isInteger(value) ||
    value < LIMITS.modbus.addressMin ||
    value > LIMITS.modbus.addressMax
  ) {
    return `${label} must be an integer between ${LIMITS.modbus.addressMin} and ${LIMITS.modbus.addressMax}.`;
  }
  return undefined;
}

export function ModbusPage() {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<ModbusForm>(EMPTY_MODBUS);
  const [errors, setErrors] = useState<ModbusErrors>({});

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const options = useMemo(() => speedOptions(form.modbusSpeed), [form.modbusSpeed]);

  const load = useCallback(async () => {
    setLoadError(null);
    const result = await getModbusSettings();
    if (result.ok) {
      setForm({
        modbusSpeed: String(result.data.modbusSpeed),
        addressWBMSW: String(result.data.addressWBMSW),
        addressWBLED1: String(result.data.addressWBLED1),
        addressWBLED2: String(result.data.addressWBLED2),
        addressWBM1W2: String(result.data.addressWBM1W2),
        addressMTD262MB: String(result.data.addressMTD262MB),
      });
    } else {
      setLoadError(result.message);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = (patch: Partial<ModbusForm>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = useCallback(
    async (event: Event) => {
      event.preventDefault();
      const nextErrors: ModbusErrors = {
        addressWBMSW: validateAddress(form.addressWBMSW, 'WB-MSW address'),
        addressWBLED1: validateAddress(form.addressWBLED1, 'WB-LED 1 address'),
        addressWBLED2: validateAddress(form.addressWBLED2, 'WB-LED 2 address'),
        addressWBM1W2: validateAddress(form.addressWBM1W2, 'WB-M1W2 address'),
        addressMTD262MB: validateAddress(form.addressMTD262MB, 'MTD262MB address'),
      };
      setErrors(nextErrors);
      setNotice(null);
      setSaveError(null);
      if (hasErrors(nextErrors)) {
        return;
      }

      setSaving(true);
      try {
        const result = await postModbusSettings({
          modbusSpeed: Number(form.modbusSpeed),
          addressWBMSW: Number(form.addressWBMSW),
          addressWBLED1: Number(form.addressWBLED1),
          addressWBLED2: Number(form.addressWBLED2),
          addressWBM1W2: Number(form.addressWBM1W2),
          addressMTD262MB: Number(form.addressMTD262MB),
        });
        if (result.ok) {
          setNotice('Modbus settings saved to flash.');
        } else {
          setSaveError(result.message);
        }
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : String(error));
      } finally {
        setSaving(false);
      }
    },
    [form],
  );

  if (!loaded) {
    return (
      <Card title="Modbus">
        <p class="muted">Loading Modbus settings&hellip;</p>
      </Card>
    );
  }

  return (
    <div class="stack">
      <NeedsRebootNotice />

      {loadError ? (
        <>
          <Banner kind="error" message={loadError} />
          <div class="form-actions">
            <Button onClick={() => void load()}>Retry</Button>
          </div>
        </>
      ) : null}

      <Card title="Modbus">
        {/* novalidate: JS validators own error rendering; native constraint validation would silently block submit. */}
        <form onSubmit={handleSubmit} novalidate>
          <Select
            label="Bus speed"
            value={form.modbusSpeed}
            options={options}
            onChange={(value) => update({ modbusSpeed: value })}
            help="Applies live. Only the speeds supported by the firmware are listed."
            disabled={saving}
          />
          <Field
            label="WB-MSW address"
            value={form.addressWBMSW}
            onInput={(value) => update({ addressWBMSW: value })}
            type="number"
            min={LIMITS.modbus.addressMin}
            max={LIMITS.modbus.addressMax}
            inputMode="numeric"
            error={errors.addressWBMSW}
            help="Climate / air-quality / light sensor."
            disabled={saving}
          />
          <Field
            label="WB-LED 1 address"
            value={form.addressWBLED1}
            onInput={(value) => update({ addressWBLED1: value })}
            type="number"
            min={LIMITS.modbus.addressMin}
            max={LIMITS.modbus.addressMax}
            inputMode="numeric"
            error={errors.addressWBLED1}
            help="Main CCT light."
            disabled={saving}
          />
          <Field
            label="WB-LED 2 address"
            value={form.addressWBLED2}
            onInput={(value) => update({ addressWBLED2: value })}
            type="number"
            min={LIMITS.modbus.addressMin}
            max={LIMITS.modbus.addressMax}
            inputMode="numeric"
            error={errors.addressWBLED2}
            help="RGBW backlight."
            disabled={saving}
          />
          <Field
            label="WB-M1W2 address"
            value={form.addressWBM1W2}
            onInput={(value) => update({ addressWBM1W2: value })}
            type="number"
            min={LIMITS.modbus.addressMin}
            max={LIMITS.modbus.addressMax}
            inputMode="numeric"
            error={errors.addressWBM1W2}
            help="1-Wire warm-floor temperature."
            disabled={saving}
          />
          <Field
            label="MTD262MB address"
            value={form.addressMTD262MB}
            onInput={(value) => update({ addressMTD262MB: value })}
            type="number"
            min={LIMITS.modbus.addressMin}
            max={LIMITS.modbus.addressMax}
            inputMode="numeric"
            error={errors.addressMTD262MB}
            help="Presence sensor."
            disabled={saving}
          />
          {notice ? (
            <Banner
              kind="success"
              message={notice}
              onClose={() => setNotice(null)}
            />
          ) : null}
          {saveError ? (
            <Banner
              kind="error"
              message={saveError}
              onClose={() => setSaveError(null)}
            />
          ) : null}
          <div class="form-actions">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving\u2026' : 'Save Modbus'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
