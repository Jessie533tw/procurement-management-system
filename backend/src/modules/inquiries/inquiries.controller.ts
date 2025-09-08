import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto, CreateInquiryResponseDto } from './dto';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Get(':id/comparison')
  getComparison(@Param('id', ParseUUIDPipe) id: string) {
    return this.inquiriesService.getComparison(id);
  }

  @Post(':id/responses')
  addResponse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createResponseDto: CreateInquiryResponseDto,
  ) {
    return this.inquiriesService.addResponse(id, createResponseDto);
  }

  @Patch('responses/:responseId/status')
  updateResponseStatus(
    @Param('responseId', ParseUUIDPipe) responseId: string,
    @Body('status') status: 'accepted' | 'rejected',
  ) {
    return this.inquiriesService.updateResponseStatus(responseId, status);
  }
}