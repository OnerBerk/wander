import { useId, useState, type SubmitEvent } from 'react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 grid place-items-center">
      <button type="button" aria-label="Fermer" className="absolute inset-0 bg-black/30" onClick={closeAiPanel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-wander-crem relative flex h-[95vh] w-[90vw] max-w-350 flex-col overflow-hidden rounded-2xl p-2"
      >
        <header
          className="flex h-20 shrink-0 items-center justify-between gap-4 rounded-2xl border-2 px-2"
          style={{ backgroundImage: 'url(/bg-marine.webp)' }}
        >
          <img src={iaIcon} alt="" className="h-full w-auto object-contain" />
          <h2 id={titleId} className="text-wander-crem text-xl font-bold md:text-4xl">
            Dénicheur de sorties
          </h2>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
            {turns.map((turn) => (
              <ChatTurn key={turn.id} turn={turn} />
            ))}
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={turns.length === 0}
            className="mr-3 mb-2 self-end rounded-full bg-red-900 px-3 py-1 text-sm font-semibold text-white disabled:opacity-40"
          >
            Effacer la discussion
          </button>
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
            disabled={!canSend}
            className="bg-wander-black text-wander-crem rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiPanel;
