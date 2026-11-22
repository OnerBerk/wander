import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { EventsService } from '../events.service';
import { ParisEventsService } from '../../paris-events/paris-events.service';
import { EventsCatalogService } from '../../paris-events/events-catalog.service';
import { setupUnitTest } from '../../test-utils/setup-unit-test';
import { QueryFilterDto } from '../../filters/dtos/query-filter.dto';
import { EventData } from '@wander/types';

const mockEvent: EventData = {
  id: '1',
  title: 'Test',
  leadText: '',
  description: null,
  dateStart: '',
  dateEnd: '',
  occurrences: null,
  location: { lat: 48.8566, lng: 2.3522 },
  coverUrl: null,
  coverAlt: null,
  priceType: 'free',
  priceDetail: null,
  tags: ['Concert'],
  url: '',
  addressName: '',
  addressStreet: '',
  addressZipcode: '',
  addressCity: '',
  audience: null,
  isIndoor: true,
  petsAllowed: false,
  contactUrl: null,
  contactPhone: null,
  accessType: null,
  accessLink: null,
};

const mockParisEventsService = {
  getEvents: jest.fn(),
  canHandle: jest.fn().mockReturnValue(true),
};

const mockEventsCatalog = {
  getById: jest.fn(),
  getAll: jest.fn(),
};

describe('EventsService', () => {
  let service: EventsService;

  beforeAll(async () => {
    service = await setupUnitTest(EventsService, [
      { provide: ParisEventsService, useValue: mockParisEventsService },
      { provide: EventsCatalogService, useValue: mockEventsCatalog },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const dto = plainToInstance(QueryFilterDto, { lat: 48.8566, lng: 2.3522, radius: 5 });

  it('returns aggregated events from all sources', async () => {
    mockParisEventsService.getEvents.mockResolvedValue({ total: 1, events: [mockEvent] });

    const result = await service.getAll(dto);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockEvent);
  });

  it('returns empty array when source fails', async () => {
    mockParisEventsService.getEvents.mockRejectedValue(new Error('API error'));

    const result = await service.getAll(dto);

    expect(result).toEqual([]);
  });

  it('continues when one source fails (resilient)', async () => {
    mockParisEventsService.getEvents.mockRejectedValue(new Error('API error'));

    const result = await service.getAll(dto);

    expect(result).toEqual([]);
  });

  describe('getOne', () => {
    it('returns null when the catalog has no match', async () => {
      mockEventsCatalog.getById.mockResolvedValue(null);

      await expect(service.getOne('1')).resolves.toBeNull();
      expect(mockEventsCatalog.getById).toHaveBeenCalledWith('1');
    });

    it('returns the event when id is found', async () => {
      mockEventsCatalog.getById.mockResolvedValue(mockEvent);

      await expect(service.getOne('1')).resolves.toEqual(mockEvent);
    });
  });

  describe('getRelated', () => {
    const makeEvent = (id: string, tags: EventData['tags']): EventData => ({
      ...mockEvent,
      id,
      title: `Event ${id}`,
      tags,
    });

    it('returns empty array when target event is not found', async () => {
      mockEventsCatalog.getById.mockResolvedValue(null);

      await expect(service.getRelated('missing')).resolves.toEqual([]);
      expect(mockEventsCatalog.getAll).not.toHaveBeenCalled();
    });

    it('prioritizes events sharing a tag, excludes self, and caps at 6', async () => {
      const target = makeEvent('1', ['Concert']);
      const catalog = [
        target,
        makeEvent('2', ['Expo']),
        makeEvent('3', ['Concert']),
        makeEvent('4', ['Concert', 'Festival']),
        makeEvent('5', ['Théâtre']),
        makeEvent('6', ['Concert']),
        makeEvent('7', ['Concert']),
        makeEvent('8', ['Concert']),
        makeEvent('9', ['Concert']),
        makeEvent('10', ['Concert']),
      ];
      mockEventsCatalog.getById.mockResolvedValue(target);
      mockEventsCatalog.getAll.mockResolvedValue(catalog);

      const related = await service.getRelated('1');

      expect(related.map((e) => e.id)).toEqual(['3', '4', '6', '7', '8', '9']);
    });

    it('fills remaining slots with fallback events when fewer than 6 share a tag', async () => {
      const target = makeEvent('1', ['Concert']);
      const catalog = [target, makeEvent('2', ['Expo']), makeEvent('3', ['Concert']), makeEvent('4', ['Théâtre'])];
      mockEventsCatalog.getById.mockResolvedValue(target);
      mockEventsCatalog.getAll.mockResolvedValue(catalog);

      const related = await service.getRelated('1');

      expect(related.map((e) => e.id)).toEqual(['3', '2', '4']);
    });
  });
});
