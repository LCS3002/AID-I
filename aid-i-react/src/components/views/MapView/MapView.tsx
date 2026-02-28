import { useState } from 'react';
import { LeafletMap } from './LeafletMap';
import { MapPanel } from './MapPanel';
import { useAppContext } from '../../../context/AppContext';

export function MapView() {
  const { pendingAction, setPendingAction, resources } = useAppContext();
  const [activeFilters, setActiveFilters] = useState(
    new Set(['hospital', 'aed', 'fire', 'police']),
  );
  const [selectedIdx, setSelectedIdx] = useState(-1);

  function toggleFilter(type: string) {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  return (
    <>
      <LeafletMap
        resources={resources}
        activeFilters={activeFilters}
        selectedIdx={selectedIdx}
        onSelectRes={setSelectedIdx}
        pendingAction={pendingAction}
        onPendingHandled={() => setPendingAction(null)}
      />
      <MapPanel
        resources={resources}
        activeFilters={activeFilters}
        selectedIdx={selectedIdx}
        onToggleFilter={toggleFilter}
        onSelectRes={setSelectedIdx}
      />
    </>
  );
}
