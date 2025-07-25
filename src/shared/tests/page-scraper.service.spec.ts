import { Test, TestingModule } from '@nestjs/testing';
import { PageScraperService } from '../page-scraper/app/page-scraper.service';
import { Page } from 'puppeteer';

describe('PageScraperService', () => {
  let service: PageScraperService;
  let mockPage: Partial<Page>;

  beforeEach(async () => {
    mockPage = {
      goto: jest.fn(),
      $eval: jest.fn(),
      $$eval: jest.fn(),
      $: jest.fn(),
      waitForNavigation: jest.fn(),
      evaluate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PageScraperService],
    }).compile();

    service = module.get<PageScraperService>(PageScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapeBookUrls', () => {
    it('should scrape book URLs up to the limit', async () => {
      (mockPage.$eval as jest.Mock).mockResolvedValueOnce(['url1', 'url2', 'url3']);
      (mockPage.$ as jest.Mock).mockResolvedValueOnce({ click: jest.fn() });
      (mockPage.$$eval as jest.Mock).mockResolvedValueOnce(['url4', 'url5']);
      (mockPage.$ as jest.Mock).mockResolvedValueOnce(null);

      const urls = await service.scrapeBookUrls(mockPage as Page, 4);
      expect(urls).toEqual(['url1', 'url2', 'url3', 'url4']);
      expect(mockPage.$eval).toHaveBeenCalledTimes(2);
      expect(mockPage.$).toHaveBeenCalledTimes(1);
    });

    it('should handle no next link', async () => {
      (mockPage.$$eval as jest.Mock).mockResolvedValueOnce(['url1']);
      (mockPage.$ as jest.Mock).mockResolvedValueOnce(null);

      const urls = await service.scrapeBookUrls(mockPage as Page, 5);
      expect(urls).toEqual(['url1']);
      expect(mockPage.$$eval).toHaveBeenCalledTimes(1);
      expect(mockPage.$).toHaveBeenCalledTimes(1);
    });
  });

  describe('scrapeBookDetail', () => {
    it('should scrape book details', async () => {
      (mockPage.evaluate as jest.Mock).mockResolvedValue({
        title: 'Test Title',
        price: '£10.00',
        availability: 'In stock (10 available)',
        rating: 'Two',
        ratingNumber: 2,
        description: 'Some description',
        imageUrl: 'http://example.com/media/cache/2c/da/2cdad67c44b002ae7a0c12eb465f0534.jpg',
        category: 'Travel',
      });

      const detail = await service.scrapeBookDetail(mockPage as Page, 'http://example.com/book');
      expect(detail).toEqual({
        title: 'Test Title',
        price: '£10.00',
        availability: 'In stock (10 available)',
        rating: 'Two',
        ratingNumber: 2,
        description: 'Some description',
        imageUrl: 'http://example.com/media/cache/2c/da/2cdad67c44b002ae7a0c12eb465f0534.jpg',
        category: 'Travel',
      });
      expect(mockPage.goto).toHaveBeenCalledWith('http://example.com/book', { waitUntil: 'domcontentloaded' });
      expect(mockPage.evaluate).toHaveBeenCalled();
    });
  });

  describe('scrapeCategories', () => {
    it('should scrape categories', async () => {
      (mockPage.evaluate as jest.Mock).mockResolvedValue(['Category 1', 'Category 2']);

      const categories = await service.scrapeCategories(mockPage as Page);
      expect(categories).toEqual(['Category 1', 'Category 2']);
      expect(mockPage.evaluate).toHaveBeenCalled();
    });
  });
});
