import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { InquiryResponse } from './inquiry-response.entity';
import { InquiryItem } from './inquiry-item.entity';

@Entity('inquiry_response_items')
export class InquiryResponseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  responseId: string;

  @ManyToOne(() => InquiryResponse, response => response.items)
  @JoinColumn({ name: 'responseId' })
  response: InquiryResponse;

  @Column('uuid')
  inquiryItemId: string;

  @ManyToOne(() => InquiryItem, inquiryItem => inquiryItem.responseItems)
  @JoinColumn({ name: 'inquiryItemId' })
  inquiryItem: InquiryItem;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ type: 'int', nullable: true })
  deliveryDays: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}