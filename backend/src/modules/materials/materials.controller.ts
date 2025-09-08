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
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto);
  }

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Get('categories')
  getCategories() {
    return this.materialsService.getCategories();
  }

  @Get('search')
  searchMaterials(@Query('q') searchTerm: string) {
    return this.materialsService.searchMaterials(searchTerm);
  }

  @Get('top-materials')
  getTopMaterials(@Query('limit', ParseIntPipe) limit?: number) {
    return this.materialsService.getTopMaterials(limit);
  }

  @Get('usage-analysis')
  getUsageAnalysis(@Query('materialId') materialId?: string) {
    return this.materialsService.getUsageAnalysis(materialId);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.materialsService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.materialsService.findOne(id);
  }

  @Get(':id/price-history')
  getPriceHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.materialsService.getPriceHistory(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialsService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.materialsService.deactivate(id);
  }
}