import {InvadersOverpassElement} from '@wander/types';
import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@/api/client';

export const useSpaceInvaders = () => {
  return useQuery<InvadersOverpassElement[]>({
    queryKey: ['space-invaders'],
    queryFn: async () => {
      const {data} = await apiClient.get<InvadersOverpassElement[]>('/space-invaders');
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 2,
  });
};
