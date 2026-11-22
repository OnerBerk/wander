import type { EventTag } from '@wander/types';

export const EVENT_TAG_LABELS = [
  { value: 'Art contemporain', label: 'Art' },
  { value: 'Théâtre', label: 'Théâtre' },
  { value: 'Enfants', label: 'Enfants' },
  { value: 'Brocante', label: 'Brocante' },
  { value: 'Photo', label: 'Photo' },
  { value: 'Santé', label: 'Santé' },
  { value: 'Street-art', label: 'Street-art' },
  { value: 'Concert', label: 'Concert' },
  { value: 'Expo', label: 'Expo' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Gourmand', label: 'Gourmand' },
  { value: 'Histoire', label: 'Histoire' },
  { value: 'Littérature', label: 'Littérature' },
  { value: 'Loisirs', label: 'Loisirs' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Spectacle musical', label: 'Musique' },
  { value: 'BD', label: 'BD' },
  { value: 'Sciences', label: 'Sciences' },
  { value: 'Sport', label: 'Sport' },
  { value: 'Conférence', label: 'Conférence' },
] as const satisfies readonly { value: EventTag; label: string }[];

export type ListedEventTag = (typeof EVENT_TAG_LABELS)[number]['value'];
