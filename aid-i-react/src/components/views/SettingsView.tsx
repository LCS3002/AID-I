export function SettingsView() {
  return (
    <div className="st-wrap">
      <div className="st-title">Settings</div>
      <div className="st-sub">Configure AID-I for your environment</div>

      <div className="sg-label">Emergency</div>
      <div className="sg-card">
        <div className="sg-row">
          <span className="sg-ic">📞</span>
          <div className="sg-info">
            <div className="sg-l">Emergency Number</div>
            <div className="sg-v">911 · Auto-detected (US)</div>
          </div>
          <div className="sg-chip">AUTO</div>
        </div>
        <div className="sg-row">
          <span className="sg-ic">⚡</span>
          <div className="sg-info">
            <div className="sg-l">AED Search Radius</div>
            <div className="sg-v">2 km from current location</div>
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.55rem', color: 'var(--muted)', border: '1px solid var(--bdim)', padding: '3px 7px', borderRadius: '2px' }}>2 KM ›</div>
        </div>
      </div>

      <div className="sg-label">AI Recorder</div>
      <div className="sg-card">
        <div className="sg-row">
          <span className="sg-ic">🎙️</span>
          <div className="sg-info">
            <div className="sg-l">Auto-start on 911 Call</div>
            <div className="sg-v">Recorder activates when call is confirmed</div>
          </div>
          <div className="toggle" />
        </div>
        <div className="sg-row">
          <span className="sg-ic">📋</span>
          <div className="sg-info">
            <div className="sg-l">Protocol Format</div>
            <div className="sg-v">AMIST + ABCDE (Standard)</div>
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '.55rem', color: 'var(--muted)', border: '1px solid var(--bdim)', padding: '3px 7px', borderRadius: '2px' }}>EDIT ›</div>
        </div>
        <div className="sg-row">
          <span className="sg-ic">🔒</span>
          <div className="sg-info">
            <div className="sg-l">Store Reports Locally</div>
            <div className="sg-v">Device-only, never uploaded</div>
          </div>
          <div className="toggle" />
        </div>
      </div>

      <div className="sg-label">Voice Control</div>
      <div className="sg-card">
        <div className="sg-row">
          <span className="sg-ic">🎤</span>
          <div className="sg-info">
            <div className="sg-l">Voice Commands</div>
            <div className="sg-v">Active — say "AED guide", "show map", "call 911"</div>
          </div>
          <div className="toggle" />
        </div>
        <div className="sg-row">
          <span className="sg-ic">🔊</span>
          <div className="sg-info">
            <div className="sg-l">ElevenLabs TTS Cues</div>
            <div className="sg-v">Concept only · not yet implemented</div>
          </div>
          <div className="toggle off" />
        </div>
      </div>

      <div className="about-card">
        <div className="about-logo">AID<span>-I</span></div>
        <div className="about-ver">VERSION 1.0.0 · AI FIRST AID COMPANION</div>
      </div>
    </div>
  );
}
