import { Controller, Get, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { GetStockLevelDTO } from './dto/get-stock-level.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getStockLevel(@Query() query: GetStockLevelDTO) {
    const { sku } = query;
    return this.inventoryService.getCurrentStockLevel(sku);
  }
}
