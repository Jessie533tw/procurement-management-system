import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  PurchaseOrder, 
  PurchaseOrderItem, 
  ProjectProgress,
  Project,
  FinancialRecord
} from '../../entities';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(ProjectProgress)
    private progressRepository: Repository<ProjectProgress>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(FinancialRecord)
    private financialRecordRepository: Repository<FinancialRecord>,
  ) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const orderNumber = await this.generateOrderNumber();
    
    const purchaseOrder = this.purchaseOrderRepository.create({
      ...createPurchaseOrderDto,
      orderNumber,
    });
    
    const savedOrder = await this.purchaseOrderRepository.save(purchaseOrder);

    // 建立採購項目
    if (createPurchaseOrderDto.items && createPurchaseOrderDto.items.length > 0) {
      const items = createPurchaseOrderDto.items.map(item => 
        this.purchaseOrderItemRepository.create({
          ...item,
          purchaseOrderId: savedOrder.id,
        })
      );
      await this.purchaseOrderItemRepository.save(items);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.find({
      relations: ['project', 'vendor', 'items', 'items.material'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['project', 'vendor', 'items', 'items.material', 'progressRecords'],
    });

    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase Order with ID "${id}" not found`);
    }

    return purchaseOrder;
  }

  async update(id: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    Object.assign(purchaseOrder, updatePurchaseOrderDto);
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async approve(id: string, approvedBy: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    
    if (purchaseOrder.status !== 'draft') {
      throw new Error('Only draft purchase orders can be approved');
    }

    purchaseOrder.status = 'approved';
    purchaseOrder.approvedBy = approvedBy;
    purchaseOrder.approvedAt = new Date();

    const savedOrder = await this.purchaseOrderRepository.save(purchaseOrder);

    // 自動扣減專案預算
    await this.updateProjectBudget(purchaseOrder.projectId, purchaseOrder.totalAmount);

    // 建立財務記錄
    await this.createFinancialRecord(savedOrder);

    // 自動建立進度追蹤記錄
    await this.createProgressRecord(savedOrder);

    return savedOrder;
  }

  async updateStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);
    purchaseOrder.status = status;

    // 如果是交貨完成，記錄實際交貨日期
    if (status === 'delivered') {
      purchaseOrder.actualDeliveryDate = new Date();
    }

    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async getDeliveryStatus(): Promise<any[]> {
    const orders = await this.purchaseOrderRepository.find({
      where: { status: 'confirmed' },
      relations: ['project', 'vendor'],
      select: ['id', 'orderNumber', 'expectedDeliveryDate', 'actualDeliveryDate', 'totalAmount'],
    });

    return orders.map(order => {
      const isDelayed = new Date() > new Date(order.expectedDeliveryDate);
      const daysDelayed = isDelayed 
        ? Math.ceil((new Date().getTime() - new Date(order.expectedDeliveryDate).getTime()) / (1000 * 3600 * 24))
        : 0;

      return {
        ...order,
        isDelayed,
        daysDelayed,
        status: isDelayed ? 'delayed' : 'on_time',
      };
    });
  }

  async getCostAnalysis(projectId?: string) {
    let query = this.purchaseOrderRepository
      .createQueryBuilder('po')
      .leftJoin('po.project', 'project')
      .leftJoin('po.vendor', 'vendor')
      .leftJoin('po.items', 'items')
      .leftJoin('items.material', 'material')
      .select([
        'project.name',
        'material.category',
        'SUM(items.totalPrice) as totalCost',
        'COUNT(po.id) as orderCount',
        'AVG(items.unitPrice) as avgUnitPrice'
      ])
      .where('po.status IN (:...statuses)', { statuses: ['approved', 'sent', 'confirmed', 'delivered', 'completed'] })
      .groupBy('project.id, material.category');

    if (projectId) {
      query = query.andWhere('po.projectId = :projectId', { projectId });
    }

    return query.getRawMany();
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const prefix = `PO${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const lastOrder = await this.purchaseOrderRepository
      .createQueryBuilder('po')
      .where('po.orderNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('po.orderNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }

  private async updateProjectBudget(projectId: string, amount: number): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId }
    });

    if (project) {
      project.usedBudget = Number(project.usedBudget) + amount;
      await this.projectRepository.save(project);
    }
  }

  private async createFinancialRecord(purchaseOrder: PurchaseOrder): Promise<void> {
    const voucherNumber = await this.generateVoucherNumber();
    
    const financialRecord = this.financialRecordRepository.create({
      voucherNumber,
      projectId: purchaseOrder.projectId,
      purchaseOrderId: purchaseOrder.id,
      recordType: 'accrual',
      recordDate: new Date(),
      amount: purchaseOrder.totalAmount,
      accountCode: '5000',
      accountName: '材料成本',
      description: `採購單 ${purchaseOrder.orderNumber} - ${purchaseOrder.vendor?.name}`,
      vendorName: purchaseOrder.vendor?.name,
      createdBy: purchaseOrder.createdBy,
    });

    await this.financialRecordRepository.save(financialRecord);
  }

  private async createProgressRecord(purchaseOrder: PurchaseOrder): Promise<void> {
    const progress = this.progressRepository.create({
      projectId: purchaseOrder.projectId,
      purchaseOrderId: purchaseOrder.id,
      taskName: `採購交貨 - ${purchaseOrder.orderNumber}`,
      description: `等待供應商 ${purchaseOrder.vendor?.name} 交貨`,
      plannedStartDate: new Date(),
      plannedEndDate: purchaseOrder.expectedDeliveryDate,
      status: 'not_started',
      responsiblePerson: purchaseOrder.createdBy,
    });

    await this.progressRepository.save(progress);
  }

  private async generateVoucherNumber(): Promise<string> {
    const today = new Date();
    const prefix = `V${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const lastVoucher = await this.financialRecordRepository
      .createQueryBuilder('fr')
      .where('fr.voucherNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('fr.voucherNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastVoucher) {
      const lastSequence = parseInt(lastVoucher.voucherNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }
}