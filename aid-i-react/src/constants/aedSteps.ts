import type { AedStep } from '../types';

export const STEPS: AedStep[] = [
  { em: '📞', t: 'CALL FOR HELP',    b: "If you haven't already, call emergency services now. The red 911 button in the sidebar connects you immediately." },
  { em: '🧍', t: 'CHECK THE PERSON', b: "Check if the person is conscious and breathing. Tap their shoulders firmly and shout 'Are you okay?'" },
  { em: '⚡', t: 'GET THE AED',      b: 'Retrieve the AED from the location shown on your map. It is usually a yellow or green box mounted on a wall.' },
  { em: '🔋', t: 'POWER ON',         b: 'Press the ON button. The AED will speak to you — follow its audio and visual instructions exactly.' },
  { em: '🩺', t: 'ATTACH THE PADS',  b: 'Expose the chest. One pad below the right collarbone, one below the left armpit — as shown on the AED diagram.' },
  { em: '⚠️', t: 'CLEAR AND SHOCK',  b: 'Ensure nobody is touching the person. Press the SHOCK button when the AED tells you to.' },
  { em: '❤️', t: 'BEGIN CPR',        b: 'After the shock, immediately start CPR: 30 chest compressions then 2 rescue breaths. Continue until paramedics arrive.' },
];
