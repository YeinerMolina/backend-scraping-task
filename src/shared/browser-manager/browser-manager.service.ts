import { Injectable } from '@nestjs/common';
import { Browser, launch } from 'puppeteer';

@Injectable()
export class BrowserManagerService {
  private browser: Browser | null = null;

  async launch(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }
    this.browser = await launch({
      args: ['--no-sandbox'],
      headless: 'shell',
    });
    return this.browser;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
