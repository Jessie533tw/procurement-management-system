'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Star, Phone, Mail } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import type { Vendor } from '@/types';

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: '永豐建材有限公司',
    vendorCode: 'V2024001',
    taxId: '12345678',
    contactPerson: '王建材',
    phone: '02-12345678',
    email: 'contact@yongfeng.com.tw',
    address: '台北市中山區建國北路一段100號',
    paymentTerms: '月結30天',
    specialties: ['鋼筋', '混凝土', '磚塊'],
    status: 'active',
    rating: 4.5,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-08-20T00:00:00Z',
  },
  {
    id: '2',
    name: '大成鋼鐵股份有限公司',
    vendorCode: 'V2024002',
    taxId: '87654321',
    contactPerson: '李鋼鐵',
    phone: '03-98765432',
    email: 'sales@dacheng-steel.com',
    address: '桃園市龜山區工業一路50號',
    paymentTerms: '現金交易',
    specialties: ['鋼筋', '鋁材', '管材'],
    status: 'active',
    rating: 4.8,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-09-01T00:00:00Z',
  },
  {
    id: '3',
    name: '精工電梯工程有限公司',
    vendorCode: 'V2024003',
    taxId: '11223344',
    contactPerson: '張電梯',
    phone: '04-55667788',
    email: 'service@seiki-elevator.com',
    address: '台中市西屯區工業區路88號',
    paymentTerms: '分期付款',
    specialties: ['電梯設備', '五金', '電線'],
    status: 'active',
    rating: 4.2,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-08-15T00:00:00Z',
  },
  {
    id: '4',
    name: '品質防水工程有限公司',
    vendorCode: 'V2024004',
    taxId: '99887766',
    contactPerson: '陳防水',
    phone: '07-33445566',
    email: 'info@quality-waterproof.com',
    address: '高雄市左營區民族一路200號',
    paymentTerms: '完工付款',
    specialties: ['防水材', '保溫材'],
    status: 'inactive',
    rating: 3.8,
    createdAt: '2024-04-20T00:00:00Z',
    updatedAt: '2024-07-10T00:00:00Z',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  blacklisted: 'bg-red-100 text-red-800',
};

const statusLabels = {
  active: '啟用中',
  inactive: '已停用',
  blacklisted: '黑名單',
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const columns = [
    {
      key: 'vendorInfo',
      title: '供應商資訊',
      render: (value: any, record: Vendor) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.name}
          </div>
          <div className="text-sm text-gray-500">
            {record.vendorCode} | {record.contactPerson}
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: '聯絡資訊',
      render: (value: any, record: Vendor) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900">
            <Phone size={14} className="mr-1 text-gray-400" />
            {record.phone}
          </div>
          {record.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={14} className="mr-1 text-gray-400" />
              {record.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'specialties',
      title: '專長領域',
      render: (value: any, record: Vendor) => (
        <div className="flex flex-wrap gap-1">
          {record.specialties?.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
            >
              {specialty}
            </span>
          ))}
          {(record.specialties?.length || 0) > 3 && (
            <span className="text-xs text-gray-500">
              +{(record.specialties?.length || 0) - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      title: '評分',
      render: (value: any, record: Vendor) => renderStarRating(record.rating),
      align: 'center' as const,
    },
    {
      key: 'status',
      title: '狀態',
      render: (value: any, record: Vendor) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[record.status]}`}>
          {statusLabels[record.status]}
        </span>
      ),
      align: 'center' as const,
    },
    {
      key: 'paymentTerms',
      title: '付款條件',
      render: (value: any, record: Vendor) => (
        <div className="text-sm text-gray-900">
          {record.paymentTerms || '-'}
        </div>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      render: (value: any, record: Vendor) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900" title="檢視詳情">
            <Eye size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-900" title="編輯">
            <Edit size={16} />
          </button>
        </div>
      ),
      width: '100px',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">供應商管理</h1>
          <p className="text-gray-600 mt-1">管理供應商資料與評級</p>
        </div>
        <Button icon={<Plus size={20} />}>
          新增供應商
        </Button>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋供應商名稱、編號、聯絡人或專長領域..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有狀態</option>
            <option value="active">啟用中</option>
            <option value="inactive">已停用</option>
            <option value="blacklisted">黑名單</option>
          </select>
          
          <Button variant="outline" icon={<Filter size={20} />}>
            進階篩選
          </Button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">總供應商數</div>
          <div className="text-2xl font-bold text-gray-900">{vendors.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">啟用中</div>
          <div className="text-2xl font-bold text-green-600">
            {vendors.filter(v => v.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">平均評分</div>
          <div className="text-2xl font-bold text-yellow-600">
            {(vendors.reduce((acc, v) => acc + v.rating, 0) / vendors.length).toFixed(1)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">高評分供應商</div>
          <div className="text-2xl font-bold text-blue-600">
            {vendors.filter(v => v.rating >= 4.5).length}
          </div>
        </div>
      </div>

      {/* 供應商列表 */}
      <DataTable
        data={filteredVendors}
        columns={columns}
        emptyText="暫無供應商資料"
      />
    </div>
  );
}