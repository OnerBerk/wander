import {useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {calculateRadius, getEventMarkerElement} from '@/utils/map-utils';
import useMapStore from '@/store/zustand/useMapStore';
import {EventData} from '@wander/types';

const PARIS_CENTER: [number, number] = [2.3522, 48.8566];
const DEFAULT_ZOOM = 12;

interface WanderMapProps {
  events: EventData[];
}

const WanderMap: React.FC<WanderMapProps> = ({events}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

    markers.current.forEach((marker) => marker.remove());
    markers.current = events.map((event) => {
      const markerElement = getEventMarkerElement(event.tags);

      return new maplibregl.Marker({element: markerElement})
        .setLngLat([event.location.lng, event.location.lat])
        .addTo(map.current!);
    });
  }, [events]);

  return <div ref={mapContainer} className='h-full w-full' />;
};

export default WanderMap;
