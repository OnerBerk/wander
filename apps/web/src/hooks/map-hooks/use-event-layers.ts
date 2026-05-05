import {RefObject, useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import {EventData} from '@wander/types';
import {buildEventsGeoJson, getEventMarkerImageId} from '@/components/map/events-geojson';
import {LayerClickEvent} from '@/components/map/event-layers';
import {
  EVENT_CLUSTER_COUNT_LAYER_ID,
  EVENT_CLUSTERS_LAYER_ID,
  EVENT_POINTS_LAYER_ID,
  EVENTS_SOURCE_ID,
} from '@/constants/map-constants';
import {createEventMarkerElement} from '@/components/map/event-layers';
import useMarkerStore from '@/store/zustand/useMarkerStore';

interface UseEventLayersParams {
  map: RefObject<maplibregl.Map | null>;
  events: EventData[];
  areLayersReady: boolean;
}

export const useEventLayers = ({map, events, areLayersReady}: UseEventLayersParams): void => {
  const eventsByIdRef = useRef<Map<string, EventData>>(new Map());
  const eventMarkersRef = useRef<maplibregl.Marker[]>([]);
  const openEventDetail = useMarkerStore((state) => state.openEventDetail);

  useEffect(() => {
    eventsByIdRef.current = new Map(events.map((event) => [event.id, event]));
  }, [events]);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    const eventsSource = map.current.getSource(EVENTS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    const eventsGeoJson = buildEventsGeoJson(events);
    eventsSource?.setData(eventsGeoJson);

    eventMarkersRef.current.forEach((marker) => marker.remove());
    eventMarkersRef.current = [];

    const currentMap = map.current;
    const mapCenter = currentMap.getCenter();
    const sortedFeatures = [...eventsGeoJson.features].sort((left, right) => {
      const [leftLng, leftLat] = left.geometry.coordinates;
      const [rightLng, rightLat] = right.geometry.coordinates;
      const leftDistance = Math.abs(leftLat - mapCenter.lat) + Math.abs(leftLng - mapCenter.lng);
      const rightDistance = Math.abs(rightLat - mapCenter.lat) + Math.abs(rightLng - mapCenter.lng);
      return leftDistance - rightDistance;
    });

    const staggerMs = 18;
    const maxDelayMs = staggerMs * Math.min(Math.max(sortedFeatures.length - 1, 0), 50);

    eventMarkersRef.current = sortedFeatures
      .map((feature, index) => {
        const eventId = feature.properties.eventId;
        const event = eventsByIdRef.current.get(eventId);
        if (!event) return null;

        const delayMs = Math.min(index * staggerMs, maxDelayMs);
        const markerIcon = getEventMarkerImageId(event.tags);
        const element = createEventMarkerElement(markerIcon, delayMs);
        element.addEventListener('click', (markerEvent) => {
          markerEvent.stopPropagation();
          openEventDetail(event);
        });

        return new maplibregl.Marker({element}).setLngLat(feature.geometry.coordinates).addTo(currentMap);
      })
      .filter((marker): marker is maplibregl.Marker => marker !== null);

    return () => {
      eventMarkersRef.current.forEach((marker) => marker.remove());
      eventMarkersRef.current = [];
    };
  }, [areLayersReady, events, map]);

  useEffect(() => {
    if (!map.current || !areLayersReady) return;

    const currentMap = map.current;
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

    currentMap.on('click', EVENT_CLUSTERS_LAYER_ID, handleClusterClick);
    currentMap.on('mouseenter', EVENT_CLUSTERS_LAYER_ID, setPointerCursor);
    currentMap.on('mouseleave', EVENT_CLUSTERS_LAYER_ID, resetCursor);

    return () => {
      currentMap.off('click', EVENT_CLUSTERS_LAYER_ID, handleClusterClick);
      currentMap.off('mouseenter', EVENT_CLUSTERS_LAYER_ID, setPointerCursor);
      currentMap.off('mouseleave', EVENT_CLUSTERS_LAYER_ID, resetCursor);
    };
  }, [areLayersReady, map]);

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
