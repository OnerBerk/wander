import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiToolsService } from './ai-tools.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [AiController],
  providers: [AiService, AiToolsService],
})
export class AiModule {}
