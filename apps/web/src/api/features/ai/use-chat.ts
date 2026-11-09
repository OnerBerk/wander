import { apiClient } from '@/api/client';
import { useMutation } from '@tanstack/react-query';
import { ChatResult } from '@wander/types';

const CHAT_TIMEOUT_MS = 60_000;

export const useChat = () =>
  useMutation({
    mutationFn: async (message: string) => {
      const { data } = await apiClient.post<{ response: ChatResult }>(
        '/ai/chat',
        { message },
        { timeout: CHAT_TIMEOUT_MS },
      );
      return data.response;
    },
  });
