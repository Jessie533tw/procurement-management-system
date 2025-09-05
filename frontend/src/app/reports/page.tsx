'use client';

import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, DollarSign, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data for reports
const mockReportData = {
  overview: {
    totalProjects: 15,
    activeProjects: 8,
    totalBudget: 125000000,
    usedBudget: 78000000,
    totalVendors: 45,
    activeInquiries: 12,
  },
  projectStatus: [
    { status: '規劃中', count: 3, color: '#9CA3AF' },
    { status: '進行中', count: 8, color: '#10B981' },
    { status: '已完成', count: 3, color: '#3B82F6' },
    { status: '已取消', count: 1, color: '#EF4444' },
  ],
  budgetUtilization: [
    { month: '1月', budget: 8000000, used: 7200000 },
    { month: '2月', budget: 9500000, used: 8800000 },
    { month: '3月', budget: 12000000, used: 10500000 },
    { month: '4月', budget: 11000000, used: 9800000 },
    { month: '5月', budget: 10500000, used: 9200000 },
    { month: '6月', budget: 13000000, used: 11800000 },
  ],
  topVendors: [
    { name: '台灣鋼鐵股份有限公司', orderCount: 15, totalAmount: 12500000, avgRating: 4.5 },
    { name: '建材供應商股份有限公司', orderCount: 12, totalAmount: 9800000, avgRating: 4.2 },
    { name: '優質建材有限公司', orderCount: 8, totalAmount: 8200000, avgRating: 4.8 },
    { name: '基礎工程材料行', orderCount: 10, totalAmount: 7500000, avgRating: 4.1 },
  ],
  materialAnalysis: [
    { category: '鋼筋', percentage: 35, amount: 27300000 },
    { category: '混凝土', percentage: 28, amount: 21840000 },
    { category: '模板', percentage: 15, amount: 11700000 },
    { category: '磚塊', percentage: 12, amount: 9360000 },
    { category: '其他', percentage: 10, amount: 7800000 },
  ],
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6month');
  const [selectedProject, setSelectedProject] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">報表分析</h1>
          <p className="text-gray-600 mt-1">專案預算使用情況與供應商績效分析</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="3month">最近3個月</option>
            <option value="6month">最近6個月</option>
            <option value="1year">最近1年</option>
          </select>
          <Button
            variant="outline"
            icon={<Download size={16} />}
          >
            匯出報表
          </Button>
        </div>
      </div>

      {/* 總覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">總專案數</p>
              <p className="text-2xl font-bold text-gray-900">{mockReportData.overview.totalProjects}</p>
              <p className="text-sm text-green-600 mt-1">進行中: {mockReportData.overview.activeProjects}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">預算使用率</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(mockReportData.overview.usedBudget, mockReportData.overview.totalBudget)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatCurrency(mockReportData.overview.usedBudget)} / {formatCurrency(mockReportData.overview.totalBudget)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">供應商總數</p>
              <p className="text-2xl font-bold text-gray-900">{mockReportData.overview.totalVendors}</p>
              <p className="text-sm text-blue-600 mt-1">活躍供應商</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">進行中詢價</p>
              <p className="text-2xl font-bold text-gray-900">{mockReportData.overview.activeInquiries}</p>
              <p className="text-sm text-orange-600 mt-1">等待回覆</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 專案狀態分布 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">專案狀態分布</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {mockReportData.projectStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{status.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{status.count}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: status.color,
                        width: `${(status.count / mockReportData.overview.totalProjects) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 材料分類分析 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">材料分類支出分析</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {mockReportData.materialAnalysis.map((material, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{material.category}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(material.amount)} ({material.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${material.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 預算使用趨勢 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">月度預算使用趨勢</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <div className="flex items-end justify-between space-x-4" style={{ minWidth: '600px', height: '200px' }}>
            {mockReportData.budgetUtilization.map((month, index) => {
              const maxBudget = Math.max(...mockReportData.budgetUtilization.map(m => m.budget));
              const budgetHeight = (month.budget / maxBudget) * 160;
              const usedHeight = (month.used / maxBudget) * 160;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="flex items-end space-x-1">
                    <div
                      className="bg-blue-200 rounded-t"
                      style={{ width: '20px', height: `${budgetHeight}px` }}
                      title={`預算: ${formatCurrency(month.budget)}`}
                    ></div>
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{ width: '20px', height: `${usedHeight}px` }}
                      title={`已使用: ${formatCurrency(month.used)}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{month.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span className="text-sm text-gray-600">預算</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">已使用</span>
            </div>
          </div>
        </div>
      </div>

      {/* 供應商績效排名 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">供應商績效排名</h3>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">排名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">供應商</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">訂單數</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">總金額</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均評分</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockReportData.topVendors.map((vendor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{vendor.name}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{vendor.orderCount}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(vendor.totalAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < vendor.avgRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">{vendor.avgRating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}