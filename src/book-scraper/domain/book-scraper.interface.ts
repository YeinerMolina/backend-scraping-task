import { BookDto } from "src/shared/page-scraper/domain/book.dto";

export interface IScrapingResult {
    accepted: BookDto[];
    rejected: string[];
}
