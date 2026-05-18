import { EventData, EventTag } from '@wander/types';

export const EVENT_MARKER_IMAGE_IDS = {
  default: 'event-marker-default',
  music: 'event-marker-music',
  tree: 'event-marker-tree',
  book: 'event-marker-book',
  kids: 'event-marker-kids',
  theatre: 'event-marker-theatre',
  art: 'event-marker-art',
} as const;

export type EventMarkerImageId = (typeof EVENT_MARKER_IMAGE_IDS)[keyof typeof EVENT_MARKER_IMAGE_IDS];

const COORDINATE_GROUP_PRECISION = 6;
const DUPLICATE_MARKER_OFFSET_METERS = 3;
const MAX_OFFSET_RADIUS_METERS = 28;
const METERS_PER_DEGREE_LAT = 111_320;
const GOLDEN_ANGLE_RADIANS = 2.399963229728653;

const hashString = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

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
      case 'Littérature':
        return EVENT_MARKER_IMAGE_IDS.book;
      case 'Enfants':
        return EVENT_MARKER_IMAGE_IDS.kids;
      case 'Théâtre':
        return EVENT_MARKER_IMAGE_IDS.theatre;
      case 'Art contemporain':
        return EVENT_MARKER_IMAGE_IDS.art;
      default:
        break;
    }
  }

  return EVENT_MARKER_IMAGE_IDS.default;
};

export const buildEventsGeoJson = (events: EventData[]): EventsGeoJsonFeatureCollection => {
  const groupedByCoordinate = new Map<string, EventData[]>();
  for (const event of events) {
    const key = `${event.location.lat.toFixed(COORDINATE_GROUP_PRECISION)}:${event.location.lng.toFixed(COORDINATE_GROUP_PRECISION)}`;
    const existing = groupedByCoordinate.get(key);
    if (existing) {
      existing.push(event);
    } else {
      groupedByCoordinate.set(key, [event]);
    }
  }

  const offsetCoordinatesByEventId = new Map<string, [number, number]>();

  for (const groupedEvents of groupedByCoordinate.values()) {
    if (groupedEvents.length === 1) {
      const singleEvent = groupedEvents[0];
      offsetCoordinatesByEventId.set(singleEvent.id, [singleEvent.location.lng, singleEvent.location.lat]);
      continue;
    }

    const sortedGroupedEvents = [...groupedEvents].sort((left, right) => {
      if (left.id < right.id) return -1;
      if (left.id > right.id) return 1;
      return 0;
    });

    sortedGroupedEvents.forEach((event, index) => {
      const spiralIndex = index + 1;
      const angle = spiralIndex * GOLDEN_ANGLE_RADIANS + (hashString(event.id) % 11) * 0.005;
      const offsetRadiusMeters = Math.min(
        DUPLICATE_MARKER_OFFSET_METERS * Math.sqrt(spiralIndex),
        MAX_OFFSET_RADIUS_METERS,
      );
      const latitudeInRadians = (event.location.lat * Math.PI) / 180;

      const latOffset = (offsetRadiusMeters * Math.sin(angle)) / METERS_PER_DEGREE_LAT;
      const lngOffset =
        (offsetRadiusMeters * Math.cos(angle)) / (METERS_PER_DEGREE_LAT * Math.max(Math.cos(latitudeInRadians), 0.2));

      offsetCoordinatesByEventId.set(event.id, [event.location.lng + lngOffset, event.location.lat + latOffset]);
    });
  }

  return {
    type: 'FeatureCollection',
    features: events.map((event) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: offsetCoordinatesByEventId.get(event.id) ?? [event.location.lng, event.location.lat],
      },
      properties: {
        eventId: event.id,
        markerIcon: getEventMarkerImageId(event.tags),
      },
    })),
  };
};
