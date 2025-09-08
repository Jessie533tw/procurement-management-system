'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCreateMaterial, useUpdateMaterial } from '@/hooks/useMaterials';
import type { Material } from '@/types';

const materialSchema = z.object({
  name: z.string().min(1, '材料名稱為必填項目'),
  description: z.string().optional(),
  unit: z.string().min(1, '計量單位為必填項目'),
  category: z.string().min(1, '主分類為必填項目'),
  subcategory: z.string().optional(),
  estimatedPrice: z.number().min(0, '預估單價必須大於等於 0').optional(),
  isActive: z.boolean().optional(),
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface MaterialFormProps {
  material?: Material;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryOptions = [
  { value: '鋼筋', label: '鋼筋' },
  { value: '混凝土', label: '混凝土' },
  { value: '磚塊', label: '磚塊' },
  { value: '木材', label: '木材' },
  { value: '鋁材', label: '鋁材' },
  { value: '管材', label: '管材' },
  { value: '電線', label: '電線' },
  { value: '五金', label: '五金' },
  { value: '油漆', label: '油漆' },
  { value: '防水材', label: '防水材' },
  { value: '保溫材', label: '保溫材' },
  { value: '玻璃', label: '玻璃' },
];

const unitOptions = [
  { value: '公噸', label: '公噸' },
  { value: '立方公尺', label: '立方公尺' },
  { value: '平方公尺', label: '平方公尺' },
  { value: '公尺', label: '公尺' },
  { value: '千塊', label: '千塊' },
  { value: '加侖', label: '加侖' },
  { value: '桶', label: '桶' },
  { value: '包', label: '包' },
  { value: '支', label: '支' },
  { value: '組', label: '組' },
  { value: '片', label: '片' },
  { value: '個', label: '個' },
];

export function MaterialForm({ material, onSuccess, onCancel }: MaterialFormProps) {
  const isEditing = !!material;
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: material ? {
      name: material.name,
      description: material.description || '',
      unit: material.unit,
      category: material.category,
      subcategory: material.subcategory || '',
      estimatedPrice: material.estimatedPrice || undefined,
      isActive: material.isActive,
    } : {
      isActive: true,
    },
  });

  const onSubmit = async (data: MaterialFormData) => {
    try {
      // 清理空字符串
      const cleanData = {
        ...data,
        description: data.description || undefined,
        subcategory: data.subcategory || undefined,
        estimatedPrice: data.estimatedPrice || undefined,
      };

      if (isEditing) {
        await updateMaterial.mutateAsync({ id: material.id, data: cleanData });
      } else {
        await createMaterial.mutateAsync(cleanData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save material:', error);
    }
  };

  const isLoading = isSubmitting || createMaterial.isPending || updateMaterial.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="材料名稱"
        {...register('name')}
        error={errors.name?.message}
        disabled={isLoading}
      />

      <Textarea
        label="材料描述"
        rows={3}
        {...register('description')}
        error={errors.description?.message}
        disabled={isLoading}
        helperText="選填，請描述材料的特性和用途"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="主分類"
          options={categoryOptions}
          {...register('category')}
          error={errors.category?.message}
          disabled={isLoading}
          placeholder="請選擇主分類"
        />

        <Input
          label="次分類"
          {...register('subcategory')}
          error={errors.subcategory?.message}
          disabled={isLoading}
          helperText="選填，例如：竹節鋼筋、預拌混凝土等"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="計量單位"
          options={unitOptions}
          {...register('unit')}
          error={errors.unit?.message}
          disabled={isLoading}
          placeholder="請選擇計量單位"
        />

        <Input
          label="預估單價"
          type="number"
          step="0.01"
          {...register('estimatedPrice', { valueAsNumber: true })}
          error={errors.estimatedPrice?.message}
          disabled={isLoading}
          helperText="選填，單位：新台幣"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('isActive')}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          disabled={isLoading}
        />
        <label className="ml-2 text-sm text-gray-700">
          啟用此材料
        </label>
      </div>

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
          {isEditing ? '更新材料' : '新增材料'}
        </Button>
      </div>
    </form>
  );
}