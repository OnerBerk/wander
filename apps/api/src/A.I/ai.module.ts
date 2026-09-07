import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
