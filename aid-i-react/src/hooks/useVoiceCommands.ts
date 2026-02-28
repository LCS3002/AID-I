import { useEffect, useRef, useCallback } from 'react';
import { COMMANDS } from '../constants/voiceCommands';
import { useAppContext } from '../context/AppContext';

export function useVoiceCommands() {
  const {
    navigate, openModal, aedIdx, setAedIdx,
    setPendingAction, activeView,
    setVcListening, showCmdToast, resources,
  } = useAppContext();

  const lastCmdTextRef = useRef('');

  // Keep current context values in refs so the stable checkVoiceCommands
  // always sees fresh values without re-registering the cmdRec listener.
  const ctxRef = useRef({ navigate, openModal, aedIdx, setAedIdx, setPendingAction, activeView, showCmdToast, resources });
  ctxRef.current = { navigate, openModal, aedIdx, setAedIdx, setPendingAction, activeView, showCmdToast, resources };

  const checkVoiceCommands = useCallback((text: string) => {
    if (text === lastCmdTextRef.current) return;
    lastCmdTextRef.current = text;

    const ctx = { ...ctxRef.current };

    for (const cmd of COMMANDS) {
      for (const phrase of cmd.phrases) {
        if (text.includes(phrase)) {
          ctx.showCmdToast(phrase);
          cmd.action(ctx);
          lastCmdTextRef.current = ''; // reset so the same command can fire again
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR: (new () => SpeechRecognition) | undefined =
      w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    // Tracks whether this effect instance is still alive.
    // Set to false in cleanup so the onend restart doesn't fire after unmount
    // or React StrictMode's double-invocation of effects.
    let active = true;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let txt = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        txt += e.results[i][0].transcript;
      }
      checkVoiceCommands(txt.toLowerCase());
    };

    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        active = false;
        setVcListening(false);
      } else if (e.error !== 'no-speech') {
        console.warn('cmd rec error:', e.error);
      }
    };

    // Chrome throws InvalidStateError if rec.start() is called synchronously
    // inside onend — a small delay lets the engine fully reset first.
    rec.onend = () => {
      setTimeout(() => {
        if (!active) return;
        try { rec.start(); } catch (_) { /* ignore */ }
      }, 150);
    };

    try {
      rec.start();
      setVcListening(true);
    } catch (_) { /* ignore */ }

    return () => {
      active = false;
      try { rec.stop(); } catch (_) { /* ignore */ }
    };
  }, [checkVoiceCommands, setVcListening]);

  return { checkVoiceCommands };
}
