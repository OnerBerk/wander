import {RefObject, useEffect, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';
import {calculateRadius} from '@/utils/map-utils';
import {
  DEFAULT_ZOOM,
  EVENT_CLUSTERS_LAYER_ID,
  EVENT_POINTS_LAYER_ID,
  PARIS_CENTER,
} from '@/constants/map-constants';
import {addEventLayers, addEventMarkerImages} from '@/components/map/event-layers';
import useMapStore from '@/store/zustand/useMapStore';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface UseMapInstanceResult {
  map: RefObject<maplibregl.Map | null>;
  areEventLayersReady: boolean;
}

export const useMapInstance = (
  mapContainer: RefObject<HTMLDivElement | null>
): UseMapInstanceResult => {
  const map = useRef<maplibregl.Map | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [areEventLayersReady, setAreEventLayersReady] = useState(false);

  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);
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
    map.current.on('load', () => {
      void addEventMarkerImages(map.current!).then(() => {
        if (!map.current) return;

        addEventLayers(map.current);
        setAreEventLayersReady(true);
      });
    });
    map.current.on('click', (mapEvent) => {
      if (map.current?.getLayer(EVENT_POINTS_LAYER_ID) || map.current?.getLayer(EVENT_CLUSTERS_LAYER_ID)) {
        const features = map.current.queryRenderedFeatures(mapEvent.point, {
          layers: [EVENT_POINTS_LAYER_ID, EVENT_CLUSTERS_LAYER_ID],
        });

        if (features.length > 0) return;
      }

      closeDetailModal();
    });
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
  }, [closeDetailModal, mapContainer, setMapView]);

  return {map, areEventLayersReady};
};
