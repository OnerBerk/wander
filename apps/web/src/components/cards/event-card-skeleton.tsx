import markerArt from '@/assets/markers/marker-art.webp';
import Barcode from '@/components/cards/barcode';

const EventCardSkeleton = () => {
  return (
    <li
      className="pointer-events-none flex h-full flex-col gap-1 rounded-2xl bg-white p-2 opacity-55 grayscale"
      aria-hidden
    >
      <div className="aspect-3/4 overflow-hidden rounded-2xl">
        <img src={markerArt} alt="" width={80} height={80} className="h-full w-full object-contain" />
      </div>
      <div className="flex items-center gap-1 text-black">
        <p className="shrink-0 text-[20px] font-medium capitalize">patiente un peu</p>
        <div className="h-0.5 min-w-0 flex-1 bg-black" />
        <p className="shrink-0 text-2xl font-medium capitalize">bientôt</p>
      </div>
      <h2 className="flex h-16 items-center justify-center text-center">
        <span className="text-wander-text line-clamp-3 text-[18px] font-medium capitalize">
          les événements prennent leur temps
        </span>
      </h2>
      <div className="mt-auto">
        <div className="border-b-5 border-dotted border-b-black" />
        <div className="text-wander-text flex items-center gap-2 pt-1">
          <div className="min-w-0 flex-1 text-left">
            <p className="flex items-center gap-1 text-[15px] font-semibold tracking-wide uppercase">
              <span className="h-2 w-2 rounded-full bg-current" />
              Ticket
            </p>
            <p className="line-clamp-3 h-12 text-[11px]">
              Toto demande si c’est encore long. On lui répond : le temps que la Joconde enfile son manteau.
            </p>
          </div>
          <Barcode />
        </div>
      </div>
    </li>
  );
};

export default EventCardSkeleton;
