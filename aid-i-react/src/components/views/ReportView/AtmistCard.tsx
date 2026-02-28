import type { AtmistData } from '../../../types';

export function AtmistCard({ age, time, mechanism, injuries, signs, treatment }: AtmistData) {
  const rows: { k: string; label: string; val: string }[] = [
    { k: 'A', label: 'Age',               val: age },
    { k: 'T', label: 'Time of Incident',  val: time },
    { k: 'M', label: 'Mechanism',         val: mechanism },
    { k: 'I', label: 'Injuries / Illness',val: injuries },
    { k: 'S', label: 'Signs & Symptoms',  val: signs },
    { k: 'T', label: 'Treatment Given',   val: treatment },
  ];

  return (
    <div className="rpt-card">
      <div className="rpt-ch">
        <div className="rpt-badge">A</div>
        <div>
          <div className="rpt-ct">ATMIST Protocol</div>
          <div className="rpt-cs">Age · Time · Mechanism · Injuries · Signs · Treatment</div>
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
