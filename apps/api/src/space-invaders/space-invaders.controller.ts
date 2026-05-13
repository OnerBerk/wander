import {Controller, Get} from '@nestjs/common';
import {SpaceInvadersService} from './space-invaders.service';
import {InvadersOverpassElement} from '@wander/types';

@Controller('space-invaders')
export class SpaceInvadersController {
  constructor(private readonly spaceInvadersService: SpaceInvadersService) {}

  @Get()
  async getSpaceInvaders(): Promise<InvadersOverpassElement[]> {
    console.log('getSpaceInvaders');
    return this.spaceInvadersService.getSpaceInvaders();
  }
}
