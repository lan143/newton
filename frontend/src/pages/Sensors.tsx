import { useCallback, useEffect, useState } from 'preact/hooks';
import { getSensors } from '../api/client';
import type { SensorReading, SensorsSnapshot } from '../api/types';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const POLL_INTERVAL_MS = 5_000;

function formatSensorValue(sensor: SensorReading): string {
  if (typeof sensor.value === 'boolean') {
    return sensor.value ? 'Detected' : 'Clear';
  }
  switch (sensor.id) {
    case 'temperature':
    case 'air_quality':
      return sensor.value.toFixed(1);
    case 'humidity':
    case 'co2':
    case 'light_level':
      return String(Math.round(sensor.value));
    default:
      return String(sensor.value);
  }
}

export function SensorsPage() {
  const [snapshot, setSnapshot] = useState<SensorsSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

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
      void load();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  if (!loaded) {
    return (
      <Card title="Sensors">
        <p class="muted">Loading sensor snapshot&hellip;</p>
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
        <div class="sensor-grid">
          {snapshot.sensors.map((sensor) => (
            <div
              class={`sensor-card${sensor.available ? '' : ' is-unavailable'}`}
              key={sensor.id}
            >
              <span class="sensor-name">{sensor.name}</span>
              {sensor.available ? (
                <span class="sensor-value">
                  {formatSensorValue(sensor)}
                  {sensor.unit ? (
                    <span class="sensor-unit">{sensor.unit}</span>
                  ) : null}
                </span>
              ) : (
                <span class="sensor-value sensor-unavailable">no data</span>
              )}
            </div>
          ))}

          <div
            class={`sensor-card${
              snapshot.warmFloor.currentTemperatureAvailable ? '' : ' is-unavailable'
            }`}
          >
            <span class="sensor-name">Warm floor sensor</span>
            {snapshot.warmFloor.currentTemperatureAvailable ? (
              <span class="sensor-value">
                {snapshot.warmFloor.currentTemperature.toFixed(1)}
                <span class="sensor-unit">\u00B0C</span>
              </span>
            ) : (
              <span class="sensor-value sensor-unavailable">no data</span>
            )}
          </div>
        </div>
      ) : null}

      <p class="muted">Sensor values refresh automatically every 5 seconds.</p>
    </div>
  );
}
