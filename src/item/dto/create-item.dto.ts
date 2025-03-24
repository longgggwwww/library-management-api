import { InventoryItemStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  barcode: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  publicationId?: number;

  @IsEnum(InventoryItemStatus)
  status: InventoryItemStatus;

  @IsOptional()
  @IsInt()
  shelfId?: number;

  @IsOptional()
  @IsInt()
  rackId?: number;

  @IsOptional()
  @IsInt()
  inventoryId?: number;
}
