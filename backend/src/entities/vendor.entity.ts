import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InquiryResponse } from './inquiry-response.entity';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true })
  vendorCode: string;

  @Column({ length: 20, nullable: true })
  taxId: string;

  @Column({ length: 100 })
  contactPerson: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ type: 'json', nullable: true })
  specialties: string[];

  @Column({ type: 'enum', enum: ['active', 'inactive', 'blacklisted'], default: 'active' })
  status: 'active' | 'inactive' | 'blacklisted';

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @OneToMany(() => InquiryResponse, response => response.vendor)
  inquiryResponses: InquiryResponse[];

  @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.vendor)
  purchaseOrders: PurchaseOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}