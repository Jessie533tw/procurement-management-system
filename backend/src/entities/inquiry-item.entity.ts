import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Inquiry } from './inquiry.entity';
import { Material } from './material.entity';
import { InquiryResponseItem } from './inquiry-response-item.entity';

@Entity('inquiry_items')
export class InquiryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  inquiryId: string;

  @ManyToOne(() => Inquiry, inquiry => inquiry.items)
  @JoinColumn({ name: 'inquiryId' })
  inquiry: Inquiry;

  @Column('uuid')
  materialId: string;

  @ManyToOne(() => Material, material => material.inquiryItems)
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ length: 20 })
  unit: string;

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true })
  requiredDate: Date;

  @OneToMany(() => InquiryResponseItem, responseItem => responseItem.inquiryItem)
  responseItems: InquiryResponseItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}