import { IsString, IsNumber, IsOptional, IsBoolean, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMaterialDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @Length(1, 20)
  unit: string;

  @IsString()
  @Length(1, 50)
  category: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  subcategory?: string;

  @IsOptional()
  specifications?: Record<string, any>;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  estimatedPrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}