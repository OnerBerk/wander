import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@/api/client';
import {WeatherData} from '@wander/types';

export const useWeather = () => {
  return useQuery<WeatherData>({
    queryKey: ['weather'],
    queryFn: async () => {
      const {data} = await apiClient.get<WeatherData>('/weather');
      return data;
    },
    refetchInterval: 1000 * 60 * 30,
  });
};
