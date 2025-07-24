import { Injectable } from '@nestjs/common';
import { launch } from 'puppeteer';

@Injectable()
export class BookScraperService {
  private readonly pageUrl: string = 'https://books.toscrape.com/';

  public async initializeScraping() {
    const browser = await launch({
      args: ['--no-sandbox'],
      executablePath: undefined,
      headless: 'shell',
    });
    try {
      console.log('on browser');
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);
      await Promise.all([page.waitForNavigation(), page.goto(this.pageUrl)]);
      return page.$$eval('ol.row li article.product_pod', (items) => {
        console.log(items);
        return items.map((item) => ({
          title: item.querySelector('h3 a')?.textContent,
          imageUrl: item.querySelector('img')?.src,
          price: item.querySelector('div.product_price p.price_color')
            ?.textContent,
          stock: item.querySelector('div.product_price p.availability')
            ?.textContent,
          category: 'unknown',
          rating: item.querySelector('p.star-rating')?.classList,
        }));
      });
    } finally {
      await browser.close();
    }
  }
}
