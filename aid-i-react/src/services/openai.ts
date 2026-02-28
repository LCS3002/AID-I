import type { ReportData } from '../types';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;
const CHAT_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are an emergency medical protocol assistant.
Extract structured data from the provided incident transcript and return ONLY valid JSON in this exact shape:

{
  "atmist": {
    "age": "patient age or demographics, or 'Not reported'",
    "time": "time of incident or call, or 'Not reported'",
    "mechanism": "how the injury/illness occurred, or 'Not reported'",
    "injuries": "injuries or illness found, or 'Not reported'",
    "signs": "signs and symptoms observed, or 'Not reported'",
    "treatment": "treatment given so far, or 'Not reported'"
  },
  "abcde": {
    "airway": "airway status, or 'Not reported'",
    "breathing": "breathing status, or 'Not reported'",
    "circulation": "circulation/pulse/bleeding status, or 'Not reported'",
    "disability": "neurological status / consciousness level, or 'Not reported'",
    "exposure": "visible injuries / exposure findings, or 'Not reported'"
  },
  "summary": "one-sentence plain-language incident summary"
}

Respond ONLY with the JSON object — no markdown, no explanation.`;

export async function generateReport(
  transcript: string,
  recSecs: number,
  cityName: string,
): Promise<ReportData> {
  if (!API_KEY || API_KEY === 'your_openai_key_here') {
    throw new Error('OpenAI API key not configured — add VITE_OPENAI_API_KEY to .env');
  }

  const m = Math.floor(recSecs / 60);
  const s = recSecs % 60;
  const duration = `${m}:${String(s).padStart(2, '0')}`;

  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Incident transcript:\n\n${transcript || '(no transcript captured)'}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }

  const data = await res.json() as {
    choices: { message: { content: string } }[];
  };

  const raw = JSON.parse(data.choices[0].message.content) as {
    atmist: ReportData['atmist'];
    abcde: ReportData['abcde'];
    summary: string;
  };

  return {
    atmist: raw.atmist,
    abcde: raw.abcde,
    summary: raw.summary ?? transcript.slice(0, 200),
    duration,
    city: cityName,
  };
}
