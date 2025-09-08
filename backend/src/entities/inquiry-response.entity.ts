import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Inquiry } from './inquiry.entity';
import { Vendor } from './vendor.entity';
import { InquiryResponseItem } from './inquiry-response-item.entity';

@Entity('inquiry_responses')
export class InquiryResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  inquiryId: string;

  @ManyToOne(() => Inquiry, inquiry => inquiry.responses)
  @JoinColumn({ name: 'inquiryId' })
  inquiry: Inquiry;

  @Column('uuid')
  vendorId: string;

  @ManyToOne(() => Vendor, vendor => vendor.inquiryResponses)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column({ type: 'date' })
  responseDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ type: 'int', nullable: true })
  deliveryDays: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'enum', enum: ['submitted', 'under_review', 'accepted', 'rejected'], default: 'submitted' })
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  evaluationScore: number;

  @Column({ type: 'text', nullable: true })
  evaluationNotes: string;

  @OneToMany(() => InquiryResponseItem, responseItem => responseItem.response)
  items: InquiryResponseItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}