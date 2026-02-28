import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGPS } from '../../../hooks/useGPS';
import { useAppContext } from '../../../context/AppContext';
import type { Resource, PendingAction } from '../../../types';

interface Props {
  resources: Resource[];
  activeFilters: Set<string>;
  selectedIdx: number;
  onSelectRes: (i: number) => void;
  pendingAction: PendingAction;
  onPendingHandled: () => void;
}

function makePinIcon(color: string, type: string) {
  const hasPulse = type === 'aed' || type === 'hospital';
  const pulse = hasPulse ? `<div class="mp-pulse" style="color:${color}"></div>` : '';
  return L.divIcon({
    className: '',
    html: `<div class="mp-wrap" style="color:${color}">
      ${pulse}
      <div class="mp-outer"><div class="mp-inner"></div></div>
    </div>`,
    iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -16],
  });
}

function makeUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative"><div class="user-loc"></div></div>`,
    iconSize: [12, 12], iconAnchor: [6, 6],
  });
}

function buildPopupHTML(r: Resource) {
  return `<div style="font-family:'DM Sans',sans-serif;min-width:160px">
    <div style="font-size:.83rem;font-weight:500;color:#1C1C1C;margin-bottom:4px">${r.name}</div>
    <div style="font-family:'Space Mono',monospace;font-size:.58rem;color:#555555;margin-bottom:${r.type === 'aed' ? '10' : '0'}px">${r.dist} · ${r.walk} walk</div>
    ${r.type === 'aed' ? `<div onclick="window.__aidNavigate && window.__aidNavigate('aed')" style="background:#E8192C;color:white;font-family:'Space Mono',monospace;font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;padding:6px 9px;border-radius:2px;cursor:pointer;text-align:center;margin-bottom:5px">⚡ Start AED Guide</div>` : ''}
    <div onclick="window.open('https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}')" style="font-family:'Space Mono',monospace;font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:#4DA6FF;cursor:pointer">↗ Navigate</div>
  </div>`;
}

export function LeafletMap({ resources, activeFilters, selectedIdx, onSelectRes, pendingAction, onPendingHandled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { activeView, navigate } = useAppContext();

  useGPS(mapRef);

  // Init map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const center: [number, number] = [40.7520, -73.9772];
    const map = L.map(containerRef.current, {
      center, zoom: 15, zoomControl: true, attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd',
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 100);

    // AED popup button escape hatch
    (window as unknown as Record<string, unknown>).__aidNavigate = (view: string) =>
      navigate(view as 'aed');

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Rebuild markers when resources change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // User location marker
    const userMarker = L.marker(map.getCenter(), { icon: makeUserIcon(), zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup('<span style="font-family:\'Space Mono\',monospace;font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:#E8192C">You are here</span>');
    markersRef.current.push(userMarker);

    resources.forEach((r, i) => {
      const marker = L.marker([r.lat, r.lng], { icon: makePinIcon(r.color, r.type) });
      if (activeFilters.has(r.type)) marker.addTo(map);
      marker.bindPopup(buildPopupHTML(r));
      marker.on('click', () => onSelectRes(i));
      markersRef.current.push(marker);
    });
  }, [resources]);

  // Invalidate size on view switch
  useEffect(() => {
    if (activeView === 'map' && mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 50);
    }
  }, [activeView]);

  // Toggle markers by filter (markers[0] is user marker, resources start at index 1)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    resources.forEach((r, i) => {
      const marker = markersRef.current[i + 1];
      if (!marker) return;
      if (activeFilters.has(r.type)) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });
  }, [activeFilters, resources]);

  // Fly to selected resource
  useEffect(() => {
    if (selectedIdx < 0 || !mapRef.current) return;
    const r = resources[selectedIdx];
    if (r) mapRef.current.flyTo([r.lat, r.lng], 16, { duration: 0.8 });
  }, [selectedIdx, resources]);

  // Handle pendingAction from voice command
  useEffect(() => {
    if (pendingAction && typeof pendingAction === 'object' && pendingAction.type === 'selectResource') {
      const t = setTimeout(() => {
        onSelectRes(pendingAction.idx);
        onPendingHandled();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [pendingAction]);

  return <div id="map" ref={containerRef} />;
}
