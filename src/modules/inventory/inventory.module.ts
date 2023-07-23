import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TransactionService } from '../transaction/transaction.service';
import { StockService } from '../stock/stock.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, TransactionService, StockService],
})
export class InventoryModule {}
