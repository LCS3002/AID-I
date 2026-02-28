import { useEffect } from 'react';
import type { Map } from 'leaflet';
import { useAppContext } from '../context/AppContext';
import { fetchNearbyResources } from '../services/overpass';

export function useGPS(mapRef: React.RefObject<Map | null>) {
  const { setCityName, setUserLocation, setResources, setResourcesLoading } = useAppContext();

  useEffect(() => {
    if (!navigator.geolocation) {
      setCityName('New York, NY');
      setResourcesLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation([lat, lng]);

        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], 15, { duration: 1.2 });
        }

        // Reverse geocode
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const d = await r.json() as { address: Record<string, string> };
          const c = d.address.city || d.address.town || d.address.suburb || 'Your Location';
          const s = d.address.state_code || '';
          setCityName(c + (s ? ', ' + s : ''));
        } catch {
          setCityName('Location detected');
        }

        // Fetch live nearby resources from Overpass
        try {
          const nearby = await fetchNearbyResources(lat, lng);
          setResources(nearby);
        } catch (err) {
          console.error('Overpass fetch failed:', err);
          setResources([]);
        } finally {
          setResourcesLoading(false);
        }
      },
      () => {
        setCityName('New York, NY');
        setResourcesLoading(false);
      },
    );
  }, []);
}
