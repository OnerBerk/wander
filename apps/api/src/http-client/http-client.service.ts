import {Injectable, Logger} from '@nestjs/common';
import axios, {AxiosError} from 'axios';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  async get<T>(url: string): Promise<T> {
    try {
      this.logger.log(`🌍 GET ${url}`);
      const {data} = await axios.get<T>(url);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`❌ GET ${url} failed — ${error.message}`);
        throw new Error(`External API error: ${error.message}`);
      }
      throw error;
    }
  }
}
