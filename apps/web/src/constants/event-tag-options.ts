import { EventTag } from '@wander/types';
import markerDefault from '@/assets/markers/marker-default.png';
import markerBook from '@/assets/markers/marker-book.png';
import markerMusic from '@/assets/markers/music-marker.png';
import markerTree from '@/assets/markers/marker-tree.png';
import markerKids from '@/assets/markers/marker-kids.png';
import markerTheatre from '@/assets/markers/marker-theatre.png';
import markerArt from '@/assets/markers/marker-art.png';
import markerPhoto from '@/assets/markers/marker-photo.png';
import markerHistory from '@/assets/markers/marker-history.png';
import markerFood from '@/assets/markers/marker-food.png';
import markerStreetArt from '@/assets/markers/marker-street-art.png';
import markerBrocante from '@/assets/markers/marker-brocante.png';
import markerHealth from '@/assets/markers/marker-health.png';
import markerSport from '@/assets/markers/marker-sport.png';

export type EventTagOption = {
  value: EventTag;
  label: string;
  accent: string;
  icon: string;
};

export const EVENT_TAG_OPTIONS: EventTagOption[] = [
  { value: 'Art contemporain', label: 'Art', accent: 'accent-rose-400', icon: markerArt },
  { value: 'Théâtre', label: 'Théâtre', accent: 'accent-red-400', icon: markerTheatre },
  { value: 'Enfants', label: 'Enfants', accent: 'accent-amber-400', icon: markerKids },
  { value: 'Brocante', label: 'Brocante', accent: 'accent-stone-400', icon: markerBrocante },
  { value: 'Photo', label: 'Photo', accent: 'accent-cyan-500', icon: markerPhoto },
  { value: 'Santé', label: 'Santé', accent: 'accent-emerald-400', icon: markerHealth },
  { value: 'Street-art', label: 'Street-art', accent: 'accent-rose-400', icon: markerStreetArt },
  { value: 'Concert', label: 'Concert', accent: 'accent-violet-400', icon: markerMusic },
  { value: 'Expo', label: 'Expo', accent: 'accent-cyan-500', icon: markerDefault },
  { value: 'Festival', label: 'Festival', accent: 'accent-fuchsia-400', icon: markerMusic },
  { value: 'Gourmand', label: 'Gourmand', accent: 'accent-orange-400', icon: markerFood },
  { value: 'Histoire', label: 'Histoire', accent: 'accent-lime-500', icon: markerHistory },
  { value: 'Littérature', label: 'Littérature', accent: 'accent-yellow-600', icon: markerBook },
  { value: 'Loisirs', label: 'Loisirs', accent: 'accent-blue-400', icon: markerDefault },
  { value: 'Nature', label: 'Nature', accent: 'accent-green-400', icon: markerTree },
  { value: 'Spectacle musical', label: 'Musique', accent: 'accent-pink-400', icon: markerMusic },
  { value: 'BD', label: 'BD', accent: 'accent-yellow-600', icon: markerBook },
  { value: 'Sciences', label: 'Sciences', accent: 'accent-indigo-400', icon: markerDefault },
  { value: 'Sport', label: 'Sport', accent: 'accent-red-500', icon: markerSport },
  { value: 'Conférence', label: 'Conférence', accent: 'accent-sky-400', icon: markerDefault },
];

export const ICON_BY_TAG = new Map(EVENT_TAG_OPTIONS.map(({ value, icon }) => [value, icon]));

export const getUniqueEventTagIcons = (tags: readonly EventTag[]) =>
  [
    ...tags.reduce((byIcon, tag) => {
      const icon = ICON_BY_TAG.get(tag);
      if (!icon) return byIcon;
      return byIcon.set(icon, [...(byIcon.get(icon) ?? []), tag]);
    }, new Map<string, EventTag[]>()),
  ].map(([icon, labels]) => ({
    icon,
    label: labels.join(', '),
  }));
