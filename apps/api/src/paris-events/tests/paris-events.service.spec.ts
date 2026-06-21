import { InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ParisEventsService } from '../paris-events.service';
import { RedisService } from '../../redis/redis.service';
import { HttpClientService } from '../../http-client/http-client.service';
import { EventData } from '@wander/types';
import { setupUnitTest } from '../../test-utils/setup-unit-test';
import { QueryFilterDto } from '../../filters/dtos/query-filter.dto';

const makeEvent = (overrides: Partial<EventData> = {}): EventData => ({
  id: '1',
  title: 'Test Event',
  leadText: 'Test lead text',
  description: '<p>Test description</p>',
  dateStart: '2099-04-22T20:00:00+00:00',
  dateEnd: '2099-04-22T23:00:00+00:00',
  occurrences: null,
  location: { lat: 48.8566, lng: 2.3522 },
  coverUrl: null,
  coverAlt: null,
  priceType: 'free',
  priceDetail: null,
  tags: ['Concert'],
  url: 'https://www.paris.fr/evenements/test',
  addressName: 'Test Venue',
  addressStreet: '1 rue de la Paix',
  addressZipcode: '75001',
  addressCity: 'Paris',
  audience: 'Tout public.',
  isIndoor: true,
  petsAllowed: false,
  contactUrl: null,
  contactPhone: null,
  accessType: null,
  accessLink: null,
  ...overrides,
});

const mockRawEvent = {
  id: '1',
  url: 'https://www.paris.fr/evenements/test',
  title: 'Test Event',
  lead_text: 'Test lead text',
  description: '<p>Test description</p>',
  date_start: '2099-04-22T20:00:00+00:00',
  date_end: '2099-04-22T23:00:00+00:00',
  occurrences: null,
  cover_url: null,
  cover_alt: null,
  price_type: 'gratuit',
  price_detail: null,
  qfap_tags: 'Concert',
  address_name: 'Test Venue',
  address_street: '1 rue de la Paix',
  address_zipcode: '75001',
  address_city: 'Paris',
  lat_lon: { lat: 48.8566, lon: 2.3522 },
  audience: 'Tout public.',
  event_indoor: 1,
  event_pets_allowed: 0,
  contact_url: null,
  contact_phone: null,
  access_type: null,
  access_link: null,
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  setPersist: jest.fn(),
};

const mockHttpClient = {
  get: jest.fn(),
};

