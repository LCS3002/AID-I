export type ViewKey = 'map' | 'aed' | 'recorder' | 'report' | 'voice' | 'settings';

export type PendingAction =
  | 'startRecording'
  | { type: 'selectResource'; idx: number }
  | null;

export interface Resource {
  type: 'aed' | 'hospital' | 'fire' | 'police';
  color: string;
  icon: string;
  name: string;
  lat: number;
  lng: number;
  dist: string;
  walk: string;
}

export interface AedStep {
  em: string;
  t: string;
  b: string;
}

export interface AtmistData {
  age: string;        // A — Age of patient
  time: string;       // T — Time of incident / call
  mechanism: string;  // M — Mechanism of injury
  injuries: string;   // I — Injuries found
  signs: string;      // S — Signs & symptoms
  treatment: string;  // T — Treatment given
}

export interface AbcdeData {
  airway: string;
  breathing: string;
  circulation: string;
  disability: string;
  exposure: string;
}

export interface ReportData {
  atmist: AtmistData;
  abcde: AbcdeData;
  summary: string;
  duration: string;
  city: string;
}

export interface VoiceCommandContext {
  navigate: (v: ViewKey) => void;
  openModal: () => void;
  aedIdx: number;
  setAedIdx: (i: number) => void;
  setPendingAction: (a: PendingAction) => void;
  activeView: ViewKey;
  resources: Resource[];
  showCmdToast: (msg: string) => void;
}

export interface VoiceCommand {
  phrases: string[];
  action: (ctx: VoiceCommandContext) => void;
}
