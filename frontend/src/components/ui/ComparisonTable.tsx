import React, { useState } from 'react';
import { Check, X, Star, MessageSquare } from 'lucide-react';

interface VendorQuote {
  vendorId: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  totalAmount: number;
  deliveryDays: number;
  paymentTerms: string;
  validUntil: string;
  remarks?: string;
  rating: number;
  isRecommended?: boolean;
  items: QuoteItem[];
}

interface QuoteItem {
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  brand?: string;
  specifications?: string;
  deliveryDate?: string;
}

interface ComparisonTableProps {
  inquiry: {
    id: string;
    inquiryNumber: string;
    title: string;
    items: {
      materialId: string;
      materialName: string;
      unit: string;
      quantity: number;
    }[];
  };
  quotes: VendorQuote[];
  onSelectQuote?: (vendorId: string, itemId?: string) => void;
  selectedQuotes?: { [itemId: string]: string };
}

export function ComparisonTable({ 
  inquiry, 
  quotes, 
  onSelectQuote, 
  selectedQuotes = {} 
}: ComparisonTableProps) {
  const [sortBy, setSortBy] = useState<'total' | 'delivery' | 'rating'>('total');
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    switch (sortBy) {
      case 'total':
        return a.totalAmount - b.totalAmount;
      case 'delivery':
        return a.deliveryDays - b.deliveryDays;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getLowestPrice = (materialId: string) => {
    const prices = quotes
      .flatMap(quote => quote.items)
      .filter(item => item.materialId === materialId)
      .map(item => item.unitPrice);
    return Math.min(...prices);
  };

  const getHighestRating = () => {
    return Math.max(...quotes.map(quote => quote.rating));
  };

  const getFastestDelivery = () => {
    return Math.min(...quotes.map(quote => quote.deliveryDays));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating}</span>
      </div>
    );
  };

  if (!quotes.length) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">尚無報價資料</h3>
          <p>等待供應商提交報價後，此處將顯示比價表</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 操作工具列 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              詢價比較 - {inquiry.title}
            </h2>
            <p className="text-sm text-gray-500">詢價單號：{inquiry.inquiryNumber}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">排序：</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="total">總金額</option>
                <option value="delivery">交期</option>
                <option value="rating">評分</option>
              </select>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              {showDetails ? '簡化檢視' : '詳細檢視'}
            </button>
          </div>
        </div>
      </div>

      {/* 總覽比較表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  供應商
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  總金額
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  交期
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  付款條件
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  評分
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  報價效期
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  選擇
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedQuotes.map((quote) => {
                const isLowestPrice = quote.totalAmount === Math.min(...quotes.map(q => q.totalAmount));
                const isFastestDelivery = quote.deliveryDays === getFastestDelivery();
                const isHighestRating = quote.rating === getHighestRating();
                
                return (
                  <tr key={quote.vendorId} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {quote.vendorName}
                          </div>
                          {quote.isRecommended && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              推薦
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quote.contactPerson} · {quote.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${isLowestPrice ? 'text-green-600' : 'text-gray-900'}`}>
                          {formatCurrency(quote.totalAmount)}
                        </span>
                        {isLowestPrice && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            最低價
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className={`text-sm ${isFastestDelivery ? 'text-green-600 font-medium' : 'text-gray-900'}`}>
                          {quote.deliveryDays} 天
                        </span>
                        {isFastestDelivery && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            最快
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {quote.paymentTerms}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {renderStars(quote.rating)}
                        {isHighestRating && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            最高分
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {quote.validUntil}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="radio"
                        name="selectedVendor"
                        value={quote.vendorId}
                        onChange={() => onSelectQuote?.(quote.vendorId)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 詳細項目比較 */}
      {showDetails && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">項目明細比較</h3>
          </div>
          <div className="overflow-x-auto">
            {inquiry.items.map((item) => (
              <div key={item.materialId} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {item.materialName}
                    </h4>
                    <span className="text-sm text-gray-500">
                      數量：{item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-25">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">供應商</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">單價</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">小計</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">品牌規格</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">交期</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">選擇</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quotes.map((quote) => {
                      const quoteItem = quote.items.find(qi => qi.materialId === item.materialId);
                      if (!quoteItem) return null;

                      const isLowestUnitPrice = quoteItem.unitPrice === getLowestPrice(item.materialId);
                      
                      return (
                        <tr key={`${quote.vendorId}-${item.materialId}`} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {quote.vendorName}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`text-sm ${isLowestUnitPrice ? 'text-green-600 font-medium' : 'text-gray-900'}`}>
                              {formatCurrency(quoteItem.unitPrice)}
                            </span>
                            {isLowestUnitPrice && (
                              <div className="text-xs text-green-600">最低價</div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {formatCurrency(quoteItem.totalPrice)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <div>{quoteItem.brand || '-'}</div>
                            {quoteItem.specifications && (
                              <div className="text-xs text-gray-500">{quoteItem.specifications}</div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {quoteItem.deliveryDate || `${quote.deliveryDays}天`}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="radio"
                              name={`item-${item.materialId}`}
                              value={quote.vendorId}
                              checked={selectedQuotes[item.materialId] === quote.vendorId}
                              onChange={() => onSelectQuote?.(quote.vendorId, item.materialId)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 備註區域 */}
      {quotes.some(quote => quote.remarks) && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">供應商備註</h3>
          <div className="space-y-3">
            {quotes
              .filter(quote => quote.remarks)
              .map((quote) => (
                <div key={quote.vendorId} className="border-l-4 border-blue-400 bg-blue-50 p-3">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {quote.vendorName}
                      </div>
                      <div className="text-sm text-gray-700">
                        {quote.remarks}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}