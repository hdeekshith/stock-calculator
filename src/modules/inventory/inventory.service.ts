import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TRANSACTION_TYPE } from '../../common/constant';
import { Messages } from '../../common/messages';
import { TransactionService } from '../transaction/transaction.service';
import { StockService } from '../stock/stock.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly stockService: StockService,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * Calculate and returns the current stock qty left for a given SKU based on stock and transactions data
   * @param sku The SKU id whose stock level needs to be calculated
   * @returns <{ sku: string, qty: number }>
   */
  async getCurrentStockLevel(
    sku: string,
  ): Promise<{ sku: string; qty: number }> {
    try {
      const stockData = await this.stockService.loadStockData();

      const transactionsData =
        await this.transactionService.loadTransactionData();

      let isValidSku = true;
      const originalStock = stockData.find((data) => data.sku === sku);

      //TODO: Replace console logs with winston logger
      console.log('Original Stock', originalStock);

      if (!originalStock) {
        isValidSku = false;
      }

      let transactionQuantity = 0;

      for (let i = 0; i < transactionsData.length; i++) {
        const { sku: transactionSku, type, qty } = transactionsData[i];

        if (type && qty && transactionSku === sku) {
          isValidSku = true;

          switch (type) {
            case TRANSACTION_TYPE.ORDER:
              transactionQuantity += qty;
              break;
            case TRANSACTION_TYPE.REFUND:
              transactionQuantity -= qty;
              break;
            default:
              console.warn(`Unhandled transaction type found ${type}`);
          }
        }
      }

      //If SKU data is not found in both stock and transactions data then it means sku is invalid
      if (!isValidSku) {
        console.warn(`Invalid SKU passed ${sku}`);
        throw new BadRequestException(Messages.INVALID_SKU);
      }
      console.log(
        `Total Transaction Quantity is ${transactionQuantity} for sku ${sku}`,
      );

      const finalQuantity = (originalStock?.stock || 0) - transactionQuantity;

      console.log(`FinalQuantity of stock is ${finalQuantity} for sku ${sku}`);

      return {
        sku,
        qty: finalQuantity,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(Messages.TRY_LATER);
    }
  }
}
