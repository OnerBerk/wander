import {EventPeriod} from '@wander/types';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface FilterStore {
  eventPeriod: EventPeriod;
  setEventPeriod: (period: EventPeriod) => void;
}

const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      eventPeriod: 'week',
      setEventPeriod: (period) => set({eventPeriod: period}),
    }),
    {name: 'wander-filters'}
  )
);

export default useFilterStore;
