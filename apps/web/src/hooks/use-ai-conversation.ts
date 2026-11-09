import { useChat } from '@/api/features/ai/use-chat';
import useChatStore from '@/store/zustand/useChatStore';
import usePanelStore from '@/store/zustand/usePanelStore';
import { useEffect, useRef } from 'react';

export const useAiConversation = () => {
  const isOpen = usePanelStore((state) => state.isAiPanelOpen);
  const turns = useChatStore((state) => state.turns);
  const appendUserMessage = useChatStore((state) => state.appendUserMessage);
  const setReply = useChatStore((state) => state.setReply);
  const markOpened = useChatStore((state) => state.markOpened);
  const markClosed = useChatStore((state) => state.markClosed);
  const reset = useChatStore((state) => state.reset);
  const wasOpen = useRef(isOpen);
  const chat = useChat();

  useEffect(() => {
    if (isOpen) {
      markOpened();
    } else if (wasOpen.current) {
      markClosed();
    }
    wasOpen.current = isOpen;
  }, [isOpen, markOpened, markClosed]);

  const send = (message: string) => {
    const id = appendUserMessage(message);
    chat.mutate(message, { onSuccess: (reply) => setReply(id, reply) });
  };

  return { turns, send, isPending: chat.isPending, reset };
};
