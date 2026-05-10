import {EventPeriod, EventTag} from '@wander/types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface FilterStore {
  eventPeriod: EventPeriod;
  setEventPeriod: (period: EventPeriod) => void;
  eventCategory: EventTag[] | undefined;
  setEventCategory: (categories: EventTag[] | undefined) => void;
}

const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      eventPeriod: 'week',
      setEventPeriod: (period) => set({eventPeriod: period}),
      eventCategory: undefined,
      setEventCategory: (categories) => set({eventCategory: categories}),
    }),
    {name: 'wander-filters'}
  )
);

export default useFilterStore;
