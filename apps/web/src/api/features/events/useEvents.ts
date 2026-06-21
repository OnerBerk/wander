import { apiClient } from '@/api/client';
import useFilterStore from '@/store/zustand/useFilterStore';
import { useQuery } from '@tanstack/react-query';
import { EventData } from '@wander/types';

const EVENTS_STALE_TIME_MS = 1000 * 60 * 15;

export const useEvents = () => {
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);
  const eventPeriod = useFilterStore((state) => state.eventPeriod);
  const eventCategory = useFilterStore((state) => state.eventCategory);
  const serializedTags = eventCategory?.length ? eventCategory.join(',') : undefined;

  return useQuery<EventData[]>({
    queryKey: ['events', eventPeriod, serializedTags],
    enabled: eventsEnabled,
    staleTime: EVENTS_STALE_TIME_MS,
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      const { data } = await apiClient.get<EventData[]>('/events', {
        params: {
          period: eventPeriod,
          tags: serializedTags,
        },
      });
      return data;
    },
  });
};
