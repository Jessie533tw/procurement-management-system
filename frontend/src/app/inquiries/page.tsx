'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Send, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';

interface Inquiry {
  id: string;
  inquiryNumber: string;
  title: string;
  project: {
    name: string;
    projectCode: string;
  };
  status: 'draft' | 'sent' | 'responded' | 'evaluated' | 'cancelled';
  issueDate: string;
  dueDate: string;
  responseCount: number;
  totalResponses: number;
  createdBy: string;
}

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    inquiryNumber: 'INQ202409001',
    title: '鋼筋混凝土材料詢價',
    project: {
      name: 'A1商業大樓建設案',
      projectCode: 'PROJ2024001',
    },
    status: 'responded',
    issueDate: '2024-09-01',
    dueDate: '2024-09-07',
    responseCount: 3,
    totalResponses: 5,
    createdBy: '張工程師',
  },
  {
    id: '2',
    inquiryNumber: 'INQ202409002',
    title: '電梯設備供應詢價',
    project: {
      name: 'B區住宅社區開發',
      projectCode: 'PROJ2024002',
    },
    status: 'sent',
    issueDate: '2024-09-03',
    dueDate: '2024-09-10',
    responseCount: 1,
    totalResponses: 3,
    createdBy: '李經理',
  },
  {
    id: '3',
    inquiryNumber: 'INQ202409003',
    title: '防水材料及施工詢價',
    project: {
      name: 'A1商業大樓建設案',
      projectCode: 'PROJ2024001',
    },
    status: 'draft',
    issueDate: '2024-09-05',
    dueDate: '2024-09-12',
    responseCount: 0,
    totalResponses: 4,
    createdBy: '王技師',
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  responded: 'bg-green-100 text-green-800',
  evaluated: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: '草稿',
  sent: '已發送',
  responded: '已回覆',
  evaluated: '已評估',
  cancelled: '已取消',
};

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries] = useState<Inquiry[]>(mockInquiries);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.inquiryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    router.push(`/inquiries/${inquiry.id}`);
  };

  const handleEditInquiry = (inquiry: Inquiry) => {
    router.push(`/inquiries/${inquiry.id}/edit`);
  };

  const handleCompareQuotes = (inquiry: Inquiry) => {
    router.push(`/inquiries/${inquiry.id}/compare`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">詢價管理</h1>
          <p className="text-gray-600 mt-1">管理詢價單與供應商報價</p>
        </div>
        <Button
          icon={<Plus size={20} />}
          onClick={() => router.push('/inquiries/new')}
        >
          建立詢價單
        </Button>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋詢價單標題、編號或專案..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={<Filter size={20} />}>
            篩選
          </Button>
        </div>
      </div>

      {/* 詢價單列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  詢價資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  專案
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  回覆狀況
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  時程
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  建立者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.inquiryNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {inquiry.project.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.project.projectCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[inquiry.status]}`}>
                      {statusLabels[inquiry.status]}
                    </span>
                    {isOverdue(inquiry.dueDate) && inquiry.status === 'sent' && (
                      <div className="text-xs text-red-500 mt-1">已逾期</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {inquiry.responseCount} / {inquiry.totalResponses}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(inquiry.responseCount / inquiry.totalResponses) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((inquiry.responseCount / inquiry.totalResponses) * 100)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>發出：{inquiry.issueDate}</div>
                    <div className={`${isOverdue(inquiry.dueDate) ? 'text-red-500' : 'text-gray-500'}`}>
                      截止：{inquiry.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inquiry.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900" 
                        title="檢視詳情"
                        onClick={() => handleViewDetails(inquiry)}
                      >
                        <Eye size={16} />
                      </button>
                      {inquiry.status === 'draft' && (
                        <button 
                          className="text-gray-600 hover:text-gray-900" 
                          title="編輯"
                          onClick={() => handleEditInquiry(inquiry)}
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {inquiry.status === 'draft' && (
                        <button className="text-green-600 hover:text-green-900" title="發送">
                          <Send size={16} />
                        </button>
                      )}
                      {inquiry.status === 'responded' && (
                        <button 
                          className="text-purple-600 hover:text-purple-900" 
                          title="比價分析"
                          onClick={() => handleCompareQuotes(inquiry)}
                        >
                          <MessageSquare size={16} />
                        </button>
                      )}
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