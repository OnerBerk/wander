import {EventTag} from '@wander/types';
import {createDefaultMarkerElement} from '@/assets/markers/default/default-marker';
import {createBikeMarkerElement} from '@/assets/markers/bike/bike-marker';
import {createMusicMarkerElement} from '@/assets/markers/music/music-marker';

export const calculateRadius = (zoom: number) => {
  return Math.max(0.5, 50 / Math.pow(2, zoom - 10));
};

export const getEventMarkerElement = (tags: EventTag[]): HTMLElement => {
  for (const tag of tags) {
    switch (tag) {
      case 'Concert':
      case 'Festival':
        return createMusicMarkerElement();
      default:
        break;
    }
  }

  return createDefaultMarkerElement();
};

export const getVelibMarkerElement = (bikesAvailable: number): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'relative h-11 w-11';

  const marker = createBikeMarkerElement();
  container.appendChild(marker);

  const availabilityBadge = document.createElement('span');
  availabilityBadge.className =
    'absolute -right-1 -top-1 rounded-full bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-900 shadow';
  availabilityBadge.textContent = String(bikesAvailable);
  container.appendChild(availabilityBadge);

  return container;
};
