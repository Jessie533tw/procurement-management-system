import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor, InquiryResponse, PurchaseOrder } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, InquiryResponse, PurchaseOrder])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}