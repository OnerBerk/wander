import {useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import {EventData} from '@wander/types';
import {buildEventsGeoJson, getEventMarkerImageId} from '@/components/map/events-geojson';
import {createEventMarkerElement} from '@/components/map/event-layers';
import {EVENTS_SOURCE_ID} from '@/constants/map-constants';
import useMarkerStore from '@/store/zustand/useMarkerStore';
import type {UseEventLayersParams} from '@/hooks/map/event-layers-types';

type EventMarkerEntry = {
  marker: maplibregl.Marker;
  abortClick: AbortController;
};

const clearAllEventMarkers = (markersById: Map<string, EventMarkerEntry>): void => {
  for (const entry of markersById.values()) {
    entry.abortClick.abort();
    entry.marker.remove();
  }
  markersById.clear();
};

export const useEventDomMarkers = ({map, events, areLayersReady}: UseEventLayersParams): void => {
  const eventsByIdRef = useRef<Map<string, EventData>>(new Map());
  const eventMarkersByIdRef = useRef<Map<string, EventMarkerEntry>>(new Map());

  useEffect(() => {
    return () => {
      clearAllEventMarkers(eventMarkersByIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (!areLayersReady) {
      clearAllEventMarkers(eventMarkersByIdRef.current);
    }
  }, [areLayersReady]);

  useEffect(() => {
    eventsByIdRef.current = new Map(events.map((event) => [event.id, event]));

    if (!map.current || !areLayersReady) return;

    const eventsSource = map.current.getSource(EVENTS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    const eventsGeoJson = buildEventsGeoJson(events);
    eventsSource?.setData(eventsGeoJson);

    const currentMap = map.current;
    const currentIds = new Set(events.map((event) => event.id));

    for (const [id, entry] of [...eventMarkersByIdRef.current.entries()]) {
      if (!currentIds.has(id)) {
        entry.abortClick.abort();
        entry.marker.remove();
        eventMarkersByIdRef.current.delete(id);
      }
    }

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

    const attachClick = (element: HTMLElement, eventId: string): AbortController => {
      const abortClick = new AbortController();
      element.addEventListener(
        'click',
        (markerEvent) => {
          markerEvent.stopPropagation();
          const latest = eventsByIdRef.current.get(eventId);
          if (latest) useMarkerStore.getState().openEventDetail(latest);
        },
        {signal: abortClick.signal}
      );
      return abortClick;
    };

    let newMarkerIndex = 0;
    for (const feature of sortedFeatures) {
      const eventId = feature.properties?.eventId;
      if (typeof eventId !== 'string') continue;

      const event = eventsByIdRef.current.get(eventId);
      if (!event) continue;

      const lngLat = feature.geometry.coordinates as [number, number];
      const existing = eventMarkersByIdRef.current.get(eventId);

      if (existing) {
        existing.marker.setLngLat(lngLat);
        existing.abortClick.abort();
        const element = existing.marker.getElement();
        const abortClick = attachClick(element, eventId);
        eventMarkersByIdRef.current.set(eventId, {marker: existing.marker, abortClick});
        continue;
      }

      const delayMs = Math.min(newMarkerIndex * staggerMs, maxDelayMs);
      newMarkerIndex += 1;
      const markerIcon = getEventMarkerImageId(event.tags);
      const element = createEventMarkerElement(markerIcon, delayMs);
      const abortClick = attachClick(element, eventId);
      const marker = new maplibregl.Marker({element}).setLngLat(lngLat).addTo(currentMap);
      eventMarkersByIdRef.current.set(eventId, {marker, abortClick});
    }
  }, [areLayersReady, events, map]);
};
