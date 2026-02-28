import type { AbcdeData } from '../../../types';

export function AbcdeCard({ airway, breathing, circulation, disability, exposure }: AbcdeData) {
  const rows: { k: string; label: string; val: string }[] = [
    { k: 'A', label: 'Airway',      val: airway },
    { k: 'B', label: 'Breathing',   val: breathing },
    { k: 'C', label: 'Circulation', val: circulation },
    { k: 'D', label: 'Disability',  val: disability },
    { k: 'E', label: 'Exposure',    val: exposure },
  ];

  return (
    <div className="rpt-card">
      <div className="rpt-ch">
        <div className="rpt-badge">B</div>
        <div>
          <div className="rpt-ct">ABCDE Assessment</div>
          <div className="rpt-cs">Airway · Breathing · Circulation · Disability · Exposure</div>
        </div>
      </div>
      {rows.map(({ k, label, val }) => (
        <div key={label} className="rpt-row">
          <div className="rpt-k">{k}</div>
          <div className="rpt-c">
            <div className="rpt-l">{label}</div>
            <div className="rpt-v">{val || '—'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
