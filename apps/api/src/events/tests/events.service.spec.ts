import 'reflect-metadata';
import {plainToInstance} from 'class-transformer';
import {EventsService} from '../events.service';
import {ParisEventsService} from '../../paris-events/paris-events.service';
import {setupUnitTest} from '../../test-utils/setup-unit-test';
import {QueryFilterDto} from '../../filters/dtos/query-filter.dto';
import {EventData} from '@wander/types';

const mockEvent: EventData = {
  id: '1',
  title: 'Test',
  leadText: '',
  dateStart: '',
  dateEnd: '',
  occurrences: null,
  location: {lat: 48.8566, lng: 2.3522},
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
describe('EventsService', () => {
  let service: EventsService;

  beforeAll(async () => {
    service = await setupUnitTest(EventsService, [{provide: ParisEventsService, useValue: mockParisEventsService}]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const dto = plainToInstance(QueryFilterDto, {lat: 48.8566, lng: 2.3522, radius: 5});

  it('returns aggregated events from all sources', async () => {
    mockParisEventsService.getEvents.mockResolvedValue({total: 1, events: [mockEvent]});

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
});
