import {RefObject, useEffect, useMemo, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import {EventData} from '@wander/types';
import {buildEventsGeoJson} from '@/components/map/events-geojson';
import {LayerClickEvent} from '@/components/map/event-layers';
import {EVENT_CLUSTERS_LAYER_ID, EVENT_POINTS_LAYER_ID, EVENTS_SOURCE_ID} from '@/constants/map-constants';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface UseEventLayersParams {
  map: RefObject<maplibregl.Map | null>;
  events: EventData[];
  areLayersReady: boolean;
}

export const useEventLayers = ({map, events, areLayersReady}: UseEventLayersParams): void => {
  const eventsByIdRef = useRef<Map<string, EventData>>(new Map());
  const openEventDetail = useMarkerStore((state) => state.openEventDetail);

  const eventsById = useMemo(() => {
    return new Map(events.map((event) => [event.id, event]));
  }, [events]);

  useEffect(() => {
    eventsByIdRef.current = eventsById;
  }, [eventsById]);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    const eventsSource = map.current.getSource(EVENTS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;

    eventsSource?.setData(buildEventsGeoJson(events));
  }, [areLayersReady, events, map]);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    const currentMap = map.current;
    const handleEventClick = (mapEvent: LayerClickEvent) => {
      const feature = mapEvent.features?.[0];
      const eventId = feature?.properties?.eventId;

      if (typeof eventId !== 'string') return;

      const event = eventsByIdRef.current.get(eventId);
      if (!event) return;

      openEventDetail(event);
    };
    const handleClusterClick = (mapEvent: LayerClickEvent) => {
      const feature = mapEvent.features?.[0];
      const clusterId = feature?.properties?.cluster_id;

      if (typeof clusterId !== 'number') return;

      const eventsSource = currentMap.getSource(EVENTS_SOURCE_ID) as maplibregl.GeoJSONSource;

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

    currentMap.on('click', EVENT_POINTS_LAYER_ID, handleEventClick);
    currentMap.on('click', EVENT_CLUSTERS_LAYER_ID, handleClusterClick);
    currentMap.on('mouseenter', EVENT_POINTS_LAYER_ID, setPointerCursor);
    currentMap.on('mouseenter', EVENT_CLUSTERS_LAYER_ID, setPointerCursor);
    currentMap.on('mouseleave', EVENT_POINTS_LAYER_ID, resetCursor);
    currentMap.on('mouseleave', EVENT_CLUSTERS_LAYER_ID, resetCursor);

    return () => {
      currentMap.off('click', EVENT_POINTS_LAYER_ID, handleEventClick);
      currentMap.off('click', EVENT_CLUSTERS_LAYER_ID, handleClusterClick);
      currentMap.off('mouseenter', EVENT_POINTS_LAYER_ID, setPointerCursor);
      currentMap.off('mouseenter', EVENT_CLUSTERS_LAYER_ID, setPointerCursor);
      currentMap.off('mouseleave', EVENT_POINTS_LAYER_ID, resetCursor);
      currentMap.off('mouseleave', EVENT_CLUSTERS_LAYER_ID, resetCursor);
    };
  }, [areLayersReady, map, openEventDetail]);
};
