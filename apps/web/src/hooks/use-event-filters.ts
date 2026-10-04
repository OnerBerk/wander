import useFilterStore from '@/store/zustand/useFilterStore';
import { EventPeriod, EventTag } from '@wander/types';
import { useRef, useState } from 'react';

const FILTER_DEBOUNCE_MS = 1_200;

export const PERIOD_OPTIONS: { value: EventPeriod; label: string }[] = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois-ci' },
  { value: 'all', label: 'Tout' },
];

export const useEventFilters = () => {
  const { eventPeriod, eventCategory, eventsEnabled, setEventPeriod, setEventCategory, setEventsEnabled } =
    useFilterStore();

  const [period, setPeriod] = useState<EventPeriod>(eventPeriod);
  const [tags, setTags] = useState<EventTag[]>(() => (eventsEnabled ? (eventCategory ?? []) : []));
  const [all, setAll] = useState(() => eventsEnabled && eventCategory === undefined);
  const [none, setNone] = useState(() => !eventsEnabled);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyFilters = (nextPeriod: EventPeriod, nextTags: EventTag[], isAll: boolean, isNone: boolean) => {
    setEventPeriod(nextPeriod);

    if (isNone) {
      setEventsEnabled(false);
      setEventCategory(undefined);
      return;
    }

    setEventsEnabled(true);
    setEventCategory(isAll || nextTags.length === 0 ? undefined : nextTags);
  };

  const scheduleCategoryApply = (nextPeriod: EventPeriod, nextTags: EventTag[], isAll: boolean, isNone: boolean) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyFilters(nextPeriod, nextTags, isAll, isNone), FILTER_DEBOUNCE_MS);
  };

  const handlePeriodChange = (nextPeriod: EventPeriod) => {
    setPeriod(nextPeriod);
    applyFilters(nextPeriod, tags, all, none);
  };

  const toggleTag = (tag: EventTag) => {
    const nextTags = tags.includes(tag) ? tags.filter((current) => current !== tag) : [...tags, tag];
    setAll(false);
    setNone(false);
    setTags(nextTags);
    scheduleCategoryApply(period, nextTags, false, false);
  };

  const handleAll = () => {
    setAll(true);
    setNone(false);
    setTags([]);
    scheduleCategoryApply(period, [], true, false);
  };

  const handleNone = () => {
    setNone(true);
    setAll(false);
    setTags([]);
    scheduleCategoryApply(period, [], false, true);
  };

  return { period, tags, all, none, handlePeriodChange, toggleTag, handleAll, handleNone };
};
