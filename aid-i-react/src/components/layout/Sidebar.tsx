import { useAppContext } from '../../context/AppContext';
import type { ViewKey } from '../../types';

const NAV_ITEMS: { key: ViewKey; icon: string; label: string }[] = [
  { key: 'map',      icon: '🗺️', label: 'Emergency Map' },
  { key: 'aed',      icon: '⚡', label: 'AED Guide' },
  { key: 'recorder', icon: '🎙️', label: 'AI Recorder' },
  { key: 'report',   icon: '📋', label: 'Protocol Report' },
  { key: 'voice',    icon: '🔊', label: 'Voice Commands' },
];

export function Sidebar() {
  const { activeView, navigate, openModal } = useAppContext();

  return (
    <nav className="sidebar">
      <div className="nav-group">
        {NAV_ITEMS.map(({ key, icon, label }) => (
          <div
            key={key}
            className={`ni${activeView === key ? ' active' : ''}`}
            onClick={() => navigate(key)}
          >
            {icon}
            <span className="ni-tip">{label}</span>
          </div>
        ))}
      </div>

      <div className="nav-bot">
        <div
          className={`ni${activeView === 'settings' ? ' active' : ''}`}
          onClick={() => navigate('settings')}
        >
          ⚙️
          <span className="ni-tip">Settings</span>
        </div>
        <button className="btn-911" onClick={openModal} title="Call 911">📞</button>
      </div>
    </nav>
  );
}
