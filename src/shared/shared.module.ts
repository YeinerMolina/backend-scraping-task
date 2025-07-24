
import { Module } from '@nestjs/common';
import { BrowserManagerService } from './browser-manager/browser-manager.service';
import { PageScraperService } from './page-scraper/app/page-scraper.service';

@Module({
  providers: [BrowserManagerService, PageScraperService],
  exports: [BrowserManagerService, PageScraperService],
})
export class SharedModule {}
