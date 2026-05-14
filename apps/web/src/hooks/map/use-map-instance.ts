import {RefObject, useEffect, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';
import {calculateRadius} from '@/utils/map-utils';
import {
  DEFAULT_ZOOM,
  EVENT_CLUSTERS_LAYER_ID,
  EVENT_POINTS_LAYER_ID,
  METRO_STATIONS_LAYER_ID,
  PARIS_CENTER,
} from '@/constants/map-constants';
import {addEventLayers, addEventMarkerImages, syncEventMarkerIconSize} from '@/components/map/event-layers';
import {addMetroLayers, addMetroMarkerImage, syncMetroMarkerIconSize} from '@/components/map/metro-layers';
import useMapStore from '@/store/zustand/useMapStore';
import useMarkerStore from '@/store/zustand/useMarkerStore';
import usePanelStore from '@/store/zustand/usePanelStore';

interface UseMapInstanceResult {
  map: RefObject<maplibregl.Map | null>;
  areEventLayersReady: boolean;
}

export const useMapInstance = (mapContainer: RefObject<HTMLDivElement | null>): UseMapInstanceResult => {
  const map = useRef<maplibregl.Map | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [areEventLayersReady, setAreEventLayersReady] = useState(false);
  const closeDetailModal = useMarkerStore((state) => state.closeDetailModal);
  const setMapView = useMapStore((state) => state.setMapView);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/topo-v4/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center: PARIS_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl());
    map.current.on('load', () => {
      void Promise.all([addEventMarkerImages(map.current!), addMetroMarkerImage(map.current!)]).then(() => {
        if (!map.current) return;

        addEventLayers(map.current);
        addMetroLayers(map.current);
        syncEventMarkerIconSize(map.current, window.innerWidth);
        syncMetroMarkerIconSize(map.current, window.innerWidth);
        setAreEventLayersReady(true);
      });
    });
    const handleResize = () => {
      if (!map.current) return;
      syncEventMarkerIconSize(map.current, window.innerWidth);
      syncMetroMarkerIconSize(map.current, window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    map.current.on('click', (mapEvent) => {
      const currentMap = map.current;
      if (!currentMap) return;

      if (usePanelStore.getState().isPanelOpen) {
        usePanelStore.getState().closePanel();
      }

      if (usePanelStore.getState().isWeatherPanelOpen) {
        usePanelStore.getState().closeWeatherPanel();
      }

      const interactiveLayers = [EVENT_POINTS_LAYER_ID, EVENT_CLUSTERS_LAYER_ID, METRO_STATIONS_LAYER_ID].filter(
        (layerId) => Boolean(currentMap.getLayer(layerId))
      );

      if (interactiveLayers.length > 0) {
        const features = currentMap.queryRenderedFeatures(mapEvent.point, {
          layers: interactiveLayers,
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
      window.removeEventListener('resize', handleResize);
      map.current?.remove();
      map.current = null;
    };
  }, [closeDetailModal, mapContainer, setMapView]);

  return {map, areEventLayersReady};
};