describe('ParisEventsService', () => {
  let service: ParisEventsService;

  beforeAll(async () => {
    service = await setupUnitTest(ParisEventsService, [
      { provide: RedisService, useValue: mockRedisService },
      { provide: HttpClientService, useValue: mockHttpClient },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const dto = plainToInstance(QueryFilterDto, { limit: 5 });

  // ─── getEvents (lecture Redis) ───────────────────────────────────────────

  describe('getEvents', () => {
    it('returns empty when Redis is empty', async () => {
      mockRedisService.get.mockResolvedValue(null);
      const result = await service.getEvents(dto);
      expect(result).toEqual({ total: 0, events: [] });
    });

    it('returns all events when no filter', async () => {
      const event = makeEvent();
      mockRedisService.get.mockResolvedValue([event]);
      const result = await service.getEvents(dto);
      expect(result.total).toBe(1);
      expect(result.events[0]).toEqual(event);
    });

    it('filters by tag', async () => {
      const concert = makeEvent({ id: '1', tags: ['Concert'] });
      const expo = makeEvent({ id: '2', tags: ['Expo'] });
      mockRedisService.get.mockResolvedValue([concert, expo]);

      const dtoWithTag = plainToInstance(QueryFilterDto, { tags: ['Concert'] });
      const result = await service.getEvents(dtoWithTag);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].id).toBe('1');
    });

    it('filters by free price', async () => {
      const free = makeEvent({ id: '1', priceType: 'free' });
      const paid = makeEvent({ id: '2', priceType: 'paid' });
      mockRedisService.get.mockResolvedValue([free, paid]);

      const dtoFree = plainToInstance(QueryFilterDto, { price: 'free' });
      const result = await service.getEvents(dtoFree);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].id).toBe('1');
    });

    it('filters by paid price', async () => {
      const free = makeEvent({ id: '1', priceType: 'free' });
      const paid = makeEvent({ id: '2', priceType: 'paid' });
      mockRedisService.get.mockResolvedValue([free, paid]);

      const dtoPaid = plainToInstance(QueryFilterDto, { price: 'paid' });
      const result = await service.getEvents(dtoPaid);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].id).toBe('2');
    });

    it('filters out past events', async () => {
      const past = makeEvent({ id: '1', dateStart: '2020-01-01T00:00:00+00:00' });
      const future = makeEvent({ id: '2', dateStart: '2099-01-01T00:00:00+00:00' });
      mockRedisService.get.mockResolvedValue([past, future]);

      const result = await service.getEvents(dto);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].id).toBe('2');
    });

    it('throws InternalServerErrorException when Redis throws', async () => {
      mockRedisService.get.mockRejectedValue(new Error('Redis error'));
      await expect(service.getEvents(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ─── fetchEventsByZone (appel API) ───────────────────────────────────────

  describe('fetchEventsByZone', () => {
    it('fetches, maps and returns events', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue({ total_count: 1, results: [mockRawEvent] });

      const events = await service.fetchEventsByZone(48.8566, 2.3522, 5, 'week');

      expect(events).toHaveLength(1);
      expect(events[0]?.id).toBe('1');
      expect(events[0]?.priceType).toBe('free');
      expect(events[0]?.tags).toEqual(['Concert']);
    });

    it('skips events with null coordinates', async () => {
      mockHttpClient.get.mockResolvedValue({
        total_count: 2,
        results: [mockRawEvent, { ...mockRawEvent, id: '2', lat_lon: null }],
      });

      const events = await service.fetchEventsByZone(48.8566, 2.3522, 5, 'week');
      expect(events).toHaveLength(1);
    });

    it('skips events with 0,0 coordinates', async () => {
      mockHttpClient.get.mockResolvedValue({
        total_count: 2,
        results: [mockRawEvent, { ...mockRawEvent, id: '2', lat_lon: { lat: 0, lon: 0 } }],
      });

      const events = await service.fetchEventsByZone(48.8566, 2.3522, 5, 'week');
      expect(events).toHaveLength(1);
    });

    it('geocodes when source returns Paris default coordinate', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get
        .mockResolvedValueOnce({
          total_count: 1,
          results: [{ ...mockRawEvent, lat_lon: { lat: 48.856578, lon: 2.351828 } }],
        })
        .mockResolvedValueOnce({
          features: [{ geometry: { coordinates: [2.295, 48.8738] } }],
        });

      const events = await service.fetchEventsByZone(48.8566, 2.3522, 5, 'week');
      expect(events[0]?.location).toEqual({ lat: 48.8738, lng: 2.295 });
    });

    it('maps paid event correctly', async () => {
      mockHttpClient.get.mockResolvedValue({
        total_count: 1,
        results: [{ ...mockRawEvent, price_type: 'payant', qfap_tags: null }],
      });

      const events = await service.fetchEventsByZone(48.8566, 2.3522, 5, 'week');
      expect(events[0]?.priceType).toBe('paid');
      expect(events[0]?.tags).toEqual([]);
    });

    it('returns empty array when API response is invalid', async () => {
      mockHttpClient.get.mockResolvedValue({ invalid: true });
      const events = await service.fetchEventsByZone(48.8566, 2.3522, 5, 'week');
      expect(events).toEqual([]);
    });
  });

  // ─── canHandle ───────────────────────────────────────────────────────────

  describe('canHandle', () => {
    it('returns true when no tags', () => {
      expect(service.canHandle(plainToInstance(QueryFilterDto, {}))).toBe(true);
    });

    it('returns true when at least one tag is supported', () => {
      const d = plainToInstance(QueryFilterDto, { tags: ['Concert'] });
      expect(service.canHandle(d)).toBe(true);
    });

    it('returns false when no tag is supported', () => {
      const d = plainToInstance(QueryFilterDto, { tags: ['Vélib'] });
      expect(service.canHandle(d)).toBe(false);
    });
  });
});
