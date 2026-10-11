import { useEvent } from '@/api/features/events/useEvent';
import { eventPath } from '@/utils/event-path';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const { data: event, isPending } = useEvent(id);

  if (event && pathname !== eventPath(event)) {
    return <Navigate to={eventPath(event)} replace />;
  }

  const back = (
    <Link to="/" aria-label="Retour à la liste" className="inline-flex w-fit">
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );

  if (isPending) {
    return (
      <main className="flex min-h-0 flex-1 flex-col px-4 py-6">
        {back}
        <p className="mt-8 text-sm">Chargement…</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-0 flex-1 flex-col px-4 py-6">
        {back}
        <h1 className="mt-8 text-2xl font-semibold">Événement terminé</h1>
        <Link to="/" className="text-wander-orange mt-4 underline">
          Retour à la liste
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col px-4 py-6">
      {back}
      <h1 className="mt-8 text-2xl font-semibold">{event.title}</h1>
      {event.description ? (
        <div className="mt-4 text-sm leading-relaxed [&_p]:mb-2" dangerouslySetInnerHTML={{ __html: event.description }} />
      ) : null}
    </main>
  );
};

export default EventDetailsPage;
