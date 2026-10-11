import { Controller, Get, Header } from '@nestjs/common';
import { SitemapService } from './sitemap.service';

@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  getSitemap(): Promise<string> {
    return this.sitemapService.getSitemap();
  }
}
