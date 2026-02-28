import { useRef, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { transcribeAudio } from '../services/elevenlabs';

export function useRecorder() {
  const { setTranscript, setRecSecs } = useAppContext();

  const [isRec, setIsRec] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recSecsLocal, setRecSecsLocal] = useState(0);
  const [status, setStatus] = useState<'idle' | 'recording' | 'paused' | 'processing' | 'done'>('idle');
  const [transcriptLocal, setTranscriptLocal] = useState('');
  const [micDenied, setMicDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRecRef = useRef(false);
  const isPausedRef = useRef(false);
  const recSecsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  // periodic transcription interval
  const transcribeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // track the last transcript length we appended so we don't re-append
  const lastTranscriptLengthRef = useRef(0);

  async function runTranscription() {
    if (audioChunksRef.current.length === 0) return;
    try {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const fullText = await transcribeAudio(blob);
      if (fullText && fullText.length > lastTranscriptLengthRef.current) {
        lastTranscriptLengthRef.current = fullText.length;
        setTranscriptLocal(fullText);
      }
    } catch (err) {
      // silently keep going on interim transcription errors
      console.warn('Interim transcription error:', err);
    }
  }

  const startRec = useCallback(async () => {
    setError(null);
    setMicDenied(false);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicDenied(true);
      return;
    }

    streamRef.current = stream;
    audioChunksRef.current = [];
    lastTranscriptLengthRef.current = 0;
    recSecsRef.current = 0;
    isRecRef.current = true;
    isPausedRef.current = false;

    setIsRec(true);
    setIsPaused(false);
    setStatus('recording');
    setTranscriptLocal('');
    setRecSecsLocal(0);
    setTranscript('');

    timerRef.current = setInterval(() => {
      recSecsRef.current++;
      setRecSecsLocal(recSecsRef.current);
      setRecSecs(recSecsRef.current);
    }, 1000);

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : '';

    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mr.start(3000); // collect chunks every 3 s

    // transcribe live every 8 seconds
    transcribeIntervalRef.current = setInterval(() => {
      if (isRecRef.current && !isPausedRef.current) {
        void runTranscription();
      }
    }, 8000);
  }, [setTranscript, setRecSecs]);

  const stopRec = useCallback(async () => {
    isRecRef.current = false;
    setIsRec(false);
    setStatus('processing');

    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (transcribeIntervalRef.current) { clearInterval(transcribeIntervalRef.current); transcribeIntervalRef.current = null; }

    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      await new Promise<void>(resolve => {
        mr.onstop = () => resolve();
        mr.stop();
      });
    }

    // Stop microphone
    streamRef.current?.getTracks().forEach(t => t.stop());

    // Final transcription
    try {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const finalText = await transcribeAudio(blob);
      setTranscriptLocal(finalText);
      setTranscript(finalText);
      setRecSecs(recSecsRef.current);
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setStatus('done');
    }
  }, [setTranscript, setRecSecs]);

  const pauseRec = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (!mr || !isRecRef.current) return;

    const nowPaused = !isPausedRef.current;
    isPausedRef.current = nowPaused;
    setIsPaused(nowPaused);
    setStatus(nowPaused ? 'paused' : 'recording');

    if (nowPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mr.state === 'recording') mr.pause();
    } else {
      timerRef.current = setInterval(() => {
        recSecsRef.current++;
        setRecSecsLocal(recSecsRef.current);
        setRecSecs(recSecsRef.current);
      }, 1000);
      if (mr.state === 'paused') mr.resume();
    }
  }, [setRecSecs]);

  function fmtTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  return {
    isRec,
    isPaused,
    status,
    recSecs: recSecsLocal,
    timerDisplay: fmtTime(recSecsLocal),
    transcript: transcriptLocal,
    micDenied,
    error,
    startRec,
    stopRec,
    pauseRec,
    toggleRec: () => (isRecRef.current ? void stopRec() : void startRec()),
  };
}
