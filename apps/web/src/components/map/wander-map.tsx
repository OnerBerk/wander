import {useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {calculateRadius, getEventMarkerElement, getVelibMarkerElement} from '@/utils/map-utils';
import useMapStore from '@/store/zustand/useMapStore';
import {EventData, VelibStation} from '@wander/types';

const PARIS_CENTER: [number, number] = [2.3522, 48.8566];
const DEFAULT_ZOOM = 12;

interface WanderMapProps {
  events: EventData[];
  velibStations: VelibStation[];
}

const WanderMap: React.FC<WanderMapProps> = ({events, velibStations}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const eventMarkers = useRef<maplibregl.Marker[]>([]);
  const velibMarkers = useRef<maplibregl.Marker[]>([]);

  const setMapView = useMapStore((state) => state.setMapView);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/aquarelle-v4/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center: PARIS_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.current.addControl(new maplibregl.NavigationControl());
    map.current.on('moveend', () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const center = map.current!.getCenter();
        const zoom = map.current!.getZoom();
        const radius = calculateRadius(zoom);
        setMapView({lat: center.lat, lng: center.lng, radius});
      }, 800);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [setMapView]);

  useEffect(() => {
    if (!map.current) return;
    eventMarkers.current.forEach((m) => m.remove());
    eventMarkers.current = events.map((event) => {
      const el = getEventMarkerElement(event.tags);
      return new maplibregl.Marker({element: el})
        .setLngLat([event.location.lng, event.location.lat])
        .addTo(map.current!);
    });
  }, [events]);

  useEffect(() => {
    if (!map.current) return;
    velibMarkers.current.forEach((m) => m.remove());
    velibMarkers.current = velibStations.map((station) => {
      const el = getVelibMarkerElement(station.bikesAvailable);
      return new maplibregl.Marker({element: el})
        .setLngLat([station.location.lng, station.location.lat])
        .addTo(map.current!);
    });
  }, [velibStations]);

  return <div ref={mapContainer} className='h-full w-full' />;
};

export default WanderMap;
