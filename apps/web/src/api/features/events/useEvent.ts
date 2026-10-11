import { apiClient } from '@/api/client';
import useFilterStore from '@/store/zustand/useFilterStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EventData } from '@wander/types';

export const useEvent = (id: string | undefined) => {
  const queryClient = useQueryClient();
  const eventPeriod = useFilterStore((state) => state.eventPeriod);
  const eventCategory = useFilterStore((state) => state.eventCategory);
  const serializedTags = eventCategory?.length ? eventCategory.join(',') : undefined;
  const listKey = ['events', eventPeriod, serializedTags] as const;

  return useQuery({
    queryKey: ['event', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiClient.get<EventData | null>(`/events/${id}`)).data,
    initialData: () => queryClient.getQueryData<EventData[]>(listKey)?.find((event) => event.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(listKey)?.dataUpdatedAt,
  });
};
