import metroRerStationsGeoJsonUrl from '@/assets/data/metro-rer-stations.geojson?url';
import {MetroStation} from '@/types/metro-station';

interface MetroGeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    stationId: string;
    name: string;
    metroLines: string[];
    rerLines: string[];
  };
}

export interface MetroGeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: MetroGeoJsonFeature[];
}

interface MetroStationsData {
  stationsById: Map<string, MetroStation>;
  geoJson: MetroGeoJsonFeatureCollection;
}

const EMPTY_METRO_GEOJSON: MetroGeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
};

const normalizeLines = (lines: string[], isNumericSort: boolean): string[] => {
  const uniqueLines = Array.from(new Set(lines.map((line) => line.trim()).filter((line) => line.length > 0)));
  if (isNumericSort) {
    return uniqueLines.sort((left, right) => left.localeCompare(right, 'fr', {numeric: true}));
  }
  return uniqueLines.sort((left, right) => left.localeCompare(right, 'fr'));
};

const parseMetroStation = (feature: MetroGeoJsonFeature): MetroStation | null => {
  const coordinates = feature.geometry?.coordinates;
  const [lng, lat] = coordinates ?? [];
  if (typeof lng !== 'number' || typeof lat !== 'number') return null;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;

  const {stationId, name, metroLines, rerLines} = feature.properties ?? {};
  if (typeof stationId !== 'string' || stationId.trim().length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  if (!isStringArray(metroLines) || !isStringArray(rerLines)) return null;

  return {
    id: stationId.trim(),
    name: name.trim(),
    metroLines: normalizeLines(metroLines, true),
    rerLines: normalizeLines(rerLines, false),
    coordinates: [lng, lat],
  };
};

const parseMetroGeoJson = (rawJson: unknown): MetroStationsData => {
  if (!rawJson || typeof rawJson !== 'object') {
    return {stationsById: new Map<string, MetroStation>(), geoJson: EMPTY_METRO_GEOJSON};
  }

  const rawFeatureCollection = rawJson as {features?: unknown};
  if (!Array.isArray(rawFeatureCollection.features)) {
    return {stationsById: new Map<string, MetroStation>(), geoJson: EMPTY_METRO_GEOJSON};
  }

  const stationsById = new Map<string, MetroStation>();
  const features: MetroGeoJsonFeature[] = [];

  for (const rawFeature of rawFeatureCollection.features) {
    const candidateFeature = rawFeature as MetroGeoJsonFeature;
    const station = parseMetroStation(candidateFeature);
    if (!station) continue;
    if (stationsById.has(station.id)) continue;

    stationsById.set(station.id, station);
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: station.coordinates,
      },
      properties: {
        stationId: station.id,
        name: station.name,
        metroLines: station.metroLines,
        rerLines: station.rerLines,
      },
    });
  }

  return {
    stationsById,
    geoJson: {
      type: 'FeatureCollection',
      features,
    },
  };
};

let metroStationsDataPromise: Promise<MetroStationsData> | null = null;

export const loadMetroStationsData = async (): Promise<MetroStationsData> => {
  if (metroStationsDataPromise) {
    return metroStationsDataPromise;
  }

  metroStationsDataPromise = fetch(metroRerStationsGeoJsonUrl)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load metro/rer stations dataset (${response.status})`);
      }

      return parseMetroGeoJson(await response.json());
    })
    .catch((error) => {
      console.error(error);
      return {
        stationsById: new Map<string, MetroStation>(),
        geoJson: EMPTY_METRO_GEOJSON,
      };
    });

  return metroStationsDataPromise;
};
