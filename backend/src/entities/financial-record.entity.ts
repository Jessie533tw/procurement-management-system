import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('financial_records')
export class FinancialRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  voucherNumber: string;

  @Column('uuid')
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('uuid', { nullable: true })
  purchaseOrderId: string;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @Column({ type: 'enum', enum: ['expense', 'payment', 'accrual', 'adjustment'] })
  recordType: 'expense' | 'payment' | 'accrual' | 'adjustment';

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 100 })
  accountCode: string;

  @Column({ length: 100 })
  accountName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 100, nullable: true })
  vendorName: string;

  @Column({ length: 50, nullable: true })
  invoiceNumber: string;

  @Column({ type: 'enum', enum: ['draft', 'approved', 'posted'], default: 'draft' })
  status: 'draft' | 'approved' | 'posted';

  @Column({ length: 100 })
  createdBy: string;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}