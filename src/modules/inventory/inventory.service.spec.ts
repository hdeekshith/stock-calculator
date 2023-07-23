import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { StockService } from '../stock/stock.service';
import { TransactionService } from '../transaction/transaction.service';
import { BadRequestException } from '@nestjs/common';
import { Messages } from '../../common/messages';

class StockServiceMock {
  async loadStockData() {
    const loadStockMockResponse = [
      { sku: 'CLQ274846/07/46', stock: 8414 },
      { sku: 'SXB930757/87/87', stock: 3552 },
      { sku: 'PGL751486/42/83', stock: 1512 },
      { sku: 'TVN783304/18/16', stock: 1484 },
    ];
    return loadStockMockResponse;
  }
}

class TransactionServiceMock {
  async loadTransactionData() {
    const loadTransactionMockResponse = [
      { sku: 'CLQ274846/07/46', type: 'order', qty: 8400 },
      { sku: 'SXB930757/87/87', type: 'order', qty: 3552 },
      { sku: 'CLQ274846/07/46', type: 'refund', qty: 100 },
      { sku: 'CLQ274846/07/46', type: 'order', qty: 14 },
      { sku: 'TVN783304/18/16', type: 'refund', qty: 16 },
    ];
    return loadTransactionMockResponse;
  }
}

describe('InventoryService', () => {
  const StockServiceProvider = {
    provide: StockService,
    useClass: StockServiceMock,
  };

  const TransactionServiceProvider = {
    provide: TransactionService,
    useClass: TransactionServiceMock,
  };

  let service: InventoryService;
  let stockService: StockService;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        StockServiceProvider,
        TransactionServiceProvider,
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    stockService = module.get<StockService>(StockService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined - InventoryService', () => {
    expect(service).toBeDefined();
  });

  it('should be defined - StockService', () => {
    expect(stockService).toBeDefined();
  });

  it('should be defined - TransactionService', () => {
    expect(transactionService).toBeDefined();
  });

  describe('getCurrentStockLevel', () => {
    it('it should throw bad request error when sku does not exist in both transactions and stocks list', async () => {
      jest.spyOn(stockService, 'loadStockData');
      jest.spyOn(transactionService, 'loadTransactionData');

      const inputSku = 'VYM838980/39/17';

      await expect(async () => {
        return await service.getCurrentStockLevel(inputSku);
      }).rejects.toThrow(new BadRequestException(Messages.INVALID_SKU));

      expect(stockService.loadStockData).toHaveBeenCalled();
      expect(transactionService.loadTransactionData).toHaveBeenCalled();
    });

    it('it should return 0 quantity when all stock levels are ordered in transactions', async () => {
      jest.spyOn(stockService, 'loadStockData');
      jest.spyOn(transactionService, 'loadTransactionData');
      const inputSku = 'SXB930757/87/87';

      const response = await service.getCurrentStockLevel(inputSku);
      expect(response.sku).toBeDefined();
      expect(response.qty).toBeDefined();
      expect(response.qty).toBe(0);
      expect(response.sku).toBe(inputSku);
      expect(stockService.loadStockData).toHaveBeenCalled();
      expect(transactionService.loadTransactionData).toHaveBeenCalled();
    });

    it('it should return decrement stock quantity when transaction type is order for sku', async () => {
      jest.spyOn(stockService, 'loadStockData');
      jest.spyOn(transactionService, 'loadTransactionData');
      const inputSku = 'SXB930757/87/87';

      const originalStock = (await stockService.loadStockData()).find(
        (data) => data.sku === inputSku,
      );
      const response = await service.getCurrentStockLevel(inputSku);
      expect(response.sku).toBeDefined();
      expect(response.qty).toBeDefined();
      expect(response.qty).toBeLessThan(originalStock.stock);
      expect(response.sku).toBe(inputSku);
      expect(stockService.loadStockData).toHaveBeenCalled();
      expect(transactionService.loadTransactionData).toHaveBeenCalled();
    });

    it('it should return increment stock quantity when transaction type is refund for sku', async () => {
      jest.spyOn(stockService, 'loadStockData');
      jest.spyOn(transactionService, 'loadTransactionData');
      const inputSku = 'TVN783304/18/16';

      const originalStock = (await stockService.loadStockData()).find(
        (data) => data.sku === inputSku,
      );
      const response = await service.getCurrentStockLevel(inputSku);
      expect(response.sku).toBeDefined();
      expect(response.qty).toBeDefined();
      expect(response.qty).toBeGreaterThan(originalStock.stock);
      expect(response.sku).toBe(inputSku);
      expect(stockService.loadStockData).toHaveBeenCalled();
      expect(transactionService.loadTransactionData).toHaveBeenCalled();
    });

    it('it should return postive quanity (100)', async () => {
      jest.spyOn(stockService, 'loadStockData');
      jest.spyOn(transactionService, 'loadTransactionData');
      const inputSku = 'CLQ274846/07/46';

      const response = await service.getCurrentStockLevel(inputSku);
      expect(response.sku).toBeDefined();
      expect(response.qty).toBeDefined();
      expect(response.qty).toEqual(100);
      expect(response.sku).toBe(inputSku);
      expect(stockService.loadStockData).toHaveBeenCalled();
      expect(transactionService.loadTransactionData).toHaveBeenCalled();
    });

    it('it should return original quantity when there are no transactions for a particular sku', async () => {
      jest.spyOn(stockService, 'loadStockData');
      jest.spyOn(transactionService, 'loadTransactionData');
      const inputSku = 'PGL751486/42/83';

      const originalStock = (await stockService.loadStockData()).find(
        (data) => data.sku === inputSku,
      );

      const response = await service.getCurrentStockLevel(inputSku);
      expect(response.sku).toBeDefined();
      expect(response.qty).toBeDefined();
      expect(response.qty).toEqual(originalStock.stock);
      expect(response.sku).toBe(inputSku);
      expect(stockService.loadStockData).toHaveBeenCalled();
      expect(transactionService.loadTransactionData).toHaveBeenCalled();
    });
  });
});
