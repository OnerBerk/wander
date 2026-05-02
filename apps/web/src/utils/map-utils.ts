import {EventTag} from '@wander/types';
import {createMusicMarkerElement} from '@/assets/markers/music/music-marker';
import {createDefaultMarkerElement} from '@/assets/markers/default/default-marker';

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
