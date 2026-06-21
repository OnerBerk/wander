import { Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('run')
  async run() {
    await this.ingestionService.runIngestion();
    return { ok: true };
  }
}
