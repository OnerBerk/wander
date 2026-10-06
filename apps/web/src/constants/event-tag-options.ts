import { EventTag } from '@wander/types';
import markerDefault from '@/assets/markers/marker-default.webp';
import markerBook from '@/assets/markers/marker-book.webp';
import markerMusic from '@/assets/markers/music-marker.webp';
import markerTree from '@/assets/markers/marker-tree.webp';
import markerKids from '@/assets/markers/marker-kids.webp';
import markerTheatre from '@/assets/markers/marker-theatre.webp';
import markerArt from '@/assets/markers/marker-art.webp';
import markerPhoto from '@/assets/markers/marker-photo.webp';
import markerHistory from '@/assets/markers/marker-history.webp';
import markerFood from '@/assets/markers/marker-food.webp';
import markerStreetArt from '@/assets/markers/marker-street-art.webp';
import markerBrocante from '@/assets/markers/marker-brocante.webp';
import markerHealth from '@/assets/markers/marker-health.webp';
import markerSport from '@/assets/markers/marker-sport.webp';

export type EventTagOption = {
  value: EventTag;
  label: string;
  accent: string;
  icon: string;
  bg?: string;
  color?: string;
};

const DEFAULT_CLEAR_COLOR = '#f5f5f5';

export const EVENT_TAG_OPTIONS: EventTagOption[] = [
  {
    value: 'Art contemporain',
    label: 'Art',
    accent: 'accent-rose-400',
    icon: markerArt,
    bg: '#A6A246',
  },
  {
    value: 'Théâtre',
    label: 'Théâtre',
    accent: 'accent-red-400',
    icon: markerTheatre,
    bg: '#617891',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'Enfants',
    label: 'Enfants',
    accent: 'accent-amber-400',
    icon: markerKids,
    bg: '#FFC0CB',
  },
  {
    value: 'Brocante',
    label: 'Brocante',
    accent: 'accent-stone-400',
    icon: markerBrocante,
    bg: '#7A2038',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'Photo',
    label: 'Photo',
    accent: 'accent-cyan-500',
    icon: markerPhoto,
    bg: '#30373E',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'Santé',
    label: 'Santé',
    accent: 'accent-emerald-400',
    icon: markerHealth,
    bg: '#0A4F54',
    color: DEFAULT_CLEAR_COLOR,
  },
  { value: 'Street-art', label: 'Street-art', accent: 'accent-rose-400', icon: markerStreetArt, bg: '#C49B4C' },
  { value: 'Concert', label: 'Concert', accent: 'accent-violet-400', icon: markerMusic, bg: '#D5B893' },
  { value: 'Expo', label: 'Expo', accent: 'accent-cyan-500', icon: markerDefault },
  {
    value: 'Festival',
    label: 'Festival',
    accent: 'accent-fuchsia-400',
    icon: markerMusic,
    bg: '#6B4570',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'Gourmand',
    label: 'Gourmand',
    accent: 'accent-orange-400',
    icon: markerFood,
    bg: '#A33B3B',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'Histoire',
    label: 'Histoire',
    accent: 'accent-lime-500',
    icon: markerHistory,
    bg: '#6F4D38',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'Littérature',
    label: 'Littérature',
    accent: 'accent-yellow-600',
    icon: markerBook,
    bg: '#C4A035',
  },
  { value: 'Loisirs', label: 'Loisirs', accent: 'accent-blue-400', icon: markerDefault },
  {
    value: 'Nature',
    label: 'Nature',
    accent: 'accent-green-400',
    icon: markerTree,
    bg: '#3E6B48',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'Spectacle musical',
    label: 'Musique',
    accent: 'accent-pink-400',
    icon: markerMusic,
    bg: '#3E6284',
    color: DEFAULT_CLEAR_COLOR,
  },
  {
    value: 'BD',
    label: 'BD',
    accent: 'accent-yellow-600',
    icon: markerBook,
    bg: '#3A424C',
    color: DEFAULT_CLEAR_COLOR,
  },
  { value: 'Sciences', label: 'Sciences', accent: 'accent-indigo-400', icon: markerDefault },
  {
    value: 'Sport',
    label: 'Sport',
    accent: 'accent-red-500',
    icon: markerSport,
    bg: '#E08A3C',
  },
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
