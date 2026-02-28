import { useEffect, useRef, useCallback } from 'react';
import { COMMANDS } from '../constants/voiceCommands';
import { useAppContext } from '../context/AppContext';

export function useVoiceCommands() {
  const {
    navigate, openModal, aedIdx, setAedIdx,
    setPendingAction, activeView,
    setVcListening, showCmdToast, resources,
  } = useAppContext();

  const lastCmdTimeRef = useRef(0);

  // Keep current context values in refs so the stable checkVoiceCommands
  // always sees fresh values without re-registering the cmdRec listener.
  const ctxRef = useRef({ navigate, openModal, aedIdx, setAedIdx, setPendingAction, activeView, showCmdToast, resources });
  ctxRef.current = { navigate, openModal, aedIdx, setAedIdx, setPendingAction, activeView, showCmdToast, resources };

  const checkVoiceCommands = useCallback((text: string) => {
    const now = Date.now();
    if (now - lastCmdTimeRef.current < 2000) return;

    const ctx = { ...ctxRef.current };

    for (const cmd of COMMANDS) {
      for (const phrase of cmd.phrases) {
        if (text.includes(phrase)) {
          lastCmdTimeRef.current = now;
          ctx.showCmdToast(phrase);
          cmd.action(ctx);
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
    const RecClass = SR; // capture narrowed type so spawn() closure can use it

    // Only set to false on unmount / StrictMode cleanup — never on permission
    // errors, so recognition recovers automatically once the user grants mic
    // access (e.g. via the recorder) without needing a page reload.
    let active = true;
    let rec: SpeechRecognition | null = null;

    // Create a fresh SpeechRecognition instance each time — reusing the same
    // instance after Chrome aborts it causes repeated immediate aborts.
    function spawn() {
      if (!active) return;

      const r = new RecClass();
      rec = r;

      r.continuous = true;
      r.interimResults = true;
      r.lang = 'en-US';

      r.onresult = (e: SpeechRecognitionEvent) => {
        const txt = e.results[e.results.length - 1][0].transcript.toLowerCase();
        checkVoiceCommands(txt);
      };

      r.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error === 'not-allowed') {
          setVcListening(false);
          // Keep active=true so onend still triggers a retry — recovers
          // automatically once mic permission is granted.
        } else if (e.error === 'service-not-allowed') {
          active = false;
          setVcListening(false);
        }
        // 'aborted' and 'no-speech' are normal Chrome continuous-mode
        // lifecycle events — onend will spawn a fresh instance.
      };

      // Always spawn a NEW instance on end — avoids Chrome's behaviour of
      // immediately aborting a restarted instance.
      r.onend = () => {
        setTimeout(spawn, 500);
      };

      try {
        r.start();
        setVcListening(true);
      } catch (_) { /* ignore */ }
    }

    // Delay first start so the page settles and avoids a permission
    // prompt firing before the user has interacted with anything.
    const t = setTimeout(spawn, 800);

    return () => {
      active = false;
      clearTimeout(t);
      try { rec?.stop(); } catch (_) { /* ignore */ }
      rec = null;
    };
  }, [checkVoiceCommands, setVcListening]);

  return { checkVoiceCommands };
}
