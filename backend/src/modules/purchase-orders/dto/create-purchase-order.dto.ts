import { IsString, IsDateString, IsOptional, IsArray, ValidateNested, IsUUID, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseOrderItemDto {
  @IsUUID()
  materialId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsString()
  unit: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  unitPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalPrice: number;

  @IsOptional()
  @IsString()
  specifications?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePurchaseOrderDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  vendorId: string;

  @IsDateString()
  orderDate: string;

  @IsDateString()
  expectedDeliveryDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsEnum(['draft', 'approved', 'sent', 'confirmed', 'delivered', 'completed', 'cancelled'])
  @IsOptional()
  status?: 'draft' | 'approved' | 'sent' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  items?: CreatePurchaseOrderItemDto[];
}