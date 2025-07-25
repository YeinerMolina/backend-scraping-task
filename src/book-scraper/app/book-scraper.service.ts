import { Injectable } from '@nestjs/common';
import { Browser, Page } from 'puppeteer';
import { BrowserManagerService } from '../../shared/browser-manager/browser-manager.service';
import { PageScraperService } from '../../shared/page-scraper/app/page-scraper.service';
import { BookDto } from '../../shared/page-scraper/domain/book.dto';
import { IScrapingResult } from '../domain/book-scraper.interface';
import { BooksService } from '../../books/app/books.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentKeys } from '../../shared/environment.keys';

@Injectable()
export class BookScraperService {
  constructor(
    private readonly browserManager: BrowserManagerService,
    private readonly pageScraper: PageScraperService,
    private readonly booksService: BooksService,
    private readonly configService: ConfigService
  ) {}

  private readonly pageUrl: string = 'https://books.toscrape.com/';

  public async getBooks(): Promise<IScrapingResult> {
    const books = await this.initializeScraping();
    await this.saveBooks(books.accepted);
    return books;
  }

  private async saveBooks(books: BookDto[]) {
    const requests = books.map(book => this.booksService.createOrUpdateByTitle(book));
    await Promise.all(requests);
  }

  private async initializeScraping() {
    const booksLimit = 25;
    const browser = await this.browserManager.launch();
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);

      await page.goto(this.pageUrl, { waitUntil: 'domcontentloaded' });
      const bookUrls = await this.pageScraper.scrapeBookUrls(page, booksLimit);
      await page.close();

      return await this.scrapeBookDetailsInChunks(browser, bookUrls);
    } finally {
      await this.browserManager.close();
    }
  }

  private async scrapeBookDetailsInChunks(browser: Browser, urls: string[]): Promise<IScrapingResult> {
    const chunkSize = this.configService.getOrThrow(EnvironmentKeys.SCRAPER_PARALEL_JOBS);
    const allAccepted: BookDto[] = [];
    const allRejected: string[] = [];

    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize);

      const { accepted, rejected } = await Promise.allSettled(
        chunk.map(async url => {
          let page: Page | null = null;

          try {
            page = await browser.newPage();
            return await this.pageScraper.scrapeBookDetail(page, url);
          } finally {
            if (page) await page.close();
          }
        })
      ).then(resp => this.handleResponse(resp));
      allRejected.push(...rejected);
      allAccepted.push(...accepted);
    }
    return {
      accepted: allAccepted,
      rejected: Array.from(new Set(allRejected).values()),
    };
  }

  private handleResponse(data: PromiseSettledResult<BookDto>[]): IScrapingResult {
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
