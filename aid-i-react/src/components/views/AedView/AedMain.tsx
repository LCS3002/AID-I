import { useEffect, useRef } from 'react';
import { STEPS } from '../../../constants/aedSteps';
import { useAppContext } from '../../../context/AppContext';

export function AedMain() {
  const { aedIdx, setAedIdx, navigate } = useAppContext();
  const emRef = useRef<HTMLDivElement>(null);
  const step = STEPS[aedIdx];
  const total = STEPS.length;
  const isLast = aedIdx === total - 1;

  useEffect(() => {
    if (!emRef.current) return;
    emRef.current.style.animation = 'none';
    // force reflow
    void emRef.current.offsetWidth;
    emRef.current.style.animation = 'epop .4s cubic-bezier(.34,1.56,.64,1)';
  }, [aedIdx]);

  function handleNext() {
    if (isLast) {
      navigate('map');
    } else {
      setAedIdx(aedIdx + 1);
    }
  }

  function handlePrev() {
    if (aedIdx > 0) setAedIdx(aedIdx - 1);
  }

  const progressPct = ((aedIdx + 1) / total) * 100;

  return (
    <div className="aed-main">
      <div className="aed-prog">
        <div className="aed-prog-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="aed-body">
        <div className="step-ey">Step {aedIdx + 1} of {total}</div>
        <div className="aed-em" ref={emRef}>{step.em}</div>
        <div className="aed-title">{step.t}</div>
        <p className="aed-desc">{step.b}</p>
        <div className="voice-hint">
          <div className="live-dot" />
          Say "next" or "previous" to navigate
        </div>
      </div>
      <div className="aed-foot">
        <button
          className="btn-secondary"
          disabled={aedIdx === 0}
          onClick={handlePrev}
        >
          ← Prev
        </button>
        <button
          className="btn-primary"
          style={{
            flex: 1,
            justifyContent: 'center',
            ...(isLast ? { background: '#28CA41', boxShadow: '0 4px 18px rgba(40,202,65,.3)' } : {}),
          }}
          onClick={handleNext}
        >
          {isLast ? '✓ Guide Complete' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
}
