import {Test} from '@nestjs/testing';
import axios, {AxiosError} from 'axios';
import {HttpClientService} from '../http-client.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClientService', () => {
  let service: HttpClientService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [HttpClientService],
    }).compile();

    service = module.get<HttpClientService>(HttpClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns data on success', async () => {
      mockedAxios.get.mockResolvedValue({data: {foo: 'bar'}});
      const result = await service.get<{foo: string}>('https://api.test.com');
      expect(result).toEqual({foo: 'bar'});
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.test.com');
    });

    it('throws External API error on AxiosError', async () => {
      const axiosError = new AxiosError('Network Error');
      mockedAxios.get.mockRejectedValue(axiosError);

      await expect(service.get('https://api.test.com')).rejects.toThrow('External API error:');
    });

    it('rethrows non-Axios errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Unknown error'));

      await expect(service.get('https://api.test.com')).rejects.toThrow('Unknown error');
    });
  });
});
