import { Injectable } from '@nestjs/common';
import { TransactionData } from './types';
import { readFile } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TransactionService {
  constructor() {
    //Run this initially on server start so that existence/validation of file is checked well before the api is executed
    this.loadTransactionData();
  }
  /**
   * Load Transactions data from the transactions JSON file
   * @returns <TransactionData[]>
   */
  async loadTransactionData(): Promise<TransactionData[]> {
    try {
      return JSON.parse(
        await readFile(
          path.join(__dirname, '..', '..', '/data-store/transactions.json'),
          'utf8',
        ),
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON format defined in the file', error);
        throw error;
      }
      console.error('loadTransactionData error', error);
      throw error;
    }
  }
}
