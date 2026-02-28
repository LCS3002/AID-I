interface Props {
  transcript: string;
  status: 'idle' | 'recording' | 'paused' | 'processing' | 'done';
  error: string | null;
}

const STATUS_LABELS: Record<Props['status'], string> = {
  idle:       'Waiting for recording',
  recording:  'Recording · ElevenLabs transcribing',
  paused:     'Paused',
  processing: 'Processing via ElevenLabs…',
  done:       'Transcription complete',
};

export function TranscriptPanel({ transcript, status, error }: Props) {
  const isLive = status === 'recording';
  const dotStyle = isLive ? {} : { animation: 'none', opacity: 0.2 };

  const placeholder =
    'Tap ⏺ to begin recording. ElevenLabs transcribes your speech in real time, then GPT-4o structures it into ATMIST + ABCDE.';

  return (
    <div className="tp">
      <div className="tp-hd">
        <div className="tp-title">Live Transcript</div>
        <div className="tp-status">
          <div className="live-dot" style={dotStyle} />
          <span>{STATUS_LABELS[status]}</span>
        </div>
      </div>
      <div className="tp-scroll">
        {error ? (
          <div className="tp-text" style={{ color: 'var(--red)', fontFamily: "'Space Mono',monospace", fontSize: '.6rem', letterSpacing: '.1em' }}>
            ⚠ {error}
          </div>
        ) : (
          <div className="tp-text">
            {transcript || placeholder}
            {isLive && <span className="tp-cur" />}
          </div>
        )}
      </div>
    </div>
  );
}
