import { ChevronDown } from 'lucide-react';
import avatarHuman from '@/assets/avatar/avatar-human.png';
import avatarIa from '@/assets/avatar/avatar-ia.png';
import EventCardHorizontal from '@/components/cards/event-card-horizontal';
import type { ChatTurn as ChatTurnData } from '@/store/zustand/useChatStore';

const eventCountLabel = (count: number) => (count > 1 ? `${count} événements` : '1 événement');

interface ChatTurnProps {
  turn: ChatTurnData;
}

const ChatTurn = ({ turn }: ChatTurnProps) => {
  const events = turn.reply?.events ?? [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center justify-end gap-2">
        <p className="bg-wander-crem text-wander-text border-wander-black min-w-0 rounded-2xl border-2 px-3 py-2 text-sm">
          {turn.userMessage}
        </p>
        <img src={avatarHuman} alt="" className="h-12 w-12 shrink-0 object-cover" />
      </div>
      {turn.reply ? (
        <div className="flex w-full items-center gap-2">
          <img src={avatarIa} alt="" className="h-12 w-12 shrink-0 object-cover" />
          <p className="font-zekton text-wander-black min-w-0 text-sm md:text-lg">{turn.reply.message}</p>
        </div>
      ) : null}
      {events.length > 0 ? (
        <details className="group">
          <summary className="text-wander-black flex w-fit cursor-pointer list-none items-center gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            {eventCountLabel(events.length)}
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="mt-2 flex flex-col gap-2">
            {events.map((event, index) => (
              <EventCardHorizontal key={event.id} event={event} index={index} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
};

export default ChatTurn;
