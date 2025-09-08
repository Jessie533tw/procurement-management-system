'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';

const inquiryItemSchema = z.object({
  materialId: z.string().min(1, '材料為必選項目'),
  materialName: z.string().min(1, '材料名稱為必填項目'),
  specification: z.string().optional(),
  quantity: z.number().min(1, '數量必須大於 0'),
  unit: z.string().min(1, '單位為必填項目'),
  estimatedUnitPrice: z.number().min(0, '預估單價必須大於等於 0').optional(),
  remarks: z.string().optional(),
});

const inquirySchema = z.object({
  title: z.string().min(1, '詢價標題為必填項目'),
  projectId: z.string().min(1, '專案為必選項目'),
  description: z.string().optional(),
  dueDate: z.string().min(1, '截止日期為必填項目'),
  deliveryLocation: z.string().optional(),
  paymentTerms: z.string().optional(),
  specialRequirements: z.string().optional(),
  items: z.array(inquiryItemSchema).min(1, '至少需要一個詢價項目'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  inquiry?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Mock data
const mockProjects = [
  { value: 'PROJ001', label: 'A1商業大樓建設案 (PROJ2024001)' },
  { value: 'PROJ002', label: 'B區住宅社區開發 (PROJ2024002)' },
  { value: 'PROJ003', label: 'C區工業廠房建設 (PROJ2024003)' },
];

const mockMaterials = [
  { id: 'MAT001', name: '竹節鋼筋 #4', unit: '公噸', category: '鋼筋' },
  { id: 'MAT002', name: '預拌混凝土 280kgf/cm²', unit: '立方公尺', category: '混凝土' },
  { id: 'MAT003', name: '模板系統', unit: '平方公尺', category: '模板' },
  { id: 'MAT004', name: '紅磚', unit: '千塊', category: '磚塊' },
  { id: 'MAT005', name: '水泥', unit: '包', category: '水泥' },
];

export function InquiryForm({ inquiry, onSuccess, onCancel }: InquiryFormProps) {
  const [isShowingMaterialSearch, setIsShowingMaterialSearch] = useState<number | null>(null);
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');
  const isEditing = !!inquiry;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: inquiry ? {
      title: inquiry.title,
      projectId: inquiry.projectId,
      description: inquiry.description || '',
      dueDate: inquiry.dueDate,
      deliveryLocation: inquiry.deliveryLocation || '',
      paymentTerms: inquiry.paymentTerms || '',
      specialRequirements: inquiry.specialRequirements || '',
      items: inquiry.items || [
        {
          materialId: '',
          materialName: '',
          specification: '',
          quantity: 1,
          unit: '',
          estimatedUnitPrice: 0,
          remarks: '',
        }
      ],
    } : {
      items: [
        {
          materialId: '',
          materialName: '',
          specification: '',
          quantity: 1,
          unit: '',
          estimatedUnitPrice: 0,
          remarks: '',
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const filteredMaterials = mockMaterials.filter(material =>
    material.name.toLowerCase().includes(materialSearchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(materialSearchTerm.toLowerCase())
  );

  const handleMaterialSelect = (material: any, index: number) => {
    setValue(`items.${index}.materialId`, material.id);
    setValue(`items.${index}.materialName`, material.name);
    setValue(`items.${index}.unit`, material.unit);
    setIsShowingMaterialSearch(null);
    setMaterialSearchTerm('');
  };

  const onSubmit = async (data: InquiryFormData) => {
    try {
      console.log('Submitting inquiry:', data);
      // 這裡會調用 API 創建或更新詢價單
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save inquiry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 基本資訊 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h3 className="text-lg font-medium text-gray-900">基本資訊</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="詢價標題"
            {...register('title')}
            error={errors.title?.message}
            disabled={isSubmitting}
            placeholder="例如：鋼筋混凝土材料詢價"
          />

          <Select
            label="關聯專案"
            options={mockProjects}
            {...register('projectId')}
            error={errors.projectId?.message}
            disabled={isSubmitting}
            placeholder="請選擇專案"
          />
        </div>

        <Textarea
          label="詢價說明"
          rows={3}
          {...register('description')}
          error={errors.description?.message}
          disabled={isSubmitting}
          placeholder="詳細說明詢價需求..."
          helperText="選填，可描述材料用途、品質要求等"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="截止日期"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
            disabled={isSubmitting}
          />

          <Input
            label="交貨地點"
            {...register('deliveryLocation')}
            error={errors.deliveryLocation?.message}
            disabled={isSubmitting}
            placeholder="工地地址或指定地點"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="付款條件"
            {...register('paymentTerms')}
            error={errors.paymentTerms?.message}
            disabled={isSubmitting}
            placeholder="例如：月結30天、現金交易等"
          />

          <Textarea
            label="特殊要求"
            rows={2}
            {...register('specialRequirements')}
            error={errors.specialRequirements?.message}
            disabled={isSubmitting}
            placeholder="品質認證、交期要求、包裝方式等"
          />
        </div>
      </div>

      {/* 詢價項目 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">詢價項目</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => append({
              materialId: '',
              materialName: '',
              specification: '',
              quantity: 1,
              unit: '',
              estimatedUnitPrice: 0,
              remarks: '',
            })}
            disabled={isSubmitting}
          >
            新增項目
          </Button>
        </div>

        {errors.items && (
          <p className="text-sm text-red-600">{errors.items.message}</p>
        )}

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">項目 {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={<Trash2 size={14} />}
                    onClick={() => remove(index)}
                    disabled={isSubmitting}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    刪除
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="材料名稱"
                    {...register(`items.${index}.materialName`)}
                    error={errors.items?.[index]?.materialName?.message}
                    disabled={isSubmitting}
                    placeholder="點擊搜尋材料..."
                    onClick={() => setIsShowingMaterialSearch(index)}
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={<Search size={14} />}
                    className="absolute right-2 top-8"
                    onClick={() => setIsShowingMaterialSearch(index)}
                    disabled={isSubmitting}
                  />

                  {/* 材料搜尋下拉選單 */}
                  {isShowingMaterialSearch === index && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-3 border-b">
                        <input
                          type="text"
                          placeholder="搜尋材料..."
                          value={materialSearchTerm}
                          onChange={(e) => setMaterialSearchTerm(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredMaterials.map((material) => (
                          <button
                            key={material.id}
                            type="button"
                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100"
                            onClick={() => handleMaterialSelect(material, index)}
                          >
                            <div className="font-medium text-gray-900">{material.name}</div>
                            <div className="text-sm text-gray-500">
                              {material.category} · 單位：{material.unit}
                            </div>
                          </button>
                        ))}
                        {filteredMaterials.length === 0 && (
                          <div className="p-3 text-gray-500 text-center">
                            找不到符合的材料
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t bg-gray-50">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsShowingMaterialSearch(null)}
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="規格說明"
                  {...register(`items.${index}.specification`)}
                  error={errors.items?.[index]?.specification?.message}
                  disabled={isSubmitting}
                  placeholder="品牌、型號、規格等"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="數量"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.quantity?.message}
                  disabled={isSubmitting}
                />

                <Input
                  label="單位"
                  {...register(`items.${index}.unit`)}
                  error={errors.items?.[index]?.unit?.message}
                  disabled={isSubmitting}
                  readOnly
                />

                <Input
                  label="預估單價"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.estimatedUnitPrice`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.estimatedUnitPrice?.message}
                  disabled={isSubmitting}
                  helperText="選填，供參考"
                />
              </div>

              <Textarea
                label="備註"
                rows={2}
                {...register(`items.${index}.remarks`)}
                error={errors.items?.[index]?.remarks?.message}
                disabled={isSubmitting}
                placeholder="其他要求或說明..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* 附件上傳 */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h3 className="text-lg font-medium text-gray-900">相關文件</h3>
        <FileUpload
          label="上傳詢價相關文件"
          helperText="可上傳工程圖、規格書、參考資料等"
          maxFiles={10}
          acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.dwg']}
          disabled={isSubmitting}
        />
      </div>

      {/* 表單按鈕 */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {isEditing ? '更新詢價單' : '建立詢價單'}
        </Button>
      </div>
    </form>
  );
}