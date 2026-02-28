export function VoiceView() {
  return (
    <div className="vc-wrap">
      <div className="vc-header">
        <div className="vc-ey">Voice Control · What's Built</div>
        <div className="vc-h-title">Voice Control &amp;<br /><span>Recording System</span></div>
        <p className="vc-h-body">
          Hands-free emergency guidance. AID-I listens passively while you help — ElevenLabs Scribe
          transcribes your recording into text, and the browser's Web Speech API recognises navigation
          commands to control the app without touching the screen.
        </p>
      </div>

      <div className="vc-principle">
        <strong>Core Principle — No AI Responses to You</strong>
        ElevenLabs is used only for audio-to-text transcription (Scribe STT) of your recordings —
        not for voice output or chatbot responses. You are talking to 911, not the app. Navigation
        commands use the browser's built-in Web Speech API and navigate the interface only. The app
        never interrupts, never speaks back, never competes with your real emergency conversation.
      </div>

      <div className="cmd-list" style={{ marginBottom: '1.5px' }}>
        <div className="cmd-hd">Live Voice Commands (Active Now · Web Speech API)</div>
        <div className="cmd-row"><div className="cmd-phrase">"show map"</div><div className="cmd-action">Navigate to the Emergency Map</div></div>
        <div className="cmd-row"><div className="cmd-phrase">"AED guide"</div><div className="cmd-action">Open step-by-step AED guidance</div></div>
        <div className="cmd-row"><div className="cmd-phrase">"start recording"</div><div className="cmd-action">Open recorder and begin transcription</div></div>
        <div className="cmd-row"><div className="cmd-phrase">"show report"</div><div className="cmd-action">Open the protocol report</div></div>
        <div className="cmd-row"><div className="cmd-phrase">"call 911"</div><div className="cmd-action">Open the emergency call dialog</div></div>
        <div className="cmd-row"><div className="cmd-phrase">"next" / "previous"</div><div className="cmd-action">Advance or go back in AED guide steps</div></div>
        <div className="cmd-row"><div className="cmd-phrase">"find AED"</div><div className="cmd-action">Go to map and highlight nearest AED</div></div>
        <div className="cmd-row"><div className="cmd-phrase">"find hospital"</div><div className="cmd-action">Go to map and highlight nearest hospital</div></div>
      </div>

      <div className="vc-grid">
        <div className="vc-card">
          <div className="vc-cn">01 — ElevenLabs</div>
          <div className="vc-ct">Scribe STT Transcription</div>
          <p className="vc-cb">
            ElevenLabs Scribe is used exclusively for audio-to-text transcription of your recordings.
            The recorder sends audio chunks every 8 seconds and a final chunk on stop — Scribe returns
            the text that feeds GPT-4o to generate your ATMIST + ABCDE report.
          </p>
          <div className="vc-tags">
            <span className="vc-tag">STT Only</span>
            <span className="vc-tag">No Voice Output</span>
            <span className="vc-tag">VITE_ELEVENLABS_API_KEY</span>
          </div>
        </div>
        <div className="vc-card">
          <div className="vc-cn">02 — Web Speech API</div>
          <div className="vc-ct">Passive Voice Commands</div>
          <p className="vc-cb">
            A separate always-on SpeechRecognition instance listens for navigation commands —
            "show map", "AED guide", "start recording", and more. Runs independently from the recorder,
            never interrupts, and navigates the app silently in the background.
          </p>
          <div className="vc-tags">
            <span className="vc-tag">Web Speech API</span>
            <span className="vc-tag">Always Active</span>
            <span className="vc-tag">No API Key</span>
          </div>
        </div>
        <div className="vc-card">
          <div className="vc-cn">03 — Navigation Commands</div>
          <div className="vc-ct">Hands-Free Control</div>
          <p className="vc-cb">
            Short, distinct phrases navigate the app without touching the screen. "AED guide" opens
            guidance, "show map" returns to map, "next" advances steps. No response — the screen
            just moves. Say it once, it happens instantly.
          </p>
          <div className="vc-tags">
            <span className="vc-tag">App Navigation</span>
            <span className="vc-tag">No Response</span>
            <span className="vc-tag">Instant</span>
          </div>
        </div>
      </div>

      <div className="vc-flow">
        <div className="vc-flow-hd"><div className="live-dot" />How It Works in a Real Emergency</div>
        <div className="vc-steps">
          <div className="vc-step trigger">
            <div className="vc-node">📞</div>
            <div className="vc-nl">Press 911</div>
            <div className="vc-nd">Voice commands activate automatically</div>
          </div>
          <div className="vc-arr" />
          <div className="vc-step">
            <div className="vc-node">🎙️</div>
            <div className="vc-nl">Tap Record</div>
            <div className="vc-nd">ElevenLabs Scribe transcribes in chunks</div>
          </div>
          <div className="vc-arr" />
          <div className="vc-step">
            <div className="vc-node">🗣️</div>
            <div className="vc-nl">Say "AED guide"</div>
            <div className="vc-nd">Web Speech API navigates, no interruption</div>
          </div>
          <div className="vc-arr" />
          <div className="vc-step">
            <div className="vc-node">📋</div>
            <div className="vc-nl">Protocol Builds</div>
            <div className="vc-nd">GPT-4o structures transcript → ATMIST/ABCDE</div>
          </div>
          <div className="vc-arr" />
          <div className="vc-step">
            <div className="vc-node">🚑</div>
            <div className="vc-nl">Paramedics Arrive</div>
            <div className="vc-nd">Report ready — show screen, done</div>
          </div>
        </div>
      </div>

      <div className="vc-note">
        <div className="vc-nd2" />
        ElevenLabs API key required for recording transcription · Web Speech API needs HTTPS · Voice commands active now
        <div className="vc-nd2" />
      </div>
    </div>
  );
}
