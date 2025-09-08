import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  Inquiry, 
  InquiryItem, 
  InquiryResponse, 
  InquiryResponseItem,
  Vendor 
} from '../../entities';
import { CreateInquiryDto, CreateInquiryResponseDto } from './dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    @InjectRepository(InquiryItem)
    private inquiryItemRepository: Repository<InquiryItem>,
    @InjectRepository(InquiryResponse)
    private responseRepository: Repository<InquiryResponse>,
    @InjectRepository(InquiryResponseItem)
    private responseItemRepository: Repository<InquiryResponseItem>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const inquiryNumber = await this.generateInquiryNumber();
    
    const inquiry = this.inquiryRepository.create({
      ...createInquiryDto,
      inquiryNumber,
    });
    
    const savedInquiry = await this.inquiryRepository.save(inquiry);

    // 建立詢價項目
    if (createInquiryDto.items && createInquiryDto.items.length > 0) {
      const items = createInquiryDto.items.map(item => 
        this.inquiryItemRepository.create({
          ...item,
          inquiryId: savedInquiry.id,
        })
      );
      await this.inquiryItemRepository.save(items);
    }

    return this.findOne(savedInquiry.id);
  }

  async findAll(): Promise<Inquiry[]> {
    return this.inquiryRepository.find({
      relations: ['project', 'items', 'items.material', 'responses', 'responses.vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Inquiry> {
    const inquiry = await this.inquiryRepository.findOne({
      where: { id },
      relations: ['project', 'items', 'items.material', 'responses', 'responses.vendor', 'responses.items'],
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry with ID "${id}" not found`);
    }

    return inquiry;
  }

  async addResponse(inquiryId: string, createResponseDto: CreateInquiryResponseDto): Promise<InquiryResponse | null> {
    const inquiry = await this.findOne(inquiryId);
    
    // 檢查供應商是否已經回覆過
    const existingResponse = await this.responseRepository.findOne({
      where: { inquiryId, vendorId: createResponseDto.vendorId },
    });

    if (existingResponse) {
      throw new Error('Vendor has already responded to this inquiry');
    }

    const response = this.responseRepository.create({
      ...createResponseDto,
      inquiryId,
    });
    
    const savedResponse = await this.responseRepository.save(response);

    // 建立回應項目
    if (createResponseDto.items && createResponseDto.items.length > 0) {
      const responseItems = createResponseDto.items.map(item => 
        this.responseItemRepository.create({
          ...item,
          responseId: savedResponse.id,
        })
      );
      await this.responseItemRepository.save(responseItems);
    }

    // 更新詢價狀態
    if (inquiry.status === 'sent') {
      inquiry.status = 'responded';
      await this.inquiryRepository.save(inquiry);
    }

    return await this.responseRepository.findOne({
      where: { id: savedResponse.id },
      relations: ['vendor', 'items', 'items.inquiryItem'],
    });
  }

  async getComparison(inquiryId: string) {
    const inquiry = await this.findOne(inquiryId);
    
    const comparison = {
      inquiry: {
        id: inquiry.id,
        inquiryNumber: inquiry.inquiryNumber,
        title: inquiry.title,
        project: inquiry.project.name,
      },
      items: [] as Array<{
        material: string;
        quantity: number;
        unit: string;
        responses: { [key: string]: any };
      }>,
      vendors: [] as Array<{
        name: string;
        totalAmount: number;
        paymentTerms: string;
        deliveryDays: number;
        evaluationScore: number;
      }>,
      summary: {},
    };

    // 整理比較表格
    inquiry.items.forEach(item => {
      const itemComparison = {
        material: item.material.name,
        quantity: item.quantity,
        unit: item.unit,
        responses: {},
      };

      inquiry.responses.forEach(response => {
        const responseItem = response.items.find(ri => ri.inquiryItemId === item.id);
        itemComparison.responses[response.vendor.name] = {
          unitPrice: responseItem?.unitPrice || null,
          totalPrice: responseItem?.totalPrice || null,
          deliveryDays: responseItem?.deliveryDays || null,
          isAvailable: responseItem?.isAvailable || false,
        };
      });

      comparison.items.push(itemComparison);
    });

    // 供應商總價比較
    inquiry.responses.forEach(response => {
      comparison.vendors.push({
        name: response.vendor.name,
        totalAmount: response.totalAmount,
        paymentTerms: response.paymentTerms,
        deliveryDays: response.deliveryDays,
        evaluationScore: response.evaluationScore,
      });
    });

    return comparison;
  }

  async updateResponseStatus(responseId: string, status: 'accepted' | 'rejected'): Promise<InquiryResponse> {
    const response = await this.responseRepository.findOne({
      where: { id: responseId },
    });

    if (!response) {
      throw new NotFoundException(`Response with ID "${responseId}" not found`);
    }

    response.status = status;
    return this.responseRepository.save(response);
  }

  private async generateInquiryNumber(): Promise<string> {
    const today = new Date();
    const prefix = `INQ${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const lastInquiry = await this.inquiryRepository
      .createQueryBuilder('inquiry')
      .where('inquiry.inquiryNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('inquiry.inquiryNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastInquiry) {
      const lastSequence = parseInt(lastInquiry.inquiryNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }
}