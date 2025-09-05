'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, Send } from 'lucide-react';
import { ComparisonTable } from '@/components/ui/ComparisonTable';
import { Button } from '@/components/ui/Button';

// Mock data - 在實際應用中會從 API 獲取
const mockInquiry = {
  id: '1',
  inquiryNumber: 'INQ202409001',
  title: '鋼筋混凝土材料詢價',
  project: {
    name: 'A1商業大樓建設案',
    projectCode: 'PROJ2024001',
  },
  items: [
    {
      materialId: 'MAT001',
      materialName: '竹節鋼筋 #4',
      unit: '公噸',
      quantity: 50,
    },
    {
      materialId: 'MAT002',
      materialName: '預拌混凝土 280kgf/cm²',
      unit: '立方公尺',
      quantity: 200,
    },
    {
      materialId: 'MAT003',
      materialName: '模板系統',
      unit: '平方公尺',
      quantity: 1500,
    },
  ],
};

const mockQuotes = [
  {
    vendorId: 'VEN001',
    vendorName: '台灣鋼鐵股份有限公司',
    contactPerson: '張經理',
    phone: '02-2345-6789',
    email: 'manager@taiwansteel.com.tw',
    totalAmount: 2850000,
    deliveryDays: 14,
    paymentTerms: '月結30天',
    validUntil: '2024-09-21',
    rating: 4.5,
    isRecommended: true,
    remarks: '可提供品質保證書，並提供現場技術支援服務。',
    items: [
      {
        materialId: 'MAT001',
        materialName: '竹節鋼筋 #4',
        unit: '公噸',
        quantity: 50,
        unitPrice: 28000,
        totalPrice: 1400000,
        brand: 'CNS標準',
        specifications: 'SD280W, 直徑12mm',
        deliveryDate: '2024-09-19',
      },
      {
        materialId: 'MAT002',
        materialName: '預拌混凝土 280kgf/cm²',
        unit: '立方公尺',
        quantity: 200,
        unitPrice: 3200,
        totalPrice: 640000,
        brand: '台泥預拌',
        specifications: '坍度15±2.5cm, 氯離子含量<0.15kg/m³',
        deliveryDate: '2024-09-20',
      },
      {
        materialId: 'MAT003',
        materialName: '模板系統',
        unit: '平方公尺',
        quantity: 1500,
        unitPrice: 540,
        totalPrice: 810000,
        brand: 'PERI',
        specifications: '多層板18mm厚度，可重複使用',
      },
    ],
  },
  {
    vendorId: 'VEN002',
    vendorName: '建材供應商股份有限公司',
    contactPerson: '李副理',
    phone: '03-456-7890',
    email: 'li@buildmat.com.tw',
    totalAmount: 2720000,
    deliveryDays: 21,
    paymentTerms: '現金交易9.5折',
    validUntil: '2024-09-25',
    rating: 4.2,
    remarks: '大量訂購可再議價，提供免費運輸服務至工地現場。',
    items: [
      {
        materialId: 'MAT001',
        materialName: '竹節鋼筋 #4',
        unit: '公噸',
        quantity: 50,
        unitPrice: 26500,
        totalPrice: 1325000,
        brand: 'CNS標準',
        specifications: 'SD280W, 直徑12mm',
      },
      {
        materialId: 'MAT002',
        materialName: '預拌混凝土 280kgf/cm²',
        unit: '立方公尺',
        quantity: 200,
        unitPrice: 3150,
        totalPrice: 630000,
        brand: '亞泥預拌',
        specifications: '坍度15±2.5cm',
      },
      {
        materialId: 'MAT003',
        materialName: '模板系統',
        unit: '平方公尺',
        quantity: 1500,
        unitPrice: 510,
        totalPrice: 765000,
        brand: '自製',
        specifications: '多層板15mm厚度',
      },
    ],
  },
  {
    vendorId: 'VEN003',
    vendorName: '優質建材有限公司',
    contactPerson: '王主任',
    phone: '04-567-8901',
    email: 'wang@quality-materials.com',
    totalAmount: 2950000,
    deliveryDays: 10,
    paymentTerms: '貨到付款',
    validUntil: '2024-09-18',
    rating: 4.8,
    items: [
      {
        materialId: 'MAT001',
        materialName: '竹節鋼筋 #4',
        unit: '公噸',
        quantity: 50,
        unitPrice: 29000,
        totalPrice: 1450000,
        brand: 'CNS標準',
        specifications: 'SD280W, 直徑12mm, 進口鋼材',
      },
      {
        materialId: 'MAT002',
        materialName: '預拌混凝土 280kgf/cm²',
        unit: '立方公尺',
        quantity: 200,
        unitPrice: 3400,
        totalPrice: 680000,
        brand: '台泥預拌',
        specifications: '坍度15±2.5cm, 添加減水劑',
      },
      {
        materialId: 'MAT003',
        materialName: '模板系統',
        unit: '平方公尺',
        quantity: 1500,
        unitPrice: 547,
        totalPrice: 820000,
        brand: 'DOKA',
        specifications: '鋼模板，可重複使用100次以上',
      },
    ],
  },
];

