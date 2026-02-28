import type { ReportData } from '../types';

export function populateReport(transcript: string, recSecs: number, cityName: string): ReportData {
  const t = transcript.toLowerCase();
  const m = Math.floor(recSecs / 60);
  const s = recSecs % 60;
  const duration = `${m}:${String(s).padStart(2, '0')}`;

  const age =
    t.match(/(\d+)\s*year[s]?\s*old/)?.[0] ||
    t.match(/(male|female|man|woman|child|elderly)/)?.[0] ||
    'Not reported';
  const mech =
    t.match(/(fell|collapsed|unconscious|seizure|chest pain|bleeding|crash|hit|stabbed|shot|choked)/)?.[0] ||
    'Not reported';
  const injury =
    t.match(/(breathing|not breathing|responsive|unresponsive|pulse|no pulse|bleeding|fracture|burn|wound)/)?.[0] ||
    'Not reported';
  const signs =
    t.match(/(pale|cyanotic|sweating|confused|conscious|unconscious|awake)/)?.[0] ||
    'Not reported';
  const treatment =
    t.match(/(cpr|aed|bandage|compress|tourniquet|rescue breath|defibrillat|shock)/)?.[0] ||
    'Not reported';

  const airway = t.includes('breathing') ? 'See breathing notes' : 'Status unclear from report';
  const breathing =
    t.match(/(breathing|not breathing|breaths|respiration)/)?.[0] || 'Not reported';
  const circ =
    t.match(/(pulse|bleeding|cpr|compressions)/)?.[0] || 'Not reported';
  const disability =
    t.match(/(conscious|unconscious|responsive|unresponsive|alert|confused|gcs)/)?.[0] ||
    'Not reported';
  const exposure =
    t.match(/(visible|exposed|wound|fracture|burn|bleeding|injury)/)?.[0] || 'Not reported';

  return {
    atmist: { age, time: 'Not reported', mechanism: mech, injuries: injury, signs, treatment },
    abcde: { airway, breathing, circulation: circ, disability, exposure },
    summary: transcript.trim() || 'No transcript captured.',
    duration,
    city: cityName,
  };
}
