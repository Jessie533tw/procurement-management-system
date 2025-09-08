import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { InquiryItem } from './inquiry-item.entity';
import { InquiryResponse } from './inquiry-response.entity';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  inquiryNumber: string;

  @Column('uuid')
  projectId: string;

  @ManyToOne(() => Project, project => project.inquiries)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'enum', enum: ['draft', 'sent', 'responded', 'evaluated', 'cancelled'], default: 'draft' })
  status: 'draft' | 'sent' | 'responded' | 'evaluated' | 'cancelled';

  @Column({ type: 'json', nullable: true })
  requirements: Record<string, any>;

  @Column({ length: 100 })
  createdBy: string;

  @OneToMany(() => InquiryItem, inquiryItem => inquiryItem.inquiry)
  items: InquiryItem[];

  @OneToMany(() => InquiryResponse, response => response.inquiry)
  responses: InquiryResponse[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}