export default function InquiryComparePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedQuotes, setSelectedQuotes] = useState<{ [itemId: string]: string }>({});
  const [selectedVendor, setSelectedVendor] = useState<string>('');

  const handleSelectQuote = (vendorId: string, itemId?: string) => {
    if (itemId) {
      setSelectedQuotes(prev => ({
        ...prev,
        [itemId]: vendorId,
      }));
    } else {
      setSelectedVendor(vendorId);
      // 全選該供應商的所有項目
      const newSelections: { [itemId: string]: string } = {};
      mockInquiry.items.forEach(item => {
        newSelections[item.materialId] = vendorId;
      });
      setSelectedQuotes(newSelections);
    }
  };

  const handleGeneratePurchaseOrder = () => {
    if (!selectedVendor && Object.keys(selectedQuotes).length === 0) {
      alert('請先選擇供應商或個別項目');
      return;
    }

    // 這裡會調用 API 創建採購單
    console.log('Generate PO with selections:', { selectedVendor, selectedQuotes });
    router.push(`/purchase-orders/new?inquiryId=${params.id}`);
  };

  const handleExportComparison = () => {
    // 這裡會實作匯出比價表功能
    console.log('Export comparison table');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSelectedTotal = () => {
    if (selectedVendor) {
      const vendor = mockQuotes.find(q => q.vendorId === selectedVendor);
      return vendor?.totalAmount || 0;
    }

    let total = 0;
    Object.entries(selectedQuotes).forEach(([itemId, vendorId]) => {
      const vendor = mockQuotes.find(q => q.vendorId === vendorId);
      const item = vendor?.items.find(item => item.materialId === itemId);
      if (item) {
        total += item.totalPrice;
      }
    });
    return total;
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => router.back()}
          >
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">詢價比較分析</h1>
            <p className="text-gray-600">
              {mockInquiry.project.name} · {mockInquiry.inquiryNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={<Download size={16} />}
            onClick={handleExportComparison}
          >
            匯出比價表
          </Button>
          <Button
            variant="outline"
            icon={<FileText size={16} />}
          >
            列印報告
          </Button>
        </div>
      </div>

      {/* 選擇摘要 */}
      {(selectedVendor || Object.keys(selectedQuotes).length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">選擇摘要</h3>
              {selectedVendor ? (
                <p className="text-sm text-blue-700">
                  已選擇供應商：{mockQuotes.find(q => q.vendorId === selectedVendor)?.vendorName}
                </p>
              ) : (
                <p className="text-sm text-blue-700">
                  已選擇 {Object.keys(selectedQuotes).length} 個項目
                </p>
              )}
              <p className="text-lg font-semibold text-blue-900 mt-1">
                預估總金額：{formatCurrency(calculateSelectedTotal())}
              </p>
            </div>
            <Button
              icon={<Send size={16} />}
              onClick={handleGeneratePurchaseOrder}
            >
              產生採購單
            </Button>
          </div>
        </div>
      )}

      {/* 比較表格 */}
      <ComparisonTable
        inquiry={mockInquiry}
        quotes={mockQuotes}
        onSelectQuote={handleSelectQuote}
        selectedQuotes={selectedQuotes}
      />
    </div>
  );
}