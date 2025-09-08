import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, InquiryResponse, PurchaseOrder } from '../../entities';
import { CreateVendorDto, UpdateVendorDto } from './dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(InquiryResponse)
    private inquiryResponseRepository: Repository<InquiryResponse>,
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendorCode = await this.generateVendorCode();
    
    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      vendorCode,
    });

    return this.vendorRepository.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.find({
      relations: ['inquiryResponses', 'purchaseOrders'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['inquiryResponses', 'purchaseOrders'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID "${id}" not found`);
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async remove(id: string): Promise<void> {
    const vendor = await this.findOne(id);
    
    // 檢查是否有關聯的採購單
    const purchaseOrderCount = await this.purchaseOrderRepository.count({
      where: { vendorId: id }
    });

    if (purchaseOrderCount > 0) {
      throw new Error('Cannot delete vendor with existing purchase orders');
    }

    await this.vendorRepository.remove(vendor);
  }

  async getPerformanceAnalysis(vendorId?: string) {
    let query = this.purchaseOrderRepository
      .createQueryBuilder('po')
      .leftJoin('po.vendor', 'vendor')
      .leftJoin('po.project', 'project')
      .select([
        'vendor.id',
        'vendor.name',
        'COUNT(po.id) as totalOrders',
        'SUM(po.totalAmount) as totalValue',
        'AVG(po.totalAmount) as avgOrderValue',
        'COUNT(CASE WHEN po.actualDeliveryDate <= po.expectedDeliveryDate THEN 1 END) as onTimeDeliveries',
        'COUNT(CASE WHEN po.actualDeliveryDate > po.expectedDeliveryDate THEN 1 END) as lateDeliveries',
      ])
      .where('po.status IN (:...statuses)', { 
        statuses: ['delivered', 'completed'] 
      })
      .groupBy('vendor.id, vendor.name');

    if (vendorId) {
      query = query.andWhere('vendor.id = :vendorId', { vendorId });
    }

    const results = await query.getRawMany();

    return results.map(result => {
      const totalDeliveries = parseInt(result.onTimeDeliveries) + parseInt(result.lateDeliveries);
      const onTimeRate = totalDeliveries > 0 
        ? ((parseInt(result.onTimeDeliveries) / totalDeliveries) * 100).toFixed(2)
        : '0';

      return {
        ...result,
        onTimeRate: `${onTimeRate}%`,
        totalDeliveries,
      };
    });
  }

  async getVendorsBySpecialty(specialty: string): Promise<Vendor[]> {
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.specialties @> :specialty', { specialty: `["${specialty}"]` })
      .andWhere('vendor.status = :status', { status: 'active' })
      .getMany();
  }

  async updateRating(vendorId: string, rating: number): Promise<Vendor> {
    const vendor = await this.findOne(vendorId);
    
    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    vendor.rating = rating;
    return this.vendorRepository.save(vendor);
  }

  async getTopVendors(limit: number = 10) {
    return this.vendorRepository.find({
      where: { status: 'active' },
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  private async generateVendorCode(): Promise<string> {
    const today = new Date();
    const prefix = `V${today.getFullYear()}`;
    
    const lastVendor = await this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.vendorCode LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('vendor.vendorCode', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastVendor) {
      const lastSequence = parseInt(lastVendor.vendorCode.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }
}