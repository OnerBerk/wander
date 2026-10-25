import 'reflect-metadata';
import { EventData } from '@wander/types';
import { RedisService } from '../../redis/redis.service';
import { EventsCatalogService } from '../../paris-events/events-catalog.service';
import { setupUnitTest } from '../../test-utils/setup-unit-test';
import { SitemapService } from '../sitemap.service';

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

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
};

const mockEventsCatalog = {
  getAll: jest.fn(),
};

describe('SitemapService', () => {
  let service: SitemapService;

  beforeAll(async () => {
    service = await setupUnitTest(SitemapService, [
      { provide: RedisService, useValue: mockRedisService },
      { provide: EventsCatalogService, useValue: mockEventsCatalog },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the cached xml', async () => {
    const cached = '<urlset></urlset>';
    mockRedisService.get.mockResolvedValue(cached);

    await expect(service.getSitemap()).resolves.toBe(cached);
    expect(mockRedisService.get).toHaveBeenCalledWith('sitemap:xml');
    expect(mockRedisService.set).not.toHaveBeenCalled();
    expect(mockEventsCatalog.getAll).not.toHaveBeenCalled();
  });

  it('builds an event url without lastmod and caches it', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockEventsCatalog.getAll.mockResolvedValue([mockEvent]);

    const xml = await service.getSitemap();

    expect(xml).toContain('https://www.wandercity.fr/event/concert/test/1');
    expect(xml).not.toContain('lastmod');
    expect(mockRedisService.set).toHaveBeenCalledWith('sitemap:xml', xml, 12 * 60 * 60);
  });
});
