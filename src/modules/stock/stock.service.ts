import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { StockData } from './types';
import * as path from 'path';

@Injectable()
export class StockService {
  constructor() {
    //Run this initially on server start so that existence/validation of file is checked well before the api is executed
    this.loadStockData();
  }
  /**
   * Load Stock data from the stock JSON file
   * @returns <StockData[]>
   */
  async loadStockData(): Promise<StockData[]> {
    try {
      return JSON.parse(
        await readFile(
          path.join(__dirname, '..', '..', '/data-store/stock.json'),
          'utf8',
        ),
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON format defined in the file', error);
        throw error;
      }
      console.error('loadStockData error', error);
      throw error;
    }
  }
}
