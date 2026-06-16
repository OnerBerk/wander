import { useRef, useState } from 'react';
import useFilterStore from '@/store/zustand/useFilterStore';
import useEventsMapStore from '@/store/zustand/useEventsMapStore';
import { EventPeriod, EventTag } from '@wander/types';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';
import HexagonBadge from '@/ui-components/hexagon-badge';

const FILTER_DEBOUNCE_MS = 1_200;

const Filters: React.FC = () => {
  const { eventPeriod, eventCategory, eventsEnabled, setEventPeriod, setEventCategory, setEventsEnabled } =
    useFilterStore();
  const resetAccumulatedEvents = useEventsMapStore((state) => state.resetEvents);

  const [period, setPeriod] = useState<EventPeriod>(eventPeriod);
  const [tags, setTags] = useState<EventTag[]>(() => (eventsEnabled ? (eventCategory ?? []) : []));
  const [all, setAll] = useState(() => eventsEnabled && eventCategory === undefined);
  const [none, setNone] = useState(() => !eventsEnabled);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyFilters = (p: EventPeriod, t: EventTag[], a: boolean, n: boolean) => {
    resetAccumulatedEvents();
    setEventPeriod(p);

    if (n) {
      setEventsEnabled(false);
      setEventCategory(undefined);
      return;
    }

    const isAll = a || t.length === 0;
    setEventsEnabled(true);
    setEventCategory(isAll ? undefined : t);
  };

  const scheduleCategoryApply = (p: EventPeriod, t: EventTag[], a: boolean, n: boolean) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyFilters(p, t, a, n), FILTER_DEBOUNCE_MS);
  };

  const handlePeriodChange = (newPeriod: EventPeriod) => {
    setPeriod(newPeriod);
    applyFilters(newPeriod, tags, all, none);
  };

  const toggleTag = (tag: EventTag) => {
    const nextTags = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
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

  return (
    <div className="flex w-full flex-col gap-4">
      <select
        value={period}
        onChange={(e) => handlePeriodChange(e.target.value as EventPeriod)}
        className="period-filters rounded-md border border-white/30 bg-white/40 px-3 py-1.5 text-xs focus:outline-none md:text-sm"
      >
        <option value="today">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois-ci</option>
        <option value="all">Tout</option>
      </select>

      <div className="tag-filters p-3 text-xs md:text-sm">
        <div className="grid grid-cols-4 gap-2 md:grid-cols-3">
          <HexagonBadge label="Tout" selected={all} onClick={handleAll} className="max-w-24" />
          <HexagonBadge label="Aucun" selected={none} onClick={handleNone} className="max-w-24" />
          <div className="col-span-4 md:col-span-3" />
          {EVENT_TAG_OPTIONS.map(({ value, label, icon }) => (
            <HexagonBadge
              key={value}
              className="max-w-24"
              label={label}
              icon={icon}
              selected={tags.includes(value)}
              onClick={() => toggleTag(value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
