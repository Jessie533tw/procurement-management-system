import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('project_progress')
export class ProjectProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column('uuid', { nullable: true })
  purchaseOrderId: string;

  @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.progressRecords)
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @Column({ length: 100 })
  taskName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  plannedStartDate: Date;

  @Column({ type: 'date' })
  plannedEndDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionPercentage: number;

  @Column({ type: 'enum', enum: ['not_started', 'in_progress', 'completed', 'delayed', 'cancelled'], default: 'not_started' })
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';

  @Column({ length: 100 })
  responsiblePerson: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  milestones: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}