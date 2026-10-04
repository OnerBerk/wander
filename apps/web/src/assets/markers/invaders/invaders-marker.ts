import markerInvadersUrl from './marker-invaders.webp';
import markerInvaders1Url from './marker-invaders1.webp';
import markerInvaders2Url from './marker-invaders2.webp';
import markerInvaders3Url from './marker-invaders3.webp';
import markerInvaders4Url from './marker-invaders4.webp';
import { applyMarkerEntranceBounce } from '@/utils/map-utils';

const SPACE_INVADER_MARKER_URLS = [
  markerInvadersUrl,
  markerInvaders1Url,
  markerInvaders2Url,
  markerInvaders3Url,
  markerInvaders4Url,
] as const;

export const getSpaceInvaderMarkerUrl = (invaderId: number): string => {
  const index = Math.abs(invaderId) % SPACE_INVADER_MARKER_URLS.length;
  return SPACE_INVADER_MARKER_URLS[index];
};

export const createSpaceInvaderMarkerElement = (invaderId: number, delayMs = 0): HTMLElement => {
  const image = document.createElement('img');
  image.src = getSpaceInvaderMarkerUrl(invaderId);
  image.alt = '';
  image.width = 40;
  image.height = 40;
  image.className = 'h-8 w-8 object-contain md:h-10 md:w-10';
  return applyMarkerEntranceBounce(image, delayMs);
};
