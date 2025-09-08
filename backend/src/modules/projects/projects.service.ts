import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectBudget, ProjectProgress } from '../../entities';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectBudget)
    private budgetRepository: Repository<ProjectBudget>,
    @InjectRepository(ProjectProgress)
    private progressRepository: Repository<ProjectProgress>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    const savedProject = await this.projectRepository.save(project);
    
    // 自動建立專案預算表結構
    await this.createDefaultBudgetStructure(savedProject.id);
    
    return savedProject;
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['budgets', 'inquiries', 'purchaseOrders'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['budgets', 'inquiries', 'purchaseOrders'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  async getBudgetSummary(projectId: string) {
    const budgets = await this.budgetRepository.find({
      where: { projectId },
      select: ['category', 'budgetAmount', 'committedAmount', 'actualAmount'],
    });

    return budgets.reduce((summary, budget) => {
      const category = budget.category;
      if (!summary[category]) {
        summary[category] = {
          budgetAmount: 0,
          committedAmount: 0,
          actualAmount: 0,
          remaining: 0,
        };
      }
      
      summary[category].budgetAmount += Number(budget.budgetAmount);
      summary[category].committedAmount += Number(budget.committedAmount);
      summary[category].actualAmount += Number(budget.actualAmount);
      summary[category].remaining = summary[category].budgetAmount - summary[category].committedAmount;
      
      return summary;
    }, {});
  }

  async updateBudgetUsage(projectId: string, amount: number): Promise<void> {
    const project = await this.findOne(projectId);
    project.usedBudget = Number(project.usedBudget) + amount;
    await this.projectRepository.save(project);
  }

  private async createDefaultBudgetStructure(projectId: string): Promise<void> {
    const defaultCategories = [
      { category: '材料費', itemName: '建材採購', description: '各類建築材料採購費用' },
      { category: '人工費', itemName: '工程施工', description: '施工人員薪資費用' },
      { category: '機具費', itemName: '設備租賃', description: '工程機具設備租賃費用' },
      { category: '管理費', itemName: '專案管理', description: '專案管理相關費用' },
      { category: '其他費用', itemName: '雜項支出', description: '其他相關費用' },
    ];

    const budgets = defaultCategories.map(item => 
      this.budgetRepository.create({
        projectId,
        ...item,
        budgetAmount: 0,
      })
    );

    await this.budgetRepository.save(budgets);
  }
}