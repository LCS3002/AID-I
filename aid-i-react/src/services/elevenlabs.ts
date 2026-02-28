const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string;
const STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';

/**
 * Transcribe an audio blob using ElevenLabs Scribe STT.
 * Returns the full transcript string.
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!API_KEY || API_KEY === 'your_elevenlabs_key_here') {
    throw new Error('ElevenLabs API key not configured — add VITE_ELEVENLABS_API_KEY to .env');
  }

  const form = new FormData();
  form.append('file', audioBlob, 'recording.webm');
  form.append('model_id', 'scribe_v1');

  const res = await fetch(STT_URL, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`ElevenLabs STT error ${res.status}: ${err}`);
  }

  const data = await res.json() as { text?: string; transcript?: string };
  return (data.text ?? data.transcript ?? '').trim();
}
