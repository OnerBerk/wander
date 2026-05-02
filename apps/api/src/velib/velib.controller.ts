import {Controller, Get, Query} from '@nestjs/common';
import {VelibService} from './velib.service';
import {GeoDto} from '../common-dtos/geo.dto';
import {VelibStation} from '@wander/types';

@Controller('velib')
export class VelibController {
  constructor(private readonly velibService: VelibService) {}

  @Get()
  async getStations(@Query() query: GeoDto): Promise<VelibStation[]> {
    return this.velibService.getStations(query);
  }
}
