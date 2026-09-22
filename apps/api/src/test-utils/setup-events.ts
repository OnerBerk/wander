import { DateTime } from 'luxon';
import { EventData, EventTag } from '@wander/types';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';

type EventOverrides = Omit<Partial<EventData>, 'dateStart' | 'dateEnd'> & {
  id: string;
  title: string;
  tags: EventTag[];
  dateStart: DateTime;
};

function buildEvent({ dateStart, ...overrides }: EventOverrides): EventData {
  const start = dateStart.setZone('Europe/Paris');
  return {
    leadText: '',
    description: null,
    dateEnd: start.plus({ hours: 2 }).toISO()!,
    occurrences: null,
    location: { lat: 48.8566, lng: 2.3522 },
    coverUrl: null,
    coverAlt: null,
    priceType: 'free',
    priceDetail: null,
    url: '',
    addressName: '',
    addressStreet: '',
    addressZipcode: '',
    addressCity: 'Paris',
    audience: null,
    isIndoor: true,
    petsAllowed: false,
    contactUrl: null,
    contactPhone: null,
    accessType: null,
    accessLink: null,
    ...overrides,
    dateStart: start.toISO()!,
  };
}

/**
 * ~10 events relatifs à `today` (passé / jour J / futur / mois prochain).
 * Tags : Concert, Expo.
 */
export function setupEvents(today: DateTime): EventData[] {
  const day = today.setZone('Europe/Paris').startOf('day');

  return [
    buildEvent({
      id: 'past-concert',
      title: 'Concert hier',
      tags: ['Concert'],
      dateStart: day.minus({ days: 1 }).set({ hour: 20 }),
    }),
    buildEvent({
      id: 'today-concert',
      title: 'Live Jazz ce soir',
      description: 'Soirée jazz au club',
      tags: ['Concert'],
      dateStart: day.set({ hour: 20 }),
    }),
    buildEvent({
      id: 'today-expo',
      title: 'Expo photo du jour',
      description: 'Tirages argentiques',
      tags: ['Expo'],
      dateStart: day.set({ hour: 14 }),
    }),
    buildEvent({
      id: 'tomorrow-concert',
      title: 'Concert demain',
      tags: ['Concert'],
      dateStart: day.plus({ days: 1 }).set({ hour: 21 }),
    }),
    buildEvent({
      id: 'next-week-expo',
      title: 'Expo semaine prochaine',
      tags: ['Expo'],
      dateStart: day.plus({ weeks: 1 }).set({ hour: 11 }),
    }),
    buildEvent({
      id: 'next-week-concert',
      title: 'Concert semaine prochaine',
      tags: ['Concert'],
      dateStart: day.plus({ weeks: 1 }).set({ hour: 19 }),
    }),
    buildEvent({
      id: 'next-month-concert',
      title: 'Concert mois prochain',
      tags: ['Concert'],
      dateStart: day.plus({ months: 1 }).set({ day: 10, hour: 20 }),
    }),
    buildEvent({
      id: 'next-month-expo',
      title: 'Expo mois prochain',
      tags: ['Expo'],
      dateStart: day.plus({ months: 1 }).set({ day: 15, hour: 15 }),
    }),
    buildEvent({
      id: 'far-concert',
      title: 'Concert dans 3 mois',
      tags: ['Concert'],
      dateStart: day.plus({ months: 3 }).set({ hour: 20 }),
    }),
    buildEvent({
      id: 'far-expo',
      title: 'Expo dans 3 mois',
      tags: ['Expo'],
      dateStart: day.plus({ months: 3 }).set({ hour: 16 }),
    }),
  ];
}

/** Filtre dates + tags pour mocker EventsService.getAll. */
export function filterEvents(events: EventData[], query: QueryFilterDto): EventData[] {
  const range = query.dateFrom
    ? {
        start: DateTime.fromISO(query.dateFrom).startOf('day'),
        end: DateTime.fromISO(query.dateTo ?? query.dateFrom).endOf('day'),
      }
    : null;

  return events.filter((event) => {
    if (!event.dateStart) return false;

    const dateStart = DateTime.fromISO(event.dateStart);
    if (range) {
      if (dateStart < range.start) return false;
      if (dateStart > range.end) return false;
    }

    if (query.tags?.length && !query.tags.some((tag) => event.tags.includes(tag))) {
      return false;
    }

    return true;
  });
}
