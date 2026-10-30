import { useCallback, useEffect, useState } from 'preact/hooks';
import { getMqttSettings, postMqttSettings, LIMITS } from '../api/client';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Checkbox } from '../components/Checkbox';
import { Field } from '../components/Field';
import { NeedsRebootNotice } from '../components/NeedsRebootNotice';
import { PasswordField } from '../components/PasswordField';

interface MqttForm {
  host: string;
  port: string;
  login: string;
  password: string;
  haDiscoveryPrefix: string;
  mqttIsHADiscovery: boolean;
  topicPrefix: string;
}

interface MqttErrors {
  host?: string;
  port?: string;
  login?: string;
  password?: string;
  haDiscoveryPrefix?: string;
  topicPrefix?: string;
}

const EMPTY_MQTT: MqttForm = {
  host: '',
  port: '',
  login: '',
  password: '',
  haDiscoveryPrefix: '',
  mqttIsHADiscovery: false,
  topicPrefix: '',
};

function validateMqtt(form: MqttForm): MqttErrors {
  const errors: MqttErrors = {};

  if (form.host.trim().length === 0) {
    errors.host = 'Host is required.';
  } else if (form.host.length > LIMITS.mqtt.hostMax) {
    errors.host = `At most ${LIMITS.mqtt.hostMax} characters.`;
  }

  const port = Number(form.port);
  if (form.port.trim() === '') {
    errors.port = 'Port is required.';
  } else if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.port = 'Port must be an integer between 1 and 65535.';
  }

  if (form.login.length > LIMITS.mqtt.loginMax) {
    errors.login = `At most ${LIMITS.mqtt.loginMax} characters.`;
  }
  if (form.password.length > LIMITS.mqtt.passwordMax) {
    errors.password = `At most ${LIMITS.mqtt.passwordMax} characters.`;
  }

  if (form.haDiscoveryPrefix.trim().length === 0) {
    errors.haDiscoveryPrefix = 'Discovery prefix is required.';
  } else if (form.haDiscoveryPrefix.length > LIMITS.mqtt.haDiscoveryPrefixMax) {
    errors.haDiscoveryPrefix = `At most ${LIMITS.mqtt.haDiscoveryPrefixMax} characters.`;
  }

  if (form.topicPrefix.trim().length === 0) {
    errors.topicPrefix = 'Topic prefix is required.';
  } else if (form.topicPrefix.length > LIMITS.mqtt.topicPrefixMax) {
    errors.topicPrefix = `At most ${LIMITS.mqtt.topicPrefixMax} characters.`;
  }

  return errors;
}

function hasErrors(errors: object): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}

export function MqttSettingsPage() {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [mqtt, setMqtt] = useState<MqttForm>(EMPTY_MQTT);
  const [mqttErrors, setMqttErrors] = useState<MqttErrors>({});

  const [mqttSaving, setMqttSaving] = useState(false);
  const [mqttNotice, setMqttNotice] = useState<string | null>(null);
  const [mqttError, setMqttError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const result = await getMqttSettings();
    if (result.ok) {
      setMqtt({
        host: result.data.host,
        port: String(result.data.port),
        login: result.data.login,
        password: result.data.password,
        haDiscoveryPrefix: result.data.haDiscoveryPrefix,
        mqttIsHADiscovery: result.data.mqttIsHADiscovery,
        topicPrefix: result.data.topicPrefix,
      });
    } else {
      setLoadError(result.message);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateMqtt = (patch: Partial<MqttForm>) =>
    setMqtt((current) => ({ ...current, ...patch }));

  const handleMqttSubmit = useCallback(
    async (event: Event) => {
      event.preventDefault();
      const errors = validateMqtt(mqtt);
      setMqttErrors(errors);
      setMqttNotice(null);
      setMqttError(null);
      if (hasErrors(errors)) {
        return;
      }

      setMqttSaving(true);
      try {
        const result = await postMqttSettings({
          host: mqtt.host,
          port: Number(mqtt.port),
          login: mqtt.login,
          password: mqtt.password,
          haDiscoveryPrefix: mqtt.haDiscoveryPrefix,
          mqttIsHADiscovery: mqtt.mqttIsHADiscovery,
          topicPrefix: mqtt.topicPrefix,
        });
        if (result.ok) {
          setMqttNotice('MQTT settings saved to flash.');
        } else {
          setMqttError(result.message);
        }
      } catch (error) {
        setMqttError(error instanceof Error ? error.message : String(error));
      } finally {
        setMqttSaving(false);
      }
    },
    [mqtt],
  );

  if (!loaded) {
    return (
      <Card title="MQTT">
        <p class="muted">Loading MQTT settings&hellip;</p>
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

      <Card title="MQTT">
        {/* novalidate: JS validators own error rendering; native constraint validation would silently block submit. */}
        <form onSubmit={handleMqttSubmit} novalidate>
          <Field
            label="Host"
            value={mqtt.host}
            onInput={(value) => updateMqtt({ host: value })}
            maxLength={LIMITS.mqtt.hostMax}
            error={mqttErrors.host}
            autoComplete="off"
            disabled={mqttSaving}
          />
          <Field
            label="Port"
            value={mqtt.port}
            onInput={(value) => updateMqtt({ port: value })}
            type="number"
            min={1}
            max={65535}
            inputMode="numeric"
            error={mqttErrors.port}
            disabled={mqttSaving}
          />
          <Field
            label="Login"
            value={mqtt.login}
            onInput={(value) => updateMqtt({ login: value })}
            maxLength={LIMITS.mqtt.loginMax}
            error={mqttErrors.login}
            autoComplete="off"
            disabled={mqttSaving}
          />
          <PasswordField
            label="Password"
            value={mqtt.password}
            onInput={(value) => updateMqtt({ password: value })}
            maxLength={LIMITS.mqtt.passwordMax}
            error={mqttErrors.password}
            autoComplete="new-password"
            disabled={mqttSaving}
          />
          <Field
            label="HA discovery prefix"
            value={mqtt.haDiscoveryPrefix}
            onInput={(value) => updateMqtt({ haDiscoveryPrefix: value })}
            maxLength={LIMITS.mqtt.haDiscoveryPrefixMax}
            error={mqttErrors.haDiscoveryPrefix}
            autoComplete="off"
            disabled={mqttSaving}
          />
          <Checkbox
            label="Enable Home Assistant discovery"
            checked={mqtt.mqttIsHADiscovery}
            onChange={(checked) => updateMqtt({ mqttIsHADiscovery: checked })}
            disabled={mqttSaving}
          />
          <Field
            label="Topic prefix"
            value={mqtt.topicPrefix}
            onInput={(value) => updateMqtt({ topicPrefix: value })}
            maxLength={LIMITS.mqtt.topicPrefixMax}
            error={mqttErrors.topicPrefix}
            help="Prefix for every MQTT entity topic (e.g. newton/<chipid>)."
            autoComplete="off"
            disabled={mqttSaving}
          />
          {mqttNotice ? (
            <Banner
              kind="success"
              message={mqttNotice}
              onClose={() => setMqttNotice(null)}
            />
          ) : null}
          {mqttError ? (
            <Banner
              kind="error"
              message={mqttError}
              onClose={() => setMqttError(null)}
            />
          ) : null}
          <div class="form-actions">
            <Button type="submit" variant="primary" disabled={mqttSaving}>
              {mqttSaving ? 'Saving\u2026' : 'Save MQTT'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
