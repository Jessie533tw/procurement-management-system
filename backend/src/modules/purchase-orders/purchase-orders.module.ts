import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders.service';
import { 
  PurchaseOrder, 
  PurchaseOrderItem, 
  ProjectProgress,
  Project,
  Vendor,
  Material,
  FinancialRecord
} from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([
    PurchaseOrder, 
    PurchaseOrderItem, 
    ProjectProgress,
    Project,
    Vendor,
    Material,
    FinancialRecord
  ])],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}