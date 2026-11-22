import { apiClient } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { EventData } from '@wander/types';

export const useRelatedEvents = (id: string | undefined) => {
  return useQuery({
    queryKey: ['event-related', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiClient.get<EventData[]>(`/events/${id}/related`)).data,
  });
};
