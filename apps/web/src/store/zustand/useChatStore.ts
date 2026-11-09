import { ChatResult } from '@wander/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CHAT_TTL_MS = 60 * 60 * 1000;

export interface ChatTurn {
  id: string;
  userMessage: string;
  reply: ChatResult | null;
}

interface ChatStore {
  turns: ChatTurn[];
  closedAt: number | null;
  appendUserMessage: (userMessage: string) => string;
  setReply: (id: string, reply: ChatResult) => void;
  markOpened: () => void;
  markClosed: () => void;
  reset: () => void;
}

const isExpired = (closedAt: number | null): boolean =>
  closedAt !== null && Date.now() - closedAt >= CHAT_TTL_MS;

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      turns: [],
      closedAt: null,
      appendUserMessage: (userMessage) => {
        const id = crypto.randomUUID();
        set((state) => ({
          turns: [...state.turns, { id, userMessage, reply: null }],
        }));
        return id;
      },
      setReply: (id, reply) =>
        set((state) => ({
          turns: state.turns.map((turn) => (turn.id === id ? { ...turn, reply } : turn)),
        })),
      markOpened: () => {
        const { closedAt } = get();
        if (isExpired(closedAt)) {
          set({ turns: [], closedAt: null });
          return;
        }
        if (closedAt !== null) set({ closedAt: null });
      },
      markClosed: () => set({ closedAt: Date.now() }),
      reset: () => set({ turns: [], closedAt: null }),
    }),
    {
      name: 'wander-chat',
      version: 3,
      partialize: (state) => ({
        turns: state.turns.map(({ id, userMessage, reply }) => ({ id, userMessage, reply })),
        closedAt: state.closedAt,
      }),
      migrate: (persistedState) => {
        const state = persistedState as { turns?: ChatTurn[]; closedAt?: number | null };
        return {
          turns: (state.turns ?? []).map((turn) => ({
            id: turn.id,
            userMessage: turn.userMessage,
            reply: turn.reply ?? null,
          })),
          closedAt: state.closedAt ?? null,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && isExpired(state.closedAt)) {
          useChatStore.setState({ turns: [], closedAt: null });
        }
      },
    },
  ),
);

export default useChatStore;
