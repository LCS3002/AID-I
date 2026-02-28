import { useEffect, useRef } from 'react';

interface Props {
  isActive: boolean;
}

const BAR_COUNT = 52;

export function Waveform({ isActive }: Props) {
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      barsRef.current.forEach(b => {
        if (b) {
          b.style.height = (isActive ? Math.random() * 56 + 4 : 4) + 'px';
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="wave-wrap">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div
          key={i}
          className="wb"
          style={{ height: '4px' }}
          ref={el => { if (el) barsRef.current[i] = el; }}
        />
      ))}
    </div>
  );
}
