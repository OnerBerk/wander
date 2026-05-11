import {useEffect} from 'react';
import maplibregl from 'maplibre-gl';
import {LayerClickEvent} from '@/components/map/event-layers';
import {EVENT_CLUSTERS_LAYER_ID, EVENTS_SOURCE_ID} from '@/constants/map-constants';
import type {UseEventLayersParams} from '@/hooks/map/event-layers-types';

export const useEventClusterLayerInteractions = ({map, areLayersReady}: UseEventLayersParams): void => {
  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    const currentMap = map.current;
    const handleClusterClick = (mapEvent: LayerClickEvent) => {
      const feature = mapEvent.features?.[0];
      const clusterId = feature?.properties?.cluster_id;

      if (typeof clusterId !== 'number') return;

      const eventsSource = currentMap.getSource(EVENTS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (!eventsSource) return;

      void eventsSource.getClusterExpansionZoom(clusterId).then((zoom) => {
        currentMap.easeTo({
          center: mapEvent.lngLat,
          zoom,
        });
      });
    };
    const setPointerCursor = () => {
      currentMap.getCanvas().style.cursor = 'pointer';
    };
    const resetCursor = () => {
      currentMap.getCanvas().style.cursor = '';
    };

    currentMap.on('click', EVENT_CLUSTERS_LAYER_ID, handleClusterClick);
    currentMap.on('mouseenter', EVENT_CLUSTERS_LAYER_ID, setPointerCursor);
    currentMap.on('mouseleave', EVENT_CLUSTERS_LAYER_ID, resetCursor);

    return () => {
      currentMap.off('click', EVENT_CLUSTERS_LAYER_ID, handleClusterClick);
      currentMap.off('mouseenter', EVENT_CLUSTERS_LAYER_ID, setPointerCursor);
      currentMap.off('mouseleave', EVENT_CLUSTERS_LAYER_ID, resetCursor);
    };
  }, [areLayersReady, map]);
};
