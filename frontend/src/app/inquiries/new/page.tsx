'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InquiryForm } from '@/components/forms/InquiryForm';

export default function NewInquiryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/inquiries');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
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
          <h1 className="text-2xl font-bold text-gray-900">建立詢價單</h1>
          <p className="text-gray-600">新增詢價單並邀請供應商報價</p>
        </div>
      </div>

      {/* 詢價單表單 */}
      <InquiryForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}