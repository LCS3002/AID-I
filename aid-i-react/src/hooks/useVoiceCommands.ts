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

    // Only set to false on unmount / StrictMode cleanup — never on permission
    // errors, so recognition recovers automatically once the user grants mic
    // access (e.g. via the recorder) without needing a page reload.
    let active = true;
    let rec: SpeechRecognition | null = null;

    function boot() {
      if (!active) return;
      rec = new SR();
      const r = rec;

      r.continuous = true;
      r.interimResults = true;
      r.lang = 'en-US';

      r.onresult = (e: SpeechRecognitionEvent) => {
        let txt = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          txt += e.results[i][0].transcript;
        }
        checkVoiceCommands(txt.toLowerCase());
      };

      r.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error === 'not-allowed') {
          // Don't kill active — retry on next onend so voice commands
          // automatically recover once the user grants mic permission.
          setVcListening(false);
        } else if (e.error === 'service-not-allowed') {
          // Service genuinely unavailable — stop trying.
          active = false;
          setVcListening(false);
        } else if (e.error !== 'no-speech') {
          console.warn('cmd rec error:', e.error);
        }
      };

      // Chrome throws InvalidStateError if start() is called synchronously
      // inside onend — 300 ms lets the engine fully reset first.
      r.onend = () => {
        setTimeout(() => {
          if (!active) return;
          try { r.start(); } catch (_) { /* ignore */ }
        }, 300);
      };

      try {
        r.start();
        setVcListening(true);
      } catch (_) { /* ignore */ }
    }

    // Delay first start so the page settles and avoids a permission
    // prompt firing before the user has interacted with anything.
    const t = setTimeout(boot, 800);

    return () => {
      active = false;
      clearTimeout(t);
      try { rec?.stop(); } catch (_) { /* ignore */ }
      rec = null;
    };
  }, [checkVoiceCommands, setVcListening]);

  return { checkVoiceCommands };
}
