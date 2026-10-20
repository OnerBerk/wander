import { MetroStation } from '@/types/metro-station';
import { Coordinates, PriceType } from '@wander/types';
import { DateTime } from 'luxon';

const RER_MAX_METERS = 1000;

export interface NearbyStop {
  id: string;
  name: string;
  meters: number;
  metroLines: string[];
  rerLines: string[];
}

const toParis = (iso: string) => DateTime.fromISO(iso).setZone('Europe/Paris').setLocale('fr');

const metersBetween = (lat: number, lng: number, coordinates: [number, number]) => {
  const [stationLng, stationLat] = coordinates;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(stationLat - lat);
  const dLng = toRad(stationLng - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(stationLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.min(1, Math.sqrt(a)));
};

export const formatDateRange = (dateStart: string, dateEnd: string): string | null => {
  const start = toParis(dateStart);
  if (!start.isValid) return null;

  const end = toParis(dateEnd);
  if (!end.isValid || start.hasSame(end, 'day')) return start.toFormat('d LLL yyyy');
  return `${start.toFormat('d LLL')} – ${end.toFormat('d LLL yyyy')}`;
};

export const formatEventTime = (dateStart: string): string | null => {
  const raw = DateTime.fromISO(dateStart);
  if (!raw.isValid || (raw.hour === 0 && raw.minute === 0)) return null;
  return toParis(dateStart).toFormat("H'h'mm");
};

export const formatEventPrice = (priceType: PriceType | null, priceDetail: string | null): string | null => {
  if (priceType === 'free') return 'Gratuit';
  if (priceType !== 'paid') return null;
  return priceDetail?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || 'Payant';
};

export const formatDistance = (meters: number): string =>
  meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1).replace('.', ',')} km`;

export const findNearestStations = (location: Coordinates, stations: Iterable<MetroStation>): NearbyStop[] => {
  let metro: NearbyStop | null = null;
  let rer: NearbyStop | null = null;

  for (const station of stations) {
    const meters = metersBetween(location.lat, location.lng, station.coordinates);
    if (station.metroLines.length > 0 && (!metro || meters < metro.meters)) {
      metro = { id: station.id, name: station.name, meters, metroLines: station.metroLines, rerLines: [] };
    }
    if (station.rerLines.length > 0 && meters <= RER_MAX_METERS && (!rer || meters < rer.meters)) {
      rer = { id: station.id, name: station.name, meters, metroLines: [], rerLines: station.rerLines };
    }
  }

  if (metro && rer && metro.id === rer.id) {
    return [{ ...metro, rerLines: rer.rerLines }];
  }

  return [metro, rer].filter((stop) => stop !== null);
};
