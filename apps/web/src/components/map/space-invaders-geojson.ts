import spaceInvadersGeoJsonUrl from '@/assets/data/space-invaders.geojson?url';
import { SpaceInvader } from '@/types/space-invader';

interface SpaceInvaderGeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    osm_id?: number;
    ref?: string;
    description?: string;
  };
}

const parseSpaceInvader = (feature: SpaceInvaderGeoJsonFeature): SpaceInvader | null => {
  const coordinates = feature.geometry?.coordinates;
  const [lng, lat] = coordinates ?? [];
  if (typeof lng !== 'number' || typeof lat !== 'number') return null;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;

  const osmId = feature.properties?.osm_id;
  if (typeof osmId !== 'number' || !Number.isFinite(osmId)) return null;

  const ref = feature.properties?.ref;
  const description = feature.properties?.description;

  return {
    id: osmId,
    lng,
    lat,
    ...(typeof ref === 'string' && ref.length > 0 ? { ref } : {}),
    ...(typeof description === 'string' && description.length > 0 ? { description } : {}),
  };
};

const parseSpaceInvadersGeoJson = (rawJson: unknown): SpaceInvader[] => {
  if (!rawJson || typeof rawJson !== 'object') return [];

  const rawFeatureCollection = rawJson as { features?: unknown };
  if (!Array.isArray(rawFeatureCollection.features)) return [];

  const invadersById = new Map<number, SpaceInvader>();

  for (const rawFeature of rawFeatureCollection.features) {
    const invader = parseSpaceInvader(rawFeature as SpaceInvaderGeoJsonFeature);
    if (!invader) continue;
    if (invadersById.has(invader.id)) continue;
    invadersById.set(invader.id, invader);
  }

  return Array.from(invadersById.values());
};

let spaceInvadersDataPromise: Promise<SpaceInvader[]> | null = null;

export const loadSpaceInvadersData = async (): Promise<SpaceInvader[]> => {
  if (spaceInvadersDataPromise) {
    return spaceInvadersDataPromise;
  }

  spaceInvadersDataPromise = fetch(spaceInvadersGeoJsonUrl)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load space invaders dataset (${response.status})`);
      }

      return parseSpaceInvadersGeoJson(await response.json());
    })
    .catch((error) => {
      console.error(error);
      return [];
    });

  return spaceInvadersDataPromise;
};
