import {apiClient} from '@/api/client';
import useMapStore from '@/store/zustand/useMapStore';
import {useQuery} from '@tanstack/react-query';
import {VelibStation} from '@wander/types';

export const useVelib = () => {
  const {mapView} = useMapStore();

  return useQuery<VelibStation[]>({
    queryKey: ['velib', mapView.lat, mapView.lng, mapView.radius],
    queryFn: async () => {
      const {data} = await apiClient.get<VelibStation[]>('/velib', {
        params: {
          lat: mapView.lat,
          lng: mapView.lng,
          radius: mapView.radius,
        },
      });
      return data;
    },
    refetchInterval: 1000 * 60,
  });
};
