import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { generateReport } from '../../../services/openai';
import { AtmistCard } from './AtmistCard';
import { AbcdeCard } from './AbcdeCard';
import type { ReportData } from '../../../types';

const EMPTY_REPORT: ReportData = {
  atmist: {
    age: '—', time: '—', mechanism: '—', injuries: '—', signs: '—', treatment: '—',
  },
  abcde: {
    airway: '—', breathing: '—', circulation: '—', disability: '—', exposure: '—',
  },
  summary: '',
  duration: '0:00',
  city: '',
};

export function ReportView() {
  const { transcript, recSecs, cityName, navigate } = useAppContext();
  const [report, setReport] = useState<ReportData>(EMPTY_REPORT);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const lastTranscriptRef = useRef('');

  useEffect(() => {
    if (!transcript || transcript === lastTranscriptRef.current) return;
    lastTranscriptRef.current = transcript;

    setGenerating(true);
    setGenError(null);

    generateReport(transcript, recSecs, cityName)
      .then(r => setReport(r))
      .catch(err => {
        setGenError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setGenerating(false));
  }, [transcript, recSecs, cityName]);

  const metaText = transcript
    ? `Recorded: ${report.duration}\nLocation: ${report.city}\nProtocol: ATMIST + ABCDE`
    : 'No recording yet.\nRecord on the Recorder tab.';

  return (
    <>
      <div className="rpt-scroll">
        <div className="rpt-inner">
          <div className="rpt-sum">
            <div className="rpt-sum-lbl">
              <div className="live-dot" />
              {generating ? 'GPT-4o Generating…' : 'GPT-4o Generated'} · {report.city || cityName}
            </div>
            <div className="rpt-sum-txt">
              {generating
                ? 'Analysing transcript with GPT-4o…'
                : genError
                ? `⚠ ${genError}`
                : transcript
                ? report.summary
                : 'Begin a recording on the Recorder tab. ElevenLabs transcribes, then GPT-4o structures the transcript into ATMIST + ABCDE.'}
            </div>
          </div>
          <div className="rpt-grid">
            <AtmistCard {...report.atmist} />
            <AbcdeCard {...report.abcde} />
          </div>
        </div>
      </div>

      <div className="rpt-act">
        <div className="rpt-al">Actions</div>
        <button className="rpt-ab red">↑ Export PDF</button>
        <button className="rpt-ab">📋 Copy Text</button>
        <button className="rpt-ab">📱 Share to Paramedics</button>
        <div className="rpt-div" />
        <div className="rpt-al">Details</div>
        <div className="rpt-meta">{metaText}</div>
        <div className="rpt-div" />
        <button className="rpt-ab" onClick={() => navigate('recorder')}>+ New Recording</button>
      </div>
    </>
  );
}
