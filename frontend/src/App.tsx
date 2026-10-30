import { useState } from 'preact/hooks';
import { TabBar, type TabItem } from './components/TabBar';
import { BackupPanel } from './pages/Backup';
import { ControlPage } from './pages/Control';
import { ModbusPage } from './pages/Modbus';
import { MqttSettingsPage } from './pages/MqttSettings';
import { NetworkPage } from './pages/Network';
import { SensorsPage } from './pages/Sensors';
import { StatusPage } from './pages/Status';

type TabId =
  | 'status'
  | 'sensors'
  | 'control'
  | 'modbus'
  | 'mqtt'
  | 'network'
  | 'backup';

const TABS: ReadonlyArray<TabItem<TabId>> = [
  { id: 'status', label: 'Status' },
  { id: 'sensors', label: 'Sensors' },
  { id: 'control', label: 'Control' },
  { id: 'modbus', label: 'Modbus' },
  { id: 'mqtt', label: 'MQTT' },
  { id: 'network', label: 'Network' },
  { id: 'backup', label: 'Backup' },
];

function renderPanel(tab: TabId) {
  switch (tab) {
    case 'status':
      return <StatusPage />;
    case 'sensors':
      return <SensorsPage />;
    case 'control':
      return <ControlPage />;
    case 'modbus':
      return <ModbusPage />;
    case 'mqtt':
      return <MqttSettingsPage />;
    case 'network':
      return <NetworkPage />;
    case 'backup':
      return <BackupPanel />;
  }
}

export function App() {
  const [tab, setTab] = useState<TabId>('status');

  return (
    <>
      <header class="app-header">
        <div class="brand">
          <h1>Newton</h1>
        </div>
        <span class="hint">KC868-A2 controller</span>
      </header>
      <TabBar tabs={TABS} active={tab} onSelect={setTab} />
      <main
        class="tab-content"
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {renderPanel(tab)}
      </main>
    </>
  );
}
