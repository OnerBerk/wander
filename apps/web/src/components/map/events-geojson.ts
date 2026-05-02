import {EventData, EventTag} from '@wander/types';

export const EVENT_MARKER_IMAGE_IDS = {
  default: 'event-marker-default',
  music: 'event-marker-music',
  tree: 'event-marker-tree',
} as const;

export type EventMarkerImageId =
  (typeof EVENT_MARKER_IMAGE_IDS)[keyof typeof EVENT_MARKER_IMAGE_IDS];

interface EventGeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    eventId: string;
    markerIcon: EventMarkerImageId;
  };
}

export interface EventsGeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: EventGeoJsonFeature[];
}

export const getEventMarkerImageId = (tags: EventTag[]): EventMarkerImageId => {
  for (const tag of tags) {
    switch (tag) {
      case 'Concert':
      case 'Festival':
        return EVENT_MARKER_IMAGE_IDS.music;
      case 'Nature':
      case 'Balade urbaine':
        return EVENT_MARKER_IMAGE_IDS.tree;
      default:
        break;
    }
  }

  return EVENT_MARKER_IMAGE_IDS.default;
};

export const buildEventsGeoJson = (events: EventData[]): EventsGeoJsonFeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: events.map((event) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [event.location.lng, event.location.lat],
      },
      properties: {
        eventId: event.id,
        markerIcon: getEventMarkerImageId(event.tags),
      },
    })),
  };
};
