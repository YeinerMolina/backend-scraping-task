import { Injectable } from '@nestjs/common';
import { Browser } from 'puppeteer';
import { BrowserManagerService } from 'src/shared/browser-manager/browser-manager.service';
import { PageScraperService } from 'src/shared/page-scraper/app/page-scraper.service';
import { BookDto } from 'src/shared/page-scraper/domain/book.dto';
import { IScrapingResult } from '../domain/book-scraper.interface';

@Injectable()
export class BookScraperService {
  constructor(
    private readonly browserManager: BrowserManagerService,
    private readonly pageScraper: PageScraperService,
  ) {}

  private readonly pageUrl: string = 'https://books.toscrape.com/';

  public async initializeScraping(): Promise<IScrapingResult> {
    const browser = await this.browserManager.launch();
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);

      await page.goto(this.pageUrl, { waitUntil: 'networkidle2' });

      const bookUrls = await this.pageScraper.scrapeBookUrls(page);
      await page.close();

      return await this.scrapeBookDetailsInChunks(browser, bookUrls);
    } finally {
      await this.browserManager.close();
    }
  }

  private async scrapeBookDetailsInChunks(
    browser: Browser,
    urls: string[],
  ): Promise<IScrapingResult> {
    const chunkSize = 5;
    const allAccepted: BookDto[] = [];
    const allRejected: string[] = [];

    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize);

      const { accepted, rejected } = await Promise.allSettled(
        chunk.map(async (url) => {
          const page = await browser.newPage();
          try {
            return await this.pageScraper.scrapeBookDetail(page, url);
          } finally {
            await page.close();
          }
        }),
      ).then((resp) => this.handleResponse(resp));
      allRejected.push(...rejected);
      allAccepted.push(...accepted);
    }
    return {
      accepted: allAccepted,
      rejected: Array.from(new Set(allRejected).values()),
    };
  }

  private handleResponse(
    data: PromiseSettledResult<BookDto>[],
  ): IScrapingResult {
    const accepted: BookDto[] = [];
    const rejected: Set<string> = new Set();

    for (const result of data) {
      if (result.status === 'fulfilled') {
        accepted.push(result.value);
      } else {
        const reason = result.reason?.message || String(result.reason);
        rejected.add(reason);
      }
    }
    return {
      accepted,
      rejected: Array.from(rejected),
    };
  }
}
