import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';
import { EventData } from '@wander/types';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAll(@Query() query: QueryFilterDto): Promise<EventData[]> {
    return this.eventsService.getAll(query);
  }
}
