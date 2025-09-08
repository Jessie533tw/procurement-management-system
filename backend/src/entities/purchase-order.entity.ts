import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { Vendor } from './vendor.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { ProjectProgress } from './project-progress.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  orderNumber: string;

  @Column('uuid')
  projectId: string;

  @ManyToOne(() => Project, project => project.purchaseOrders)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('uuid')
  vendorId: string;

  @ManyToOne(() => Vendor, vendor => vendor.purchaseOrders)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column({ type: 'date' })
  orderDate: Date;

  @Column({ type: 'date' })
  expectedDeliveryDate: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ type: 'enum', enum: ['draft', 'approved', 'sent', 'confirmed', 'delivered', 'completed', 'cancelled'], default: 'draft' })
  status: 'draft' | 'approved' | 'sent' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 100 })
  createdBy: string;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @OneToMany(() => PurchaseOrderItem, item => item.purchaseOrder)
  items: PurchaseOrderItem[];

  @OneToMany(() => ProjectProgress, progress => progress.purchaseOrder)
  progressRecords: ProjectProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}