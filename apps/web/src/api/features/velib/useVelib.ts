import {apiClient} from '@/api/client';
import useMapStore from '@/store/zustand/useMapStore';
import useMapLayersStore from '@/store/zustand/useMapLayersStore';
import {useQuery} from '@tanstack/react-query';
import {VelibStation} from '@wander/types';

export const useVelib = () => {
  const {mapView} = useMapStore();
  const isVelibMarkersVisible = useMapLayersStore((state) => state.isVelibMarkersVisible);

  return useQuery<VelibStation[]>({
    queryKey: ['velib', mapView.lat, mapView.lng, mapView.radius],
    enabled: isVelibMarkersVisible,
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
    refetchInterval: isVelibMarkersVisible ? 1000 * 60 : false,
    refetchOnMount: 'always',
  });
};
