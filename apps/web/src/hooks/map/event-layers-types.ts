import type {RefObject} from 'react';
import type maplibregl from 'maplibre-gl';
import type {EventData} from '@wander/types';

export interface UseEventLayersParams {
  map: RefObject<maplibregl.Map | null>;
  events: EventData[];
  areLayersReady: boolean;
}
