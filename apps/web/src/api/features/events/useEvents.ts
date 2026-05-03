import {apiClient} from '@/api/client';
import useMapStore from '@/store/zustand/useMapStore';
import {useQuery} from '@tanstack/react-query';
import {EventData} from '@wander/types';

export const useEvents = () => {
  const {mapView} = useMapStore();

  return useQuery<EventData[]>({
    queryKey: ['events', mapView.lat, mapView.lng, mapView.radius],
    staleTime: 30_000,
    queryFn: async () => {
      const {data} = await apiClient.get<EventData[]>('/events', {
        params: {
          lat: mapView.lat,
          lng: mapView.lng,
          radius: mapView.radius,
          limit: 100,
        },
      });
      return data;
    },
  });
};
