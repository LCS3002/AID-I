import type { VoiceCommand, VoiceCommandContext } from '../types';

export const COMMANDS: VoiceCommand[] = [
  {
    phrases: ['show map', 'open map', 'go to map', 'find map'],
    action: (ctx: VoiceCommandContext) => ctx.navigate('map'),
  },
  {
    phrases: ['aed guide', 'aed', 'show aed', 'open aed', 'start aed'],
    action: (ctx: VoiceCommandContext) => ctx.navigate('aed'),
  },
  {
    phrases: ['start recording', 'record', 'open recorder', 'recorder'],
    action: (ctx: VoiceCommandContext) => {
      ctx.navigate('recorder');
      ctx.setPendingAction('startRecording');
    },
  },
  {
    phrases: ['show report', 'open report', 'protocol report', 'report'],
    action: (ctx: VoiceCommandContext) => ctx.navigate('report'),
  },
  {
    phrases: ['call 911', 'call emergency', 'emergency call', 'nine one one'],
    action: (ctx: VoiceCommandContext) => ctx.openModal(),
  },
  {
    phrases: ['next', 'next step'],
    action: (ctx: VoiceCommandContext) => {
      if (ctx.activeView === 'aed') {
        const next = ctx.aedIdx + 1;
        if (next < 7) ctx.setAedIdx(next);
        else ctx.navigate('map');
      }
    },
  },
  {
    phrases: ['previous', 'go back', 'prev', 'previous step'],
    action: (ctx: VoiceCommandContext) => {
      if (ctx.activeView === 'aed') {
        const prev = ctx.aedIdx - 1;
        if (prev >= 0) ctx.setAedIdx(prev);
      }
    },
  },
  {
    phrases: ['find aed', 'nearest aed', 'where is aed'],
    action: (ctx: VoiceCommandContext) => {
      const idx = ctx.resources.findIndex(r => r.type === 'aed');
      if (idx >= 0) {
        ctx.navigate('map');
        ctx.setPendingAction({ type: 'selectResource', idx });
      }
    },
  },
  {
    phrases: ['find hospital', 'nearest hospital', 'hospital'],
    action: (ctx: VoiceCommandContext) => {
      const idx = ctx.resources.findIndex(r => r.type === 'hospital');
      if (idx >= 0) {
        ctx.navigate('map');
        ctx.setPendingAction({ type: 'selectResource', idx });
      }
    },
  },
  {
    phrases: ['settings'],
    action: (ctx: VoiceCommandContext) => ctx.navigate('settings'),
  },
  {
    phrases: ['voice commands', 'voice control', 'voice'],
    action: (ctx: VoiceCommandContext) => ctx.navigate('voice'),
  },
];
