import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { 
  Inquiry, 
  InquiryItem, 
  InquiryResponse, 
  InquiryResponseItem,
  Vendor,
  Material 
} from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([
    Inquiry, 
    InquiryItem, 
    InquiryResponse, 
    InquiryResponseItem,
    Vendor,
    Material
  ])],
  controllers: [InquiriesController],
  providers: [InquiriesService],
  exports: [InquiriesService],
})
export class InquiriesModule {}