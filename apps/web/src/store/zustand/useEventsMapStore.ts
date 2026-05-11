import {create} from 'zustand';
import {EventData} from '@wander/types';

interface EventsMapStore {
  eventsById: Record<string, EventData>;
  eventsAccumulatorEpoch: number;
  mergeEvents: (incoming: EventData[]) => void;
  resetEvents: () => void;
}

const useEventsMapStore = create<EventsMapStore>()((set) => ({
  eventsById: {},
  eventsAccumulatorEpoch: 0,
  resetEvents: () =>
    set((state) => ({
      eventsById: {},
      eventsAccumulatorEpoch: state.eventsAccumulatorEpoch + 1,
    })),
  mergeEvents: (incoming) =>
    set((state) => {
      if (incoming.length === 0) return state;
      const next = {...state.eventsById};
      for (const event of incoming) {
        next[event.id] = event;
      }
      return {eventsById: next};
    }),
}));

export const sortAccumulatedEventsById = (eventsById: Record<string, EventData>): EventData[] =>
  Object.values(eventsById).sort((left, right) => left.id.localeCompare(right.id));

export default useEventsMapStore;
