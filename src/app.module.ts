import { Module } from '@nestjs/common';
import { StockService } from './modules/stock/stock.service';
import { TransactionService } from './modules/transaction/transaction.service';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [],
  providers: [StockService, TransactionService],
})
export class AppModule {}
