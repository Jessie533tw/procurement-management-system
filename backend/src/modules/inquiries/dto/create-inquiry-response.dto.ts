import { IsString, IsDateString, IsOptional, IsArray, ValidateNested, IsUUID, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInquiryResponseItemDto {
  @IsUUID()
  inquiryItemId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  unitPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalPrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class CreateInquiryResponseDto {
  @IsUUID()
  vendorId: string;

  @IsDateString()
  responseDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalAmount: number;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deliveryDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInquiryResponseItemDto)
  items?: CreateInquiryResponseItemDto[];
}