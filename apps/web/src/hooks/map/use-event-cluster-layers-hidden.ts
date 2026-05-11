import {useEffect} from 'react';
import {
  EVENT_CLUSTER_COUNT_LAYER_ID,
  EVENT_CLUSTERS_LAYER_ID,
  EVENT_POINTS_LAYER_ID,
} from '@/constants/map-constants';
import type {UseEventLayersParams} from '@/hooks/map/event-layers-types';

export const useEventClusterLayersHidden = ({map, areLayersReady}: UseEventLayersParams): void => {
  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    if (map.current.getLayer(EVENT_POINTS_LAYER_ID)) {
      map.current.setLayoutProperty(EVENT_POINTS_LAYER_ID, 'visibility', 'none');
    }
    if (map.current.getLayer(EVENT_CLUSTERS_LAYER_ID)) {
      map.current.setLayoutProperty(EVENT_CLUSTERS_LAYER_ID, 'visibility', 'none');
    }
    if (map.current.getLayer(EVENT_CLUSTER_COUNT_LAYER_ID)) {
      map.current.setLayoutProperty(EVENT_CLUSTER_COUNT_LAYER_ID, 'visibility', 'none');
    }
  }, [areLayersReady, map]);
};
