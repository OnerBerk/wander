import {Controller, Get, Query} from '@nestjs/common';
import {ParisEventsService} from './paris-events.service';
import {QueryFilterDto} from '../filters/dtos/query-filter.dto';
import {EventData} from '@wander/types';

@Controller('paris-events')
export class ParisEventsController {
  constructor(private readonly parisEventsService: ParisEventsService) {}

  @Get()
  async getEvents(@Query() query: QueryFilterDto): Promise<{total: number; events: EventData[]}> {
    return this.parisEventsService.getEvents(query);
  }
}
