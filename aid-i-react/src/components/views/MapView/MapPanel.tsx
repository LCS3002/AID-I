import type { Resource } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

const FILTER_TAGS = [
  { type: 'hospital', label: 'Hospital', color: '#E8192C' },
  { type: 'aed',      label: 'AED',      color: '#FFB800' },
  { type: 'fire',     label: 'Fire',     color: '#FF6B35' },
  { type: 'police',   label: 'Police',   color: '#4DA6FF' },
] as const;

interface Props {
  resources: Resource[];
  activeFilters: Set<string>;
  selectedIdx: number;
  onToggleFilter: (type: string) => void;
  onSelectRes: (i: number) => void;
}

export function MapPanel({ resources, activeFilters, selectedIdx, onToggleFilter, onSelectRes }: Props) {
  const { cityName, navigate, resourcesLoading } = useAppContext();
  const visibleCount = resources.filter(r => activeFilters.has(r.type)).length;

  return (
    <div className="map-panel">
      <div className="panel-hd">
        <div className="panel-title">Nearby Resources</div>
        <div className="panel-sub">
          {resourcesLoading
            ? 'Fetching live data…'
            : resources.length === 0
            ? 'No resources found nearby'
            : `${visibleCount} found · sorted by distance`}
        </div>
      </div>

      <div className="filter-row">
        {FILTER_TAGS.map(({ type, label, color }) => (
          <div
            key={type}
            className={`ftag${activeFilters.has(type) ? ' on' : ''}`}
            style={{ color, borderColor: `${color}66` }}
            onClick={() => onToggleFilter(type)}
          >
            <div className="ftag-dot" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      <div className="res-list">
        {resourcesLoading && (
          <div style={{
            padding: '24px 18px',
            fontFamily: "'Space Mono',monospace",
            fontSize: '.58rem',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textAlign: 'center',
          }}>
            <div className="live-dot" style={{ display: 'inline-block', marginRight: 8 }} />
            Loading live resources…
          </div>
        )}
        {!resourcesLoading && resources.length === 0 && (
          <div style={{
            padding: '24px 18px',
            fontFamily: "'Space Mono',monospace",
            fontSize: '.55rem',
            letterSpacing: '.12em',
            color: 'var(--muted)',
            textAlign: 'center',
          }}>
            No resources found.<br />Try enabling location access.
          </div>
        )}
        {resources.map((r, i) => {
          const hidden = !activeFilters.has(r.type);
          const sel = selectedIdx === i;
          return (
            <div
              key={`${r.lat}-${r.lng}-${i}`}
              className={`res-card${sel ? ' sel' : ''}${hidden ? ' hidden' : ''}`}
              onClick={() => onSelectRes(i)}
            >
              <div className="res-icon" style={{ background: `${r.color}1a` }}>{r.icon}</div>
              <div className="res-body">
                <div className="res-name">{r.name}</div>
                <div className="res-meta">
                  <span className="res-dist">{r.dist} · {r.walk} walk</span>
                  <span className="res-tag" style={{ color: r.color, borderColor: `${r.color}44` }}>
                    {r.type.toUpperCase()}
                  </span>
                </div>
                {sel && (
                  <div className="res-btns">
                    <button
                      className="res-btn"
                      onClick={e => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`);
                      }}
                    >
                      ↗ Navigate
                    </button>
                    {r.type === 'aed' && (
                      <button
                        className="res-btn red"
                        onClick={e => { e.stopPropagation(); navigate('aed'); }}
                      >
                        ⚡ AED Guide
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="loc-bar">
        <span style={{ fontSize: '12px' }}>📍</span>
        <span className="loc-text"><strong>{cityName}</strong> · Auto-detected</span>
        <div className="live-dot" />
      </div>
    </div>
  );
}
