import { IsNotEmpty, IsString } from 'class-validator';

export class GetStockLevelDTO {
  @IsString()
  @IsNotEmpty()
  public sku: string;
}
