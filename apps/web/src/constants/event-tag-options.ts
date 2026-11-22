import type { EventTag } from '@wander/types';
import { EVENT_TAG_LABELS, type ListedEventTag } from '@/constants/event-tag-labels';
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

type EventTagStyle = Omit<EventTagOption, 'value' | 'label'>;

const DEFAULT_CLEAR_COLOR = '#E8E4DA';

const EVENT_TAG_STYLES: Record<ListedEventTag, EventTagStyle> = {
  'Art contemporain': { accent: 'accent-rose-400', icon: markerArt, bg: '#A6A246' },
  Théâtre: { accent: 'accent-red-400', icon: markerTheatre, bg: '#617891', color: DEFAULT_CLEAR_COLOR },
  Enfants: { accent: 'accent-amber-400', icon: markerKids, bg: '#FFC0CB' },
  Brocante: { accent: 'accent-stone-400', icon: markerBrocante, bg: '#68180F', color: DEFAULT_CLEAR_COLOR },
  Photo: { accent: 'accent-cyan-500', icon: markerPhoto, bg: '#30373E', color: DEFAULT_CLEAR_COLOR },
  Santé: { accent: 'accent-emerald-400', icon: markerHealth, bg: '#4C5A3F', color: DEFAULT_CLEAR_COLOR },
  'Street-art': { accent: 'accent-rose-400', icon: markerStreetArt, bg: '#C49B4C' },
  Concert: { accent: 'accent-violet-400', icon: markerMusic, bg: '#D5B893' },
  Expo: { accent: 'accent-cyan-500', icon: markerDefault },
  Festival: { accent: 'accent-fuchsia-400', icon: markerMusic, bg: '#A18594' },
  Gourmand: { accent: 'accent-orange-400', icon: markerFood, bg: '#802626', color: DEFAULT_CLEAR_COLOR },
  Histoire: { accent: 'accent-lime-500', icon: markerHistory, bg: '#6F4D38', color: DEFAULT_CLEAR_COLOR },
  Littérature: { accent: 'accent-yellow-600', icon: markerBook, bg: '#C4A035' },
  Loisirs: { accent: 'accent-blue-400', icon: markerDefault },
  Nature: { accent: 'accent-green-400', icon: markerTree, bg: '#C4CCB7' },
  'Spectacle musical': { accent: 'accent-pink-400', icon: markerMusic, bg: '#3E6284', color: DEFAULT_CLEAR_COLOR },
  BD: { accent: 'accent-yellow-600', icon: markerBook, bg: '#3A424C', color: DEFAULT_CLEAR_COLOR },
  Sciences: { accent: 'accent-indigo-400', icon: markerDefault },
  Sport: { accent: 'accent-red-500', icon: markerSport, bg: '#E08A3C' },
  Conférence: { accent: 'accent-sky-400', icon: markerDefault },
};

export const EVENT_TAG_OPTIONS: EventTagOption[] = EVENT_TAG_LABELS.map(({ value, label }) => ({
  value,
  label,
  ...EVENT_TAG_STYLES[value],
}));

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
