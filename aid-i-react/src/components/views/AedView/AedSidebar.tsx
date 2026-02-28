import { STEPS } from '../../../constants/aedSteps';
import { useAppContext } from '../../../context/AppContext';

export function AedSidebar() {
  const { aedIdx, setAedIdx } = useAppContext();

  return (
    <div className="aed-sidebar">
      <div className="aed-sb-hd">AED Steps</div>
      {STEPS.map((step, i) => (
        <div
          key={i}
          className={`aed-si${i === aedIdx ? ' active' : ''}${i < aedIdx ? ' done' : ''}`}
          onClick={() => setAedIdx(i)}
        >
          <div className="aed-si-n">{String(i + 1).padStart(2, '0')}</div>
          <div className="aed-si-l">{step.t}</div>
        </div>
      ))}
    </div>
  );
}
