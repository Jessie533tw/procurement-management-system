'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCreateVendor, useUpdateVendor } from '@/hooks/useVendors';
import type { Vendor } from '@/types';

const vendorSchema = z.object({
  name: z.string().min(1, '供應商名稱為必填項目'),
  taxId: z.string().optional(),
  contactPerson: z.string().min(1, '聯絡人為必填項目'),
  phone: z.string().min(1, '電話為必填項目'),
  email: z.string().email('請輸入有效的電子郵件').optional().or(z.literal('')),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'blacklisted']).optional(),
  rating: z.number().min(0).max(5).optional(),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  vendor?: Vendor;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { value: 'active', label: '啟用中' },
  { value: 'inactive', label: '已停用' },
  { value: 'blacklisted', label: '黑名單' },
];

const specialtyOptions = [
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
  { value: '電梯設備', label: '電梯設備' },
];

export function VendorForm({ vendor, onSuccess, onCancel }: VendorFormProps) {
  const isEditing = !!vendor;
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: vendor ? {
      name: vendor.name,
      taxId: vendor.taxId || '',
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email || '',
      address: vendor.address || '',
      paymentTerms: vendor.paymentTerms || '',
      specialties: vendor.specialties || [],
      status: vendor.status,
      rating: vendor.rating,
    } : {
      status: 'active',
      rating: 0,
      specialties: [],
    },
  });

  const onSubmit = async (data: VendorFormData) => {
    try {
      // 清理空字符串
      const cleanData = {
        ...data,
        email: data.email || undefined,
        taxId: data.taxId || undefined,
        address: data.address || undefined,
        paymentTerms: data.paymentTerms || undefined,
      };

      if (isEditing) {
        await updateVendor.mutateAsync({ id: vendor.id, data: cleanData });
      } else {
        await createVendor.mutateAsync(cleanData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save vendor:', error);
    }
  };

  const isLoading = isSubmitting || createVendor.isPending || updateVendor.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="供應商名稱"
          {...register('name')}
          error={errors.name?.message}
          disabled={isLoading}
        />

        <Input
          label="統一編號"
          {...register('taxId')}
          error={errors.taxId?.message}
          disabled={isLoading}
          helperText="選填"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="聯絡人"
          {...register('contactPerson')}
          error={errors.contactPerson?.message}
          disabled={isLoading}
        />

        <Input
          label="聯絡電話"
          {...register('phone')}
          error={errors.phone?.message}
          disabled={isLoading}
        />
      </div>

      <Input
        label="電子郵件"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={isLoading}
        helperText="選填"
      />

      <Textarea
        label="公司地址"
        rows={2}
        {...register('address')}
        error={errors.address?.message}
        disabled={isLoading}
        helperText="選填"
      />

      <Input
        label="付款條件"
        {...register('paymentTerms')}
        error={errors.paymentTerms?.message}
        disabled={isLoading}
        helperText="例如：月結30天、現金交易等"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="供應商狀態"
          options={statusOptions}
          {...register('status')}
          error={errors.status?.message}
          disabled={isLoading}
        />

        <Input
          label="供應商評分"
          type="number"
          step="0.1"
          min="0"
          max="5"
          {...register('rating', { valueAsNumber: true })}
          error={errors.rating?.message}
          disabled={isLoading}
          helperText="0-5分"
        />
      </div>

      {/* 專長領域多選 - 簡化版本 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          專長領域
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {specialtyOptions.map((specialty) => (
            <label key={specialty.value} className="flex items-center">
              <input
                type="checkbox"
                value={specialty.value}
                {...register('specialties')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-700">{specialty.label}</span>
            </label>
          ))}
        </div>
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
          {isEditing ? '更新供應商' : '新增供應商'}
        </Button>
      </div>
    </form>
  );
}