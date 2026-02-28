import type { Resource } from '../types';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const RADIUS_M = 3000; // 3 km search radius

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResult {
  elements: OverpassElement[];
}

const TYPE_MAP: Record<string, Resource['type']> = {
  hospital: 'hospital',
  clinic: 'hospital',
  defibrillator: 'aed',
  fire_station: 'fire',
  police: 'police',
};

const COLOR_MAP: Record<Resource['type'], string> = {
  hospital: '#E8192C',
  aed:      '#FFB800',
  fire:     '#FF6B35',
  police:   '#4DA6FF',
};

const ICON_MAP: Record<Resource['type'], string> = {
  hospital: '🏥',
  aed:      '⚡',
  fire:     '🚒',
  police:   '🚔',
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km: number): string {
  const mi = km * 0.621371;
  return mi < 0.1 ? `${Math.round(km * 1000)} m` : `${mi.toFixed(1)} mi`;
}

function formatWalk(km: number): string {
  const mins = Math.round((km / 5) * 60); // 5 km/h walking
  return `${Math.max(1, mins)} min`;
}

function getResourceType(tags: Record<string, string>): Resource['type'] | null {
  if (tags['emergency'] === 'defibrillator') return 'aed';
  if (tags['amenity']) {
    const t = TYPE_MAP[tags['amenity']];
    if (t) return t;
  }
  return null;
}

function getName(tags: Record<string, string>, type: Resource['type']): string {
  if (tags['name']) return tags['name'];
  const defaults: Record<Resource['type'], string> = {
    hospital: 'Hospital',
    aed: 'AED Defibrillator',
    fire: 'Fire Station',
    police: 'Police Station',
  };
  return defaults[type];
}

export async function fetchNearbyResources(
  userLat: number,
  userLng: number,
): Promise<Resource[]> {
  const query = `
[out:json][timeout:30];
(
  node["amenity"="hospital"](around:${RADIUS_M},${userLat},${userLng});
  way["amenity"="hospital"](around:${RADIUS_M},${userLat},${userLng});
  node["amenity"="clinic"](around:${RADIUS_M},${userLat},${userLng});
  node["emergency"="defibrillator"](around:${RADIUS_M},${userLat},${userLng});
  node["amenity"="fire_station"](around:${RADIUS_M},${userLat},${userLng});
  way["amenity"="fire_station"](around:${RADIUS_M},${userLat},${userLng});
  node["amenity"="police"](around:${RADIUS_M},${userLat},${userLng});
  way["amenity"="police"](around:${RADIUS_M},${userLat},${userLng});
);
out center body;
  `.trim();

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

  const json = await res.json() as OverpassResult;

  const resources: Resource[] = [];
  const seen = new Set<number>();

  for (const el of json.elements) {
    if (seen.has(el.id)) continue;
    seen.add(el.id);

    const tags = el.tags ?? {};
    const type = getResourceType(tags);
    if (!type) continue;

    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) continue;

    const km = haversineKm(userLat, userLng, lat, lng);

    resources.push({
      type,
      color: COLOR_MAP[type],
      icon: ICON_MAP[type],
      name: getName(tags, type),
      lat,
      lng,
      dist: formatDist(km),
      walk: formatWalk(km),
    });
  }

  // Sort by distance (closest first), cap at 20
  resources.sort((a, b) => {
    const distA = parseFloat(a.dist);
    const distB = parseFloat(b.dist);
    return distA - distB;
  });

  return resources.slice(0, 20);
}
