import type { Resource } from '../types';

export const RESOURCES: Resource[] = [
  { type: 'aed',      color: '#FFB800', icon: '⚡', name: 'AED — Grand Central Lobby',     lat: 40.7527, lng: -73.9772, dist: '0.1 mi', walk: '2 min' },
  { type: 'hospital', color: '#E8192C', icon: '🏥', name: 'Bellevue Hospital Center',       lat: 40.7392, lng: -73.9765, dist: '0.4 mi', walk: '8 min' },
  { type: 'aed',      color: '#FFB800', icon: '⚡', name: 'AED — Times Sq Station (42nd)',  lat: 40.7557, lng: -73.9876, dist: '0.5 mi', walk: '10 min' },
  { type: 'police',   color: '#4DA6FF', icon: '🚔', name: 'Midtown North Precinct (18th)',  lat: 40.7606, lng: -73.9896, dist: '0.6 mi', walk: '12 min' },
  { type: 'fire',     color: '#FF6B35', icon: '🚒', name: 'FDNY Engine Co. 65',             lat: 40.7614, lng: -73.9837, dist: '0.7 mi', walk: '14 min' },
  { type: 'hospital', color: '#E8192C', icon: '🏥', name: 'Lenox Hill Hospital ER',         lat: 40.7700, lng: -73.9560, dist: '1.1 mi', walk: '22 min' },
];
