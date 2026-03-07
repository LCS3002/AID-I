# AID-I — AI Emergency Response Assistant

AID-I is a single-page web app built for first responders and bystanders in emergency situations. It combines live GPS mapping, guided cardiac protocols, AI-powered voice transcription, and structured medical reporting into one fast, offline-capable interface.

---

## Features

### Map View
- Live GPS location with interactive Leaflet map
- Automatic Overpass API queries for nearby hospitals, AEDs, fire stations, and police
- Clickable resource markers with name, address, and navigation links

### AED / Cardiac Protocol
- 7-step guided cardiac emergency workflow (CPR + AED)
- Step progress bar with timed prompts
- Sidebar quick-reference for bystander instructions

### Voice Recorder
- MediaRecorder-based audio capture with live waveform
- Periodic 8-second chunk transcription via **ElevenLabs Scribe STT**
- Final transcription on stop for a complete, clean transcript

### AI Medical Report
- Sends transcript + elapsed time + city to **GPT-4o**
- Generates structured **ATMIST** and **ABCDE** assessment cards
- One-click copy for handoff to dispatch or hospital

### Voice Commands
- Always-on Web Speech API command listener (`cmdRec`)
- Commands: navigate between views, start/stop/pause recording, open call modal
- Toast notifications confirm recognized commands

### Settings
- API key management (ElevenLabs, OpenAI)
- App configuration panel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5 |
| Build | Vite 7 |
| Mapping | Leaflet 1.9 |
| Speech-to-Text | ElevenLabs Scribe API |
| Report Generation | OpenAI GPT-4o |
| Map Data | OpenStreetMap / Overpass API |
| Voice Input | Web Speech API (browser-native) |
| Geolocation | Browser Geolocation API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [ElevenLabs](https://elevenlabs.io) API key (for transcription)
- An [OpenAI](https://platform.openai.com) API key (for report generation)

### Install & Run

```bash
cd aid-i-react
npm install
```

Create a `.env` file in `aid-i-react/`:

```env
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_OPENAI_API_KEY=your_openai_key
```

```bash
npm run dev
```

Open `http://localhost:5173` in a Chromium-based browser (required for Web Speech API).

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
aid-i-react/
  src/
    context/        # Global app state (AppContext)
    hooks/          # useVoiceCommands, useRecorder, useGPS
    components/
      layout/       # Sidebar, Topbar, LogoBanner
      modal/        # CallModal, CmdToast
      views/
        MapView/    # Leaflet map + resource panel
        AedView/    # Cardiac protocol steps
        RecorderView/  # Waveform + transcript panel
        ReportView/ # ATMIST + ABCDE cards
        VoiceView/  # Command reference
        SettingsView/
    services/
      elevenlabs.ts  # STT transcription
      openai.ts      # Report generation
      overpass.ts    # Nearby resource lookup
  public/
    logo.png
template.html        # Original single-file reference app
```

---

## Architecture Notes

- All views stay **mounted at all times** — navigation uses CSS show/hide to prevent Leaflet map destruction on tab switch.
- Two independent `SpeechRecognition` instances run in parallel: one for always-on voice commands, one inside the recorder flow.
- The `pendingAction` state in `AppContext` coordinates cross-view actions (e.g. voice command triggers recording start after navigation).
- The `window.__aidNavigate` escape hatch lets Leaflet popup HTML (which can't use React handlers) trigger app-level navigation.

---

## License

MIT
