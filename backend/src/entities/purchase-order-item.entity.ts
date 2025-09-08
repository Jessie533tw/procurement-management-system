import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Material } from './material.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  purchaseOrderId: string;

  @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.items)
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @Column('uuid')
  materialId: string;

  @ManyToOne(() => Material, material => material.purchaseOrderItems)
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ length: 20 })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  receivedQuantity: number;

  @Column({ type: 'enum', enum: ['pending', 'partial', 'completed'], default: 'pending' })
  receivingStatus: 'pending' | 'partial' | 'completed';

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}