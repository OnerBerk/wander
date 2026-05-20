import { useState } from 'react';
import useFilterStore from '@/store/zustand/useFilterStore';
import useEventsMapStore from '@/store/zustand/useEventsMapStore';
import { EventPeriod, EventTag } from '@wander/types';
import { EVENT_TAG_OPTIONS } from '@/constants/event-tag-options';

interface FiltersProps {
  onSubmit?: () => void;
}

const Filters: React.FC<FiltersProps> = ({ onSubmit }) => {
  const { eventPeriod, eventCategory, eventsEnabled, setEventPeriod, setEventCategory, setEventsEnabled } =
    useFilterStore();
  const resetAccumulatedEvents = useEventsMapStore((state) => state.resetEvents);

  const [period, setPeriod] = useState<EventPeriod>(eventPeriod);
  const [tags, setTags] = useState<EventTag[]>(() => (eventsEnabled ? (eventCategory ?? []) : []));
  const [all, setAll] = useState(() => eventsEnabled && eventCategory === undefined);
  const [none, setNone] = useState(() => !eventsEnabled);
  const [error, setError] = useState(false);

  const toggleTag = (tag: EventTag) => {
    setError(false);
    setAll(false);
    setNone(false);
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleAll = () => {
    setAll(true);
    setNone(false);
    setTags([]);
    setError(false);
  };

  const handleNone = () => {
    setNone(true);
    setAll(false);
    setTags([]);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (none) {
      resetAccumulatedEvents();
      setEventPeriod(period);
      setEventsEnabled(false);
      setEventCategory(undefined);
      onSubmit?.();
      return;
    }
    if (!all && tags.length === 0) {
      setError(true);
      return;
    }
    resetAccumulatedEvents();
    setEventPeriod(period);
    setEventsEnabled(true);
    setEventCategory(all ? undefined : tags);
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value as EventPeriod)}
        className="rounded-md border border-white/30 bg-white/40 px-3 py-1.5 text-xs focus:outline-none md:text-sm"
      >
        <option value="today">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois-ci</option>
        <option value="all">Tout</option>
      </select>

      <div className="rounded-md border border-white/30 bg-white/20 p-3 text-xs md:text-sm">
        <div className="flex flex-row justify-between gap-2 border-b border-white/30 pb-2">
          <label className="mb-3 flex cursor-pointer items-center gap-2 text-xs font-medium md:text-sm">
            <input type="checkbox" checked={all} onChange={handleAll} className="h-4 w-4 accent-slate-700" />
            Tout
          </label>
          <label className="mb-3 flex cursor-pointer items-center gap-2 text-xs font-medium md:text-sm">
            <input type="checkbox" checked={none} onChange={handleNone} className="h-4 w-4 accent-slate-700" />
            Aucun
          </label>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-col md:gap-2">
          {EVENT_TAG_OPTIONS.map(({ value, accent, icon }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={tags.includes(value)}
                onChange={() => toggleTag(value)}
                className={`h-4 w-4 ${accent}`}
              />
              <div className="flex w-full items-center gap-1">
                <span className="text-xs font-medium md:text-sm">{value}</span>
                <img src={icon} alt="" className="h-7 w-7 object-contain md:h-9 md:w-9" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500">Sélectionne au moins une catégorie, coche « Tout » ou « Aucun ».</p>
      )}

      <button
        type="submit"
        className="bg-wander-orange cursor-pointer rounded-full px-4 py-1.5 text-xs text-white md:text-sm"
      >
        Appliquer
      </button>
    </form>
  );
};

export default Filters;
