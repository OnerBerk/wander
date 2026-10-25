import { useEvent } from '@/api/features/events/useEvent';
import { loadMetroStationsData } from '@/components/map/metro-geojson';
import { metroIconByLine, rerIconByLine } from '@/components/modals/utils';
import PageLoader from '@/ui-components/page-loader';
import PageMessage from '@/ui-components/page-message';
import { eventBackPath, eventPath } from '@/utils/event-path';
import {
  findNearestStations,
  formatDateRange,
  formatDistance,
  formatEventPrice,
  formatEventTime,
} from '@/utils/event-details';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Home, MapPin, Ticket, TreePine } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import form from '@/assets/icons/form.svg';
import formWhite from '@/assets/icons/form-white.svg';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import EventTagIcons from '@/components/modals/event-tag-icons';
import SeoMetadata from '@/components/seo/seo-metadata';

const lineIcons = (lines: string[], icons: Record<string, string>) => {
  if (lines.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {lines.map((line) =>
        icons[line.toUpperCase()] ? (
          <img
            key={line}
            src={icons[line.toUpperCase()]}
            alt={`Ligne ${line}`}
            className="h-6 w-6 object-contain md:h-8 md:w-8"
          />
        ) : (
          <span key={line} className="text-wander-black font-semibold">
            {line}
          </span>
        ),
      )}
    </div>
  );
};

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { pathname, state } = useLocation();
  const backTo = eventBackPath(state);
  const { data: event, isPending } = useEvent(id);
  const spotMapRef = useRef<HTMLDivElement>(null);
  const { data: metroData } = useQuery({
    queryKey: ['metro-stations'],
    queryFn: loadMetroStationsData,
    staleTime: Infinity,
  });

  const spotLat = event?.location.lat;
  const spotLng = event?.location.lng;

  useEffect(() => {
    if (!spotMapRef.current || spotLat == null || spotLng == null) return;

    const spotMap = new maplibregl.Map({
      container: spotMapRef.current,
      style: `https://api.maptiler.com/maps/topo-v4/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center: [spotLng, spotLat],
      zoom: 13,
      interactive: false,
      attributionControl: false,
    });
    new maplibregl.Marker({ color: '#cc4b10' }).setLngLat([spotLng, spotLat]).addTo(spotMap);

    return () => spotMap.remove();
  }, [pathname, spotLat, spotLng]);

  if (event && pathname !== eventPath(event)) {
    return <Navigate to={eventPath(event)} replace state={state} />;
  }

  if (isPending) return <PageLoader to={backTo} />;
  if (!event) return <PageMessage title="Événement terminé" to={backTo} linkLabel="Retour" />;

  const addressLine = `${event.addressStreet}, ${event.addressZipcode} ${event.addressCity}`;
  const mapsUrl = `https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`;
  const dateLabel = formatDateRange(event.dateStart, event.dateEnd);
  const timeLabel = formatEventTime(event.dateStart);
  const price = formatEventPrice(event.priceType, event.priceDetail);
  const stops = findNearestStations(event.location, metroData?.stationsById.values() ?? []);
  const bg = { backgroundImage: `url(${event.coverUrl})` };
  const bloc = ' bg-cover bg-center md:bg-fixed';
  const ink = '[text-shadow:0_0_2px_#e8e4da,0_0_8px_#e8e4da,0_0_16px_#e8e4da]';

  return (
    <main className="bg-wander-crem flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3 md:overflow-hidden">
      <SeoMetadata
        title={`${event.title} | Wander`}
        description={event.leadText || 'Événement à Paris et en Île-de-France.'}
        canonicalPath={eventPath(event)}
      />
      <Link to={backTo} aria-label="Retour" className="mb-4 inline-flex w-fit items-center gap-2">
        <ArrowLeft className="h-5 w-5" />
        Retour
      </Link>
      <div className="mx-auto w-full md:my-auto md:h-[80vh] md:w-[75vw]" style={{ containerType: 'size' }}>
        <div className="grid w-full grid-cols-1 gap-4 md:h-[80vh] md:grid-cols-3 md:grid-rows-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="relative min-h-96 overflow-hidden md:col-span-2 md:row-span-2 md:min-h-0">
            <div className={`${bloc} absolute inset-0 blur-xl brightness-150 grayscale-80 md:-inset-4`} style={bg} />
            <div className="relative min-h-96 md:h-full">
              <img src={form} alt="" className="absolute top-4 left-4 z-10 h-8 w-8 md:h-11 md:w-11" />
              <div className="scrollbar-hidden h-full overflow-y-auto p-6 md:p-20">
                <p
                  className={`${ink} text-wander-black max-w-5xl rounded-b-lg p-2 text-justify text-sm font-medium **:text-sm sm:text-sm sm:**:text-sm md:text-lg md:**:text-lg lg:text-2xl lg:**:text-2xl`}
                  dangerouslySetInnerHTML={{ __html: event.description ?? '' }}
                />
              </div>
              <div className="absolute right-3 bottom-3 z-10 md:right-6 md:bottom-6">
                <EventTagIcons tags={event.tags} iconClassName="h-10 w-10 shrink-0 object-contain md:h-14 md:w-14" />
              </div>
            </div>
          </div>
          <div className="relative min-h-48 overflow-hidden p-3 md:min-h-0">
            <div className={`${bloc} absolute inset-0 brightness-125 grayscale`} style={bg} />
            <div className="relative min-h-48 md:h-full">
              <img src={formWhite} alt="" className="absolute right-4 bottom-4 z-10 h-8 w-8 md:h-11 md:w-11" />
              <div className={`${ink} scrollbar-hidden grid h-full grid-rows-[1fr_auto_1fr] overflow-y-auto`}>
                <div className="text-wander-black flex w-full flex-col pt-4 pl-4 text-left">
                  {dateLabel ? (
                    <p className="w-full text-sm font-bold sm:text-sm md:text-base lg:text-xl">{dateLabel}</p>
                  ) : null}
                  {timeLabel ? (
                    <p className="w-full text-sm font-bold sm:text-sm md:text-base lg:text-xl">{timeLabel}</p>
                  ) : null}
                  <p className="w-full text-sm font-bold sm:text-sm md:text-base lg:text-xl">{event.addressName}</p>
                </div>
                <h1 className="text-wander-black relative max-w-md pl-4 text-left text-xl font-bold sm:text-lg md:text-2xl lg:text-4xl">
                  {event.title}
                </h1>
                <div />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden p-3 md:min-h-0 md:p-10">
            <div className={`${bloc} absolute inset-0 blur-sm brightness-125 grayscale-20`} style={bg} />
            <div className="relative md:h-full">
              <div
                className={`${ink} scrollbar-hidden text-wander-black flex h-auto flex-col gap-3 overflow-y-auto p-2 md:h-full`}
              >
                <p className="text-lg font-bold">Infos pratiques</p>
                <p className="w-full font-bold">{event.addressName}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wander-text flex items-start gap-2 font-semibold underline"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {addressLine}
                </a>
                <div
                  ref={spotMapRef}
                  className="h-28 w-full overflow-hidden rounded-xl [mask-image:linear-gradient(to_right,transparent,black_3px,black_calc(100%_-_3px),transparent),linear-gradient(to_bottom,transparent,black_3px,black_calc(100%_-_3px),transparent)] [mask-composite:intersect] [&_.maplibregl-ctrl-logo]:hidden [&_canvas]:grayscale"
                />
                {price ? (
                  <p className="flex gap-2 font-bold">
                    <Ticket className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Entrée : {price}</span>
                  </p>
                ) : null}
                <p className="flex gap-2 font-bold">
                  {event.isIndoor ? <Home className="h-4 w-4 shrink-0" /> : <TreePine className="h-4 w-4 shrink-0" />}
                  {event.isIndoor ? 'En intérieur' : 'En extérieur'}
                </p>
                {stops.length > 0 ? <p className="items-left flex gap-2 text-lg font-bold">Transport</p> : null}
                {stops.map((stop) => (
                  <div key={stop.id}>
                    <p className="mb-2 font-medium">
                      {stop.name}
                      <span>{` — ${formatDistance(stop.meters)}`}</span>
                    </p>
                    {lineIcons(stop.metroLines, metroIconByLine)}
                    {lineIcons(stop.rerLines, rerIconByLine)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventDetailsPage;
