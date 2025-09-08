import { IsString, IsEmail, IsOptional, IsArray, IsEnum, IsNumber, Max, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVendorDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  taxId?: string;

  @IsString()
  @Length(1, 100)
  contactPerson: string;

  @IsString()
  @Length(1, 20)
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @IsEnum(['active', 'inactive', 'blacklisted'])
  @IsOptional()
  status?: 'active' | 'inactive' | 'blacklisted';

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  @Type(() => Number)
  rating?: number;
}