import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { QueryFilterDto } from '../filters/dtos/query-filter.dto';
import { EventIdDto } from './dtos/event-id-param.dto';
import { EventData } from '@wander/types';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAll(@Query() query: QueryFilterDto): Promise<EventData[]> {
    return this.eventsService.getAll(query);
  }

  @Get(':id')
  async getOne(@Param() params: EventIdDto): Promise<EventData | null> {
    return this.eventsService.getOne(params.id);
  }
}
