import { useAppContext } from '../../context/AppContext';
import { VIEW_META } from '../../constants/viewMeta';

export function Topbar() {
  const { activeView, openModal, vcListening } = useAppContext();
  const showCta = ['map', 'aed', 'recorder'].includes(activeView);

  return (
    <div className="topbar">
      <span className="tb-title">{VIEW_META[activeView]}</span>
      <div className="live-badge">
        <div className="live-dot" />
        Live · GPS Active
      </div>
      <div
        className={`vc-indicator${vcListening ? ' listening' : ''}`}
        title="Voice commands active — say 'show map', 'AED guide', 'start recording', 'show report'"
      >
        <div className="vc-dot" />
        Voice Commands
      </div>
      <div className="tb-spacer" />
      {showCta && (
        <button className="btn-primary" onClick={openModal}>📞 &nbsp;Call 911</button>
      )}
    </div>
  );
}
