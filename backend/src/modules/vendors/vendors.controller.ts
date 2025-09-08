import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto, UpdateVendorDto } from './dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get('performance-analysis')
  getPerformanceAnalysis(@Query('vendorId') vendorId?: string) {
    return this.vendorsService.getPerformanceAnalysis(vendorId);
  }

  @Get('by-specialty')
  getVendorsBySpecialty(@Query('specialty') specialty: string) {
    return this.vendorsService.getVendorsBySpecialty(specialty);
  }

  @Get('top-vendors')
  getTopVendors(@Query('limit', ParseIntPipe) limit?: number) {
    return this.vendorsService.getTopVendors(limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Patch(':id/rating')
  updateRating(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('rating', ParseFloatPipe) rating: number,
  ) {
    return this.vendorsService.updateRating(id, rating);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorsService.remove(id);
  }
}