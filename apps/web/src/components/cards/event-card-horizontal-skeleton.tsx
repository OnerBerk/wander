import markerArt from '@/assets/markers/marker-art.webp';

const EventCardHorizontalSkeleton = () => {
  return (
    <li className="pointer-events-none flex h-40 gap-2 rounded-2xl bg-white p-2 opacity-5 grayscale" aria-hidden>
      <div className="h-full w-[42%] shrink-0 overflow-hidden rounded-2xl">
        <img src={markerArt} alt="" width={80} height={80} className="h-full w-full object-cover" />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1 overflow-hidden text-black">
        <div className="flex items-center gap-1">
          <p className="shrink-0 text-sm font-medium capitalize">mer 21</p>
          <div className="h-0.5 min-w-0 flex-1 bg-black" />
          <p className="shrink-0 text-sm font-medium capitalize">oct</p>
        </div>
        <h2 className="text-wander-text line-clamp-2 text-sm capitalize">les événements prennent leur temps</h2>
        <div className="mt-auto">
          <div className="border-b-5 border-dotted border-b-black" />
          <div className="text-wander-text pt-1 text-left">
            <p className="flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Ticket
            </p>
            <p className="line-clamp-2 text-[10px]">Toto demande si c’est encore long.</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default EventCardHorizontalSkeleton;
