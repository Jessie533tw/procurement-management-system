import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InquiryItem } from './inquiry-item.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  materialCode: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20 })
  unit: string;

  @Column({ length: 50 })
  category: string;

  @Column({ length: 50, nullable: true })
  subcategory: string;

  @Column({ type: 'json', nullable: true })
  specifications: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => InquiryItem, inquiryItem => inquiryItem.material)
  inquiryItems: InquiryItem[];

  @OneToMany(() => PurchaseOrderItem, purchaseOrderItem => purchaseOrderItem.material)
  purchaseOrderItems: PurchaseOrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}