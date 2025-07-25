import { Test, TestingModule } from '@nestjs/testing';
import { BrowserManagerService } from '../browser-manager/browser-manager.service';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer', () => ({
  launch: jest.fn(() => ({
    close: jest.fn(),
  })),
}));

describe('BrowserManagerService', () => {
  let service: BrowserManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrowserManagerService],
    }).compile();

    service = module.get<BrowserManagerService>(BrowserManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should launch a browser', async () => {
    const browser = await service.launch();
    expect(puppeteer.launch).toHaveBeenCalled();
    expect(browser).toBeDefined();
  });

  it('should close the browser', async () => {
    const browser = await service.launch();
    await service.close();
    expect(browser.close).toHaveBeenCalled();
  });
});
