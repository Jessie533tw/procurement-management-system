'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import type { Project } from '@/types';

const projectSchema = z.object({
  name: z.string().min(1, '專案名稱為必填項目'),
  projectCode: z.string().min(1, '專案編號為必填項目'),
  description: z.string().optional(),
  totalBudget: z.number().min(0, '總預算必須大於等於 0'),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).optional(),
  startDate: z.string().min(1, '開始日期為必填項目'),
  endDate: z.string().optional(),
  projectManager: z.string().min(1, '專案負責人為必填項目'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { value: 'planning', label: '規劃中' },
  { value: 'active', label: '進行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!project;
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      name: project.name,
      projectCode: project.projectCode,
      description: project.description || '',
      totalBudget: project.totalBudget,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate || '',
      projectManager: project.projectManager,
    } : {
      status: 'planning',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing) {
        await updateProject.mutateAsync({ id: project.id, data });
      } else {
        await createProject.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const isLoading = isSubmitting || createProject.isPending || updateProject.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="專案名稱"
          {...register('name')}
          error={errors.name?.message}
          disabled={isLoading}
        />

        <Input
          label="專案編號"
          {...register('projectCode')}
          error={errors.projectCode?.message}
          disabled={isLoading}
        />
      </div>

      <Textarea
        label="專案描述"
        rows={3}
        {...register('description')}
        error={errors.description?.message}
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="總預算"
          type="number"
          step="0.01"
          {...register('totalBudget', { valueAsNumber: true })}
          error={errors.totalBudget?.message}
          disabled={isLoading}
        />

        <Select
          label="專案狀態"
          options={statusOptions}
          {...register('status')}
          error={errors.status?.message}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="開始日期"
          type="date"
          {...register('startDate')}
          error={errors.startDate?.message}
          disabled={isLoading}
        />

        <Input
          label="結束日期"
          type="date"
          {...register('endDate')}
          error={errors.endDate?.message}
          disabled={isLoading}
        />
      </div>

      <Input
        label="專案負責人"
        {...register('projectManager')}
        error={errors.projectManager?.message}
        disabled={isLoading}
      />

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          取消
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {isEditing ? '更新專案' : '建立專案'}
        </Button>
      </div>
    </form>
  );
}