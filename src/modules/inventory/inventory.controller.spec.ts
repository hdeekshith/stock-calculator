import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { StockService } from '../stock/stock.service';
import { TransactionService } from '../transaction/transaction.service';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [InventoryService, StockService, TransactionService],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined - InventoryController', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined - InventoryService', () => {
    expect(service).toBeDefined();
  });

  describe('GET - getStockLevel', () => {
    it('it should return proper response', async () => {
      const mockResponse = { sku: 'VYM838980/39/17', qty: 10 };
      jest
        .spyOn(service, 'getCurrentStockLevel')
        .mockImplementation(async (sku: string) => {
          return { ...mockResponse, sku };
        });
      const inputSku = 'VYM838980/39/17';
      const response = await controller.getStockLevel({ sku: inputSku });
      expect(response.sku).toBeDefined();
      expect(response.qty).toBeDefined();
      expect(service.getCurrentStockLevel).toHaveBeenCalled();
      expect(service.getCurrentStockLevel).toHaveBeenCalledWith(inputSku);
    });
  });
});
