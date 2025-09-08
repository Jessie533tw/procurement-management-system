import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectBudget, ProjectProgress } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectBudget, ProjectProgress])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}