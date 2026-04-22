import {InternalServerErrorException} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {ParisEventsService} from '../paris-events.service';
import {RedisService} from '../../redis/redis.service';
import {HttpClientService} from '../../http-client/http-client.service';
import {EventData} from '@wander/types';
import {setupUnitTest} from '../../test-utils/setup-unit-test';
import {QueryFilterDto} from '../../filters/dtos/query-filter.dto';

const mockEventData: EventData = {
  id: '1',
  title: 'Test Event',
  leadText: 'Test lead text',
  dateStart: '2026-04-22T20:00:00+00:00',
  dateEnd: '2026-04-22T23:00:00+00:00',
  occurrences: null,
  location: {lat: 48.8566, lng: 2.3522},
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
};

const mockRawEvent = {
  id: '1',
  url: 'https://www.paris.fr/evenements/test',
  title: 'Test Event',
  lead_text: 'Test lead text',
  date_start: '2026-04-22T20:00:00+00:00',
  date_end: '2026-04-22T23:00:00+00:00',
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
  lat_lon: {lat: 48.8566, lon: 2.3522},
  audience: 'Tout public.',
  event_indoor: 1,
  event_pets_allowed: 0,
  contact_url: null,
  contact_phone: null,
  access_type: null,
  access_link: null,
};

const mockApiResponse = {
  total_count: 1,
  results: [mockRawEvent],
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockHttpClient = {
  get: jest.fn(),
};

describe('ParisEventsService', () => {
  let service: ParisEventsService;

  beforeAll(async () => {
    service = await setupUnitTest(ParisEventsService, [
      {provide: RedisService, useValue: mockRedisService},
      {provide: HttpClientService, useValue: mockHttpClient},
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const dto = plainToInstance(QueryFilterDto, {limit: 5, offset: 0});

  describe('cache hit', () => {
    it('returns cached data without calling API', async () => {
      mockRedisService.get.mockResolvedValue({total: 1, events: [mockEventData]});

      const result = await service.getEvents(dto);

      expect(result).toEqual({total: 1, events: [mockEventData]});
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('cache miss', () => {
    it('calls API, maps response and caches result', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockApiResponse);

      const result = await service.getEvents(dto);

      expect(result.total).toBe(1);
      expect(result.events).toHaveLength(1);
      expect(result.events[0]).toEqual(mockEventData);
      expect(mockRedisService.set).toHaveBeenCalledTimes(1);
    });

    it('filters out events with null coordinates', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue({
        total_count: 2,
        results: [mockRawEvent, {...mockRawEvent, lat_lon: null}],
      });

      const result = await service.getEvents(dto);

      expect(result.events).toHaveLength(1);
    });

    it('filters out events with 0,0 coordinates', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue({
        total_count: 2,
        results: [mockRawEvent, {...mockRawEvent, lat_lon: {lat: 0, lon: 0}}],
      });

      const result = await service.getEvents(dto);

      expect(result.events).toHaveLength(1);
    });

    it('maps paid event correctly', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue({
        total_count: 1,
        results: [{...mockRawEvent, price_type: 'payant', qfap_tags: null}],
      });

      const result = await service.getEvents(dto);

      expect(result.events[0].priceType).toBe('paid');
      expect(result.events[0].tags).toEqual([]);
    });

    it('maps null price_type correctly', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue({
        total_count: 1,
        results: [{...mockRawEvent, price_type: null}],
      });

      const result = await service.getEvents(dto);

      expect(result.events[0].priceType).toBeNull();
    });
  });

  describe('filters', () => {
    it('calls API with tag filter', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockApiResponse);

      const dtoWithFilter = plainToInstance(QueryFilterDto, {filter: 'tag:Concert', limit: 5});
      await service.getEvents(dtoWithFilter);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('Concert'));
    });

    it('calls API with free price filter', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockApiResponse);

      const dtoWithFilter = plainToInstance(QueryFilterDto, {filter: 'price:free', limit: 5});
      await service.getEvents(dtoWithFilter);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('gratuit'));
    });

    it('calls API with paid price filter', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockApiResponse);

      const dtoWithFilter = plainToInstance(QueryFilterDto, {filter: 'price:paid', limit: 5});
      await service.getEvents(dtoWithFilter);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('payant'));
    });

    it('calls API with city filter', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockApiResponse);

      const dtoWithFilter = plainToInstance(QueryFilterDto, {filter: 'city:Paris', limit: 5});
      await service.getEvents(dtoWithFilter);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('Paris'));
    });
  });

  describe('error', () => {
    it('throws InternalServerErrorException when API fails', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getEvents(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
