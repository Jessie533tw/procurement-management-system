import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_budgets')
export class ProjectBudget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  projectId: string;

  @ManyToOne(() => Project, project => project.budgets)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ length: 50 })
  category: string;

  @Column({ length: 100 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  budgetAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  committedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualAmount: number;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}