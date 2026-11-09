import { useId, useState, type SubmitEvent } from 'react';
import { Send, X } from 'lucide-react';
import iaIcon from '@/assets/icons/IA-icon.png';
import { useAiConversation } from '@/hooks/use-ai-conversation';
import usePanelStore from '@/store/zustand/usePanelStore';
import ChatTurn from './chat-turn';

const MIN_MESSAGE_LENGTH = 5;
const MAX_MESSAGE_LENGTH = 1000;

const AiPanel = () => {
  const titleId = useId();
  const inputId = useId();
  const isOpen = usePanelStore((state) => state.isAiPanelOpen);
  const closeAiPanel = usePanelStore((state) => state.closeAiPanel);
  const { turns, send, isPending, reset } = useAiConversation();
  const [draft, setDraft] = useState('');
  const trimmed = draft.trim();
  const canSend = trimmed.length >= MIN_MESSAGE_LENGTH && draft.length <= MAX_MESSAGE_LENGTH && !isPending;

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;
    send(trimmed);
    setDraft('');
  };

  const onReset = () => {
    if (!window.confirm('Êtes-vous sûr d’effacer la discussion ?')) return;
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 grid place-items-center">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-black/30" onClick={closeAiPanel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-wander-crem relative flex h-[90svh] w-[90vw] max-w-350 flex-col overflow-hidden rounded-2xl p-2"
      >
        <header
          className="flex h-14 shrink-0 items-center justify-between gap-4 rounded-2xl border-2 px-2 md:h-20"
          style={{ backgroundImage: 'url(/bg-marine.webp)' }}
        >
          <img src={iaIcon} alt="" className="h-full w-auto object-contain" />
          <h2 id={titleId} className="text-wander-crem text-lg font-bold md:text-4xl">
            Dénicheur de sorties
          </h2>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
            {turns.map((turn) => (
              <ChatTurn key={turn.id} turn={turn} />
            ))}
          </div>
        </main>
        <form onSubmit={onSubmit} className="flex shrink-0 items-center gap-2 p-2">
          <label htmlFor={inputId} className="sr-only">
            Décris la sortie que tu cherches
          </label>
          <textarea
            id={inputId}
            value={draft}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={1}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' || event.shiftKey) return;
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
            placeholder="Un concert ce week-end"
            className="text-wander-black focus:ring-wander-text min-w-0 flex-1 resize-none rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2"
          />
          <button
            type="submit"
            aria-label="Envoyer"
            disabled={!canSend}
            className="bg-wander-black text-wander-crem flex h-8 w-8 shrink-0 items-center justify-center rounded-full disabled:opacity-40 md:h-auto md:w-auto md:px-4 md:py-2 md:text-sm md:font-semibold"
          >
            <Send className="h-4 w-4 md:hidden" aria-hidden="true" />
            <span className="hidden md:inline">Envoyer</span>
          </button>
          <button
            type="button"
            aria-label="Effacer la discussion"
            onClick={onReset}
            disabled={turns.length === 0}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-900 text-white disabled:opacity-40"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiPanel;
