import { Test, TestingModule } from '@nestjs/testing';
import { BookScraperService } from '../app/book-scraper.service';
import { BrowserManagerService } from '../../shared/browser-manager/browser-manager.service';
import { PageScraperService } from '../../shared/page-scraper/app/page-scraper.service';
import { BooksService } from '../../books/app/books.service';
import { ConfigService } from '@nestjs/config';
import { Browser, Page } from 'puppeteer';

describe('BookScraperService', () => {
  let service: BookScraperService;
  let browserManagerService: BrowserManagerService;
  let pageScraperService: PageScraperService;
  let booksService: BooksService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookScraperService,
        {
          provide: BrowserManagerService,
          useValue: {
            launch: jest.fn(),
            close: jest.fn(),
          },
        },
        {
          provide: PageScraperService,
          useValue: {
            scrapeBookUrls: jest.fn(),
            scrapeBookDetail: jest.fn(),
            scrapeCategories: jest.fn(),
          },
        },
        {
          provide: BooksService,
          useValue: {
            createOrUpdateByTitle: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookScraperService>(BookScraperService);
    browserManagerService = module.get<BrowserManagerService>(BrowserManagerService);
    pageScraperService = module.get<PageScraperService>(PageScraperService);
    booksService = module.get<BooksService>(BooksService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBooks', () => {
    it('should scrape and save books', async () => {
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          setDefaultNavigationTimeout: jest.fn(),
          close: jest.fn(),
        } as unknown as Page),
      } as unknown as Browser;

      jest.spyOn(browserManagerService, 'launch').mockResolvedValue(mockBrowser);
      jest.spyOn(pageScraperService, 'scrapeBookUrls').mockResolvedValue(['url1', 'url2']);
      jest.spyOn(pageScraperService, 'scrapeBookDetail').mockResolvedValue({} as any);
      jest.spyOn(configService, 'getOrThrow').mockReturnValue(1);
      jest.spyOn(booksService, 'createOrUpdateByTitle').mockResolvedValue({} as any);

      const result = await service.getBooks();
      expect(result).toBeDefined();
      expect(browserManagerService.launch).toHaveBeenCalled();
      expect(pageScraperService.scrapeBookUrls).toHaveBeenCalled();
      expect(booksService.createOrUpdateByTitle).toHaveBeenCalledTimes(2);
      expect(browserManagerService.close).toHaveBeenCalled();
    });

    it('should handle rejected book details scraping', async () => {
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          setDefaultNavigationTimeout: jest.fn(),
          close: jest.fn(),
        } as unknown as Page),
      } as unknown as Browser;

      jest.spyOn(browserManagerService, 'launch').mockResolvedValue(mockBrowser);
      jest.spyOn(pageScraperService, 'scrapeBookUrls').mockResolvedValue(['url1']);
      jest.spyOn(pageScraperService, 'scrapeBookDetail').mockRejectedValue(new Error('Scraping failed'));
      jest.spyOn(configService, 'getOrThrow').mockReturnValue(1);

      const result = await service.getBooks();
      expect(result.rejected).toEqual(['Scraping failed']);
      expect(browserManagerService.launch).toHaveBeenCalled();
      expect(pageScraperService.scrapeBookUrls).toHaveBeenCalled();
      expect(browserManagerService.close).toHaveBeenCalled();
    });

    it('should handle rejected book details scraping with undefined message', async () => {
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          setDefaultNavigationTimeout: jest.fn(),
          close: jest.fn(),
        } as unknown as Page),
      } as unknown as Browser;

      jest.spyOn(browserManagerService, 'launch').mockResolvedValue(mockBrowser);
      jest.spyOn(pageScraperService, 'scrapeBookUrls').mockResolvedValue(['url1']);
      jest.spyOn(pageScraperService, 'scrapeBookDetail').mockRejectedValue({ reason: undefined });
      jest.spyOn(configService, 'getOrThrow').mockReturnValue(1);

      const result = await service.getBooks();
      expect(result.rejected).toEqual(['[object Object]']);
      expect(browserManagerService.launch).toHaveBeenCalled();
      expect(pageScraperService.scrapeBookUrls).toHaveBeenCalled();
      expect(browserManagerService.close).toHaveBeenCalled();
    });
  });

  describe('getCategories', () => {
    it('should scrape categories', async () => {
      const mockBrowser = {
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          close: jest.fn(),
        } as unknown as Page),
      } as unknown as Browser;

      jest.spyOn(browserManagerService, 'launch').mockResolvedValue(mockBrowser);
      jest.spyOn(pageScraperService, 'scrapeCategories').mockResolvedValue(['category1', 'category2']);

      const result = await service.getCategories();
      expect(result).toEqual(['category1', 'category2']);
      expect(browserManagerService.launch).toHaveBeenCalled();
      expect(pageScraperService.scrapeCategories).toHaveBeenCalled();
      expect(browserManagerService.close).toHaveBeenCalled();
    });
  });
});
