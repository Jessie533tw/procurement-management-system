import { IsString, IsDateString, IsOptional, IsArray, ValidateNested, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInquiryItemDto {
  @IsUUID()
  materialId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  specifications?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  requiredDate?: string;
}

export class CreateInquiryDto {
  @IsUUID()
  projectId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  requirements?: Record<string, any>;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInquiryItemDto)
  items?: CreateInquiryItemDto[];
}