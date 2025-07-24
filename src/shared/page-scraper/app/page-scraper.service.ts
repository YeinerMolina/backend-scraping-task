import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { BookDto } from '../domain/book.dto';

@Injectable()
export class PageScraperService {
  public async scrapeBookUrls(page: Page): Promise<string[]> {
    return page.$$eval(
      'ol.row li article.product_pod',
      (items) =>
        items
          .map(
            (item) =>
              (item.querySelector('h3 a') as HTMLAnchorElement | undefined)
                ?.href,
          )
          .filter(Boolean) as string[],
    );
  }

  public async scrapeBookDetail(page: Page, url: string): Promise<BookDto> {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    return page.evaluate(() => {
      const title = document.querySelector('h1')?.textContent?.trim() || '';
      const price =
        document.querySelector('.price_color')?.textContent?.trim() || '';
      const availability =
        document
          .querySelector('.availability')
          ?.textContent?.trim()
          .replace(/\s+/g, ' ') || '';

      const ratingClass =
        document.querySelector('.star-rating')?.classList || [];
      const rating =
        Array.from(ratingClass).find((cls) =>
          ['One', 'Two', 'Three', 'Four', 'Five'].includes(cls),
        ) || '';
      const ratingNumber =
        {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          fve: 5,
        }[rating.toLowerCase()] ?? 0;
      const description =
        document
          .querySelector('#product_description + p')
          ?.textContent?.trim() || '';

      const imagePath =
        document.querySelector('#product_gallery img')?.getAttribute('src') ||
        '';
      const imageUrl = new URL(imagePath, window.location.origin).href;

      const category =
        document
          .querySelectorAll('.breadcrumb li a')?.[2]
          ?.textContent?.trim() || '';

      const infoRows = Array.from(document.querySelectorAll('table.table tr'));
      const productInfo: Record<string, string> = {};
      for (const row of infoRows) {
        const key = row.querySelector('th')?.textContent?.trim() || '';
        const value = row.querySelector('td')?.textContent?.trim() || '';
        if (key) productInfo[key] = value;
      }

      return {
        title,
        price,
        availability,
        rating,
        ratingNumber,
        category,
        description,
        imageUrl,
        productInfo,
      };
    });
  }
}
