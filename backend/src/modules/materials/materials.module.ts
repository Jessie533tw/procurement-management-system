import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';
import { Material, InquiryItem, PurchaseOrderItem } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Material, InquiryItem, PurchaseOrderItem])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}