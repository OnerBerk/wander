import {EventPeriod, EventTag} from '@wander/types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface FilterStore {
  eventPeriod: EventPeriod;
  setEventPeriod: (period: EventPeriod) => void;
  eventCategory: EventTag[] | undefined;
  setEventCategory: (categories: EventTag[] | undefined) => void;
  eventsEnabled: boolean;
  setEventsEnabled: (enabled: boolean) => void;
}

const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      eventPeriod: 'week',
      setEventPeriod: (period) => set({eventPeriod: period}),
      eventCategory: undefined,
      setEventCategory: (categories) => set({eventCategory: categories}),
      eventsEnabled: true,
      setEventsEnabled: (eventsEnabled) => set({eventsEnabled}),
    }),
    {
      name: 'wander-filters',
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState && typeof persistedState === 'object') {
          return {...(persistedState as object), eventsEnabled: true} as FilterStore;
        }
        return persistedState as FilterStore;
      },
    }
  )
);

export default useFilterStore;
