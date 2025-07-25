import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { BookDto } from '../domain/book.dto';

@Injectable()
export class PageScraperService {
  public async scrapeBookUrls(page: Page, limit: number): Promise<string[]> {
    const urls: string[] = [];

    while (true) {
      const pageUrls = await page.$$eval('ol.row li article.product_pod h3 a', anchors =>
        anchors.map(a => (a as HTMLAnchorElement).href)
      );

      urls.push(...pageUrls);

      if (urls.length >= limit) break;

      const nextLink = await page.$('ul.pager li.next a');
      if (!nextLink) break;

      await Promise.all([nextLink.click(), page.waitForNavigation({ waitUntil: 'networkidle0' })]);
    }

    return urls.slice(0, limit);
  }

  public async scrapeBookDetail(page: Page, url: string): Promise<BookDto> {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    return page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const price = document.querySelector('.price_color')?.textContent?.trim() || '';
      const availability = document.querySelector('.availability')?.textContent?.trim().replace(/\s+/g, ' ') || '';

      const ratingClass = document.querySelector('.star-rating')?.classList || [];
      const rating = Array.from(ratingClass).find(cls => ['One', 'Two', 'Three', 'Four', 'Five'].includes(cls)) || '';
      const ratingNumber =
        {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          fve: 5,
        }[rating.toLowerCase()] ?? 0;
      const description = document.querySelector('#product_description + p')?.textContent?.trim() || '';

      const imagePath = document.querySelector('#product_gallery img')?.getAttribute('src') || '';
      const imageUrl = new URL(imagePath, window.location.origin).href;

      const category = document.querySelectorAll('.breadcrumb li a')?.[2]?.textContent?.trim() || '';

      const priceNumber = parseFloat(price.replace(/[^0-9.]/g, ''));

      return {
        title,
        price,
        priceNumber,
        availability,
        rating,
        ratingNumber,
        category,
        description,
        imageUrl,
      };
    });
  }
}
