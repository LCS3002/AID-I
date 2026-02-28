import { useAppContext } from '../../context/AppContext';

export function CallModal() {
  const { isModalOpen, closeModal, navigate, setPendingAction, cityName } = useAppContext();

  function confirmCall() {
    closeModal();
    navigate('recorder');
    setPendingAction('startRecording');
  }

  return (
    <div className={`modal-bg${isModalOpen ? ' open' : ''}`} id="modal">
      <div className="call-modal">
        <div className="cm-ey">
          <div className="live-dot" />
          Connecting to Emergency Services
        </div>
        <div className="cm-num">911</div>
        <div className="cm-loc">
          United States Emergency Services<br />
          <strong>{cityName} · Auto-detected</strong>
        </div>
        <div className="cm-btns">
          <button className="cm-btn no" onClick={closeModal}>✕</button>
          <button className="cm-btn go" onClick={confirmCall}>📞</button>
        </div>
      </div>
    </div>
  );
}
