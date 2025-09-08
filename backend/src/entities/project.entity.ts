import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Inquiry } from './inquiry.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { ProjectBudget } from './project-budget.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  projectCode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalBudget: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  usedBudget: number;

  @Column({ type: 'enum', enum: ['planning', 'active', 'completed', 'cancelled'], default: 'planning' })
  status: 'planning' | 'active' | 'completed' | 'cancelled';

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ length: 100 })
  projectManager: string;

  @OneToMany(() => Inquiry, inquiry => inquiry.project)
  inquiries: Inquiry[];

  @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.project)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => ProjectBudget, budget => budget.project)
  budgets: ProjectBudget[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}