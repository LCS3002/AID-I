import { useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useRecorder } from '../../../hooks/useRecorder';
import { Waveform } from './Waveform';
import { TranscriptPanel } from './TranscriptPanel';

export function RecorderView() {
  const { navigate, pendingAction, setPendingAction, activeView } = useAppContext();
  const {
    isRec, isPaused, status, timerDisplay,
    transcript, micDenied, error,
    startRec, pauseRec, toggleRec,
  } = useRecorder();

  useEffect(() => {
    if (pendingAction === 'startRecording' && activeView === 'recorder') {
      const t = setTimeout(() => {
        void startRec();
        setPendingAction(null);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [pendingAction, activeView, startRec, setPendingAction]);

  const subLabel =
    status === 'recording'  ? 'RECORDING'
    : status === 'paused'   ? 'PAUSED'
    : status === 'processing' ? 'PROCESSING…'
    : status === 'done'     ? 'COMPLETE'
    : 'READY TO RECORD';

  return (
    <>
      <div className="rec-left">
        <Waveform isActive={isRec && !isPaused} />
        <div className="rec-timer">{timerDisplay}</div>
        <div className="rec-sub">{subLabel}</div>

        {micDenied && (
          <div className="mic-warn" style={{ display: 'block' }}>
            Microphone access denied — please allow in browser settings
          </div>
        )}

        <div className="rec-btns">
          <button className="rb sec" onClick={pauseRec} title="Pause" disabled={!isRec}>
            {isPaused ? '▶' : '⏸'}
          </button>
          <button
            className={`rb main${isRec ? ' on' : ''}`}
            onClick={toggleRec}
            title={isRec ? 'Stop' : 'Record'}
            disabled={status === 'processing'}
          >
            {isRec ? '⏹' : '⏺'}
          </button>
          <button className="rb sec" onClick={() => navigate('report')} title="View Report">
            📋
          </button>
        </div>

        <div className="gen-card" onClick={() => navigate('report')}>
          <span className="gen-ic">✦</span>
          <div className="gen-b">
            <div className="gen-t">Generate Protocol Report</div>
            <div className="gen-s">GPT-4o structures transcript → ATMIST + ABCDE</div>
          </div>
          <span className="gen-ar">›</span>
        </div>
      </div>

      <TranscriptPanel transcript={transcript} status={status} error={error} />
    </>
  );
}
