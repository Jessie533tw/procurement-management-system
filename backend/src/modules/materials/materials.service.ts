import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material, PurchaseOrderItem } from '../../entities';
import { CreateMaterialDto, UpdateMaterialDto } from './dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const materialCode = await this.generateMaterialCode(createMaterialDto.category);
    
    const material = this.materialRepository.create({
      ...createMaterialDto,
      materialCode,
    });

    return this.materialRepository.save(material);
  }

  async findAll(): Promise<Material[]> {
    return this.materialRepository.find({
      where: { isActive: true },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findByCategory(category: string): Promise<Material[]> {
    return this.materialRepository.find({
      where: { category, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['inquiryItems', 'purchaseOrderItems'],
    });

    if (!material) {
      throw new NotFoundException(`Material with ID "${id}" not found`);
    }

    return material;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<Material> {
    const material = await this.findOne(id);
    Object.assign(material, updateMaterialDto);
    return this.materialRepository.save(material);
  }

  async deactivate(id: string): Promise<Material> {
    const material = await this.findOne(id);
    material.isActive = false;
    return this.materialRepository.save(material);
  }

  async getCategories(): Promise<string[]> {
    const results = await this.materialRepository
      .createQueryBuilder('material')
      .select('DISTINCT material.category', 'category')
      .where('material.isActive = true')
      .orderBy('material.category', 'ASC')
      .getRawMany();

    return results.map(result => result.category);
  }

  async getPriceHistory(materialId: string) {
    return this.purchaseOrderItemRepository
      .createQueryBuilder('poi')
      .leftJoin('poi.purchaseOrder', 'po')
      .leftJoin('po.vendor', 'vendor')
      .where('poi.materialId = :materialId', { materialId })
      .andWhere('po.status IN (:...statuses)', { 
        statuses: ['confirmed', 'delivered', 'completed'] 
      })
      .select([
        'poi.unitPrice',
        'poi.quantity',
        'po.orderDate',
        'vendor.name as vendorName',
      ])
      .orderBy('po.orderDate', 'DESC')
      .limit(20)
      .getRawMany();
  }

  async getUsageAnalysis(materialId?: string) {
    let query = this.purchaseOrderItemRepository
      .createQueryBuilder('poi')
      .leftJoin('poi.material', 'material')
      .leftJoin('poi.purchaseOrder', 'po')
      .leftJoin('po.project', 'project')
      .select([
        'material.name',
        'material.category',
        'material.unit',
        'SUM(poi.quantity) as totalQuantity',
        'SUM(poi.totalPrice) as totalCost',
        'AVG(poi.unitPrice) as avgUnitPrice',
        'COUNT(DISTINCT po.id) as orderCount',
        'COUNT(DISTINCT project.id) as projectCount',
      ])
      .where('po.status IN (:...statuses)', { 
        statuses: ['confirmed', 'delivered', 'completed'] 
      })
      .groupBy('material.id, material.name, material.category, material.unit');

    if (materialId) {
      query = query.andWhere('material.id = :materialId', { materialId });
    }

    return query.getRawMany();
  }

  async getTopMaterials(limit: number = 10) {
    return this.purchaseOrderItemRepository
      .createQueryBuilder('poi')
      .leftJoin('poi.material', 'material')
      .leftJoin('poi.purchaseOrder', 'po')
      .select([
        'material.name',
        'material.category',
        'SUM(poi.totalPrice) as totalValue',
        'SUM(poi.quantity) as totalQuantity',
      ])
      .where('po.status IN (:...statuses)', { 
        statuses: ['confirmed', 'delivered', 'completed'] 
      })
      .groupBy('material.id, material.name, material.category')
      .orderBy('totalValue', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async searchMaterials(searchTerm: string): Promise<Material[]> {
    return this.materialRepository
      .createQueryBuilder('material')
      .where('material.isActive = true')
      .andWhere('(material.name ILIKE :search OR material.description ILIKE :search OR material.materialCode ILIKE :search)', {
        search: `%${searchTerm}%`
      })
      .orderBy('material.name', 'ASC')
      .getMany();
  }

  private async generateMaterialCode(category: string): Promise<string> {
    const categoryPrefix = this.getCategoryPrefix(category);
    const today = new Date();
    const yearSuffix = today.getFullYear().toString().slice(-2);
    
    const lastMaterial = await this.materialRepository
      .createQueryBuilder('material')
      .where('material.materialCode LIKE :prefix', { prefix: `${categoryPrefix}${yearSuffix}%` })
      .orderBy('material.materialCode', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastMaterial) {
      const lastSequence = parseInt(lastMaterial.materialCode.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${categoryPrefix}${yearSuffix}${String(sequence).padStart(4, '0')}`;
  }

  private getCategoryPrefix(category: string): string {
    const prefixMap = {
      '鋼筋': 'STL',
      '混凝土': 'CON',
      '磚塊': 'BRK',
      '木材': 'WOD',
      '鋁材': 'ALU',
      '管材': 'PIP',
      '電線': 'WIR',
      '五金': 'HRW',
      '油漆': 'PNT',
      '防水材': 'WPF',
      '保溫材': 'INS',
      '玻璃': 'GLS',
    };

    return prefixMap[category] || 'MAT';
  }
}