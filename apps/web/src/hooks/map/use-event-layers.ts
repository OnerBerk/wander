import {useEventClusterLayerInteractions} from '@/hooks/map/use-event-cluster-layer-interactions';
import {useEventClusterLayersHidden} from '@/hooks/map/use-event-cluster-layers-hidden';
import {useEventDomMarkers} from '@/hooks/map/use-event-dom-markers';
import type {UseEventLayersParams} from '@/hooks/map/event-layers-types';

export type {UseEventLayersParams} from '@/hooks/map/event-layers-types';

export const useEventLayers = (params: UseEventLayersParams): void => {
  useEventDomMarkers(params);
  useEventClusterLayerInteractions(params);
  useEventClusterLayersHidden(params);
};
