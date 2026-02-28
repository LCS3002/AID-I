import { useVoiceCommands } from './hooks/useVoiceCommands';
import { LogoBanner } from './components/layout/LogoBanner';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { useAppContext } from './context/AppContext';
import { MapView } from './components/views/MapView/MapView';
import { AedView } from './components/views/AedView/AedView';
import { RecorderView } from './components/views/RecorderView/RecorderView';
import { ReportView } from './components/views/ReportView/ReportView';
import { VoiceView } from './components/views/VoiceView';
import { SettingsView } from './components/views/SettingsView';
import { CallModal } from './components/modal/CallModal';
import { CmdToast } from './components/modal/CmdToast';

export function AppShellWithVoice() {
  const { activeView, cmdToast } = useAppContext();
  useVoiceCommands();

  return (
    <>
      <div className="app-wrap">
        <LogoBanner />
        <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />

          <div id="view-map" className={`view${activeView === 'map' ? ' active' : ''}`}>
            <MapView />
          </div>

          <div id="view-aed" className={`view${activeView === 'aed' ? ' active' : ''}`}>
            <AedView />
          </div>

          <div id="view-recorder" className={`view${activeView === 'recorder' ? ' active' : ''}`}>
            <RecorderView />
          </div>

          <div id="view-report" className={`view${activeView === 'report' ? ' active' : ''}`}>
            <ReportView />
          </div>

          <div id="view-voice" className={`view${activeView === 'voice' ? ' active' : ''}`}>
            <VoiceView />
          </div>

          <div id="view-settings" className={`view${activeView === 'settings' ? ' active' : ''}`}>
            <SettingsView />
          </div>
        </div>
        </div>
      </div>

      <CallModal />
      <CmdToast message={cmdToast} />
    </>
  );
}
