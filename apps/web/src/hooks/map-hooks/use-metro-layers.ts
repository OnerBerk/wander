import {RefObject, useEffect} from 'react';
import maplibregl from 'maplibre-gl';
import {loadMetroStationsData} from '@/components/map/metro-geojson';
import {LayerClickEvent} from '@/components/map/event-layers';
import {METRO_STATIONS_LAYER_ID, METRO_STATIONS_SOURCE_ID} from '@/constants/map-constants';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface UseMetroLayersParams {
  map: RefObject<maplibregl.Map | null>;
  areLayersReady: boolean;
}

export const useMetroLayers = ({map, areLayersReady}: UseMetroLayersParams): void => {
  const openMetroDetail = useMarkerStore((state) => state.openMetroDetail);
  const isMetroMarkersVisible = useMapLayersStore((state) => state.isMetroMarkersVisible);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    let isCancelled = false;
    const currentMap = map.current;
    let clearListeners: (() => void) | null = null;

    void loadMetroStationsData().then(({geoJson, stationsById}) => {
      if (isCancelled) return;
      if (!currentMap.getLayer(METRO_STATIONS_LAYER_ID)) return;

      const metroSource = currentMap.getSource(METRO_STATIONS_SOURCE_ID) as
        | maplibregl.GeoJSONSource
        | undefined;
      metroSource?.setData(geoJson);

      const handleMetroClick = (mapEvent: LayerClickEvent) => {
        const feature = mapEvent.features?.[0];
        const stationId = feature?.properties?.stationId;

        if (typeof stationId !== 'string') return;

        const station = stationsById.get(stationId);
        if (!station) return;

        openMetroDetail(station);
      };
      const setPointerCursor = () => {
        currentMap.getCanvas().style.cursor = 'pointer';
      };
      const resetCursor = () => {
        currentMap.getCanvas().style.cursor = '';
      };

      currentMap.on('click', METRO_STATIONS_LAYER_ID, handleMetroClick);
      currentMap.on('mouseenter', METRO_STATIONS_LAYER_ID, setPointerCursor);
      currentMap.on('mouseleave', METRO_STATIONS_LAYER_ID, resetCursor);

      clearListeners = () => {
        currentMap.off('click', METRO_STATIONS_LAYER_ID, handleMetroClick);
        currentMap.off('mouseenter', METRO_STATIONS_LAYER_ID, setPointerCursor);
        currentMap.off('mouseleave', METRO_STATIONS_LAYER_ID, resetCursor);
      };
    });

    return () => {
      isCancelled = true;
      clearListeners?.();
    };
  }, [areLayersReady, map, openMetroDetail]);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;
    if (!map.current.getLayer(METRO_STATIONS_LAYER_ID)) return;

    map.current.setLayoutProperty(
      METRO_STATIONS_LAYER_ID,
      'visibility',
      isMetroMarkersVisible ? 'visible' : 'none'
    );
  }, [areLayersReady, isMetroMarkersVisible, map]);
};
