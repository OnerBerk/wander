import {apiClient} from '@/api/client';
import useFilterStore from '@/store/zustand/useFilterStore';
import useMapStore from '@/store/zustand/useMapStore';
import {useQuery} from '@tanstack/react-query';
import {EventData} from '@wander/types';

export const useEvents = () => {
  const {mapView} = useMapStore();
  const eventsEnabled = useFilterStore((state) => state.eventsEnabled);
  const eventPeriod = useFilterStore((state) => state.eventPeriod);
  const eventCategory = useFilterStore((state) => state.eventCategory);
  const serializedTags = eventCategory?.length ? eventCategory.join(',') : undefined;

  return useQuery<EventData[]>({
    queryKey: ['events', mapView.lat, mapView.lng, mapView.radius, eventPeriod, serializedTags, eventsEnabled],
    enabled: eventsEnabled,
    staleTime: 30_000,
    queryFn: async () => {
      const {data} = await apiClient.get<EventData[]>('/events', {
        params: {
          lat: mapView.lat,
          lng: mapView.lng,
          radius: mapView.radius,
          limit: 100,
          period: eventPeriod,
          tags: serializedTags,
        },
      });
      return data;
    },
  });
};
