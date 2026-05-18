import markerInvadersUrl from './marker-invaders.png';
import markerInvaders1Url from './marker-invaders1.png';
import markerInvaders2Url from './marker-invaders2.png';
import markerInvaders3Url from './marker-invaders3.png';
import markerInvaders4Url from './marker-invaders4.png';
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
  image.className = 'h-8 w-8 object-contain md:h-10 md:w-10';
  return applyMarkerEntranceBounce(image, delayMs);
};
