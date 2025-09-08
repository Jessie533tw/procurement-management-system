'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, TrendingUp, Package } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Material } from '@/types';

const mockMaterials: Material[] = [
  {
    id: '1',
    materialCode: 'STL240001',
    name: 'SD420W 鋼筋 #4',
    description: '竹節鋼筋，抗拉強度420MPa',
    unit: '公噸',
    category: '鋼筋',
    subcategory: '竹節鋼筋',
    specifications: {
      diameter: '12.7mm',
      standard: 'CNS560',
      strength: '420MPa',
    },
    estimatedPrice: 28000,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-08-20T00:00:00Z',
  },
  {
    id: '2',
    materialCode: 'CON240001',
    name: '預拌混凝土 280kgf/cm²',
    description: '結構用預拌混凝土',
    unit: '立方公尺',
    category: '混凝土',
    subcategory: '預拌混凝土',
    specifications: {
      strength: '280kgf/cm²',
      slump: '18±2.5cm',
      aggregate: '20mm以下',
    },
    estimatedPrice: 2800,
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-09-01T00:00:00Z',
  },
  {
    id: '3',
    materialCode: 'BRK240001',
    name: '紅磚 23x11x6cm',
    description: '實心紅磚，隔間用',
    unit: '千塊',
    category: '磚塊',
    subcategory: '實心磚',
    specifications: {
      size: '23x11x6cm',
      strength: '100kgf/cm²',
      absorption: '12%以下',
    },
    estimatedPrice: 8500,
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-08-15T00:00:00Z',
  },
  {
    id: '4',
    materialCode: 'WOD240001',
    name: '進口松木角材 4x8cm',
    description: '建築用結構木材',
    unit: '立方公尺',
    category: '木材',
    subcategory: '角材',
    specifications: {
      size: '4x8cm',
      grade: '1級',
      moisture: '15%以下',
    },
    estimatedPrice: 25000,
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-07-30T00:00:00Z',
  },
  {
    id: '5',
    materialCode: 'PNT240001',
    name: '乳膠漆 白色 平光',
    description: '室內牆面塗料',
    unit: '加侖',
    category: '油漆',
    subcategory: '乳膠漆',
    specifications: {
      finish: '平光',
      coverage: '12㎡/加侖',
      voc: '低VOC',
    },
    estimatedPrice: 450,
    isActive: false,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
];

const categoryColors: Record<string, string> = {
  '鋼筋': 'bg-red-100 text-red-800',
  '混凝土': 'bg-gray-100 text-gray-800',
  '磚塊': 'bg-orange-100 text-orange-800',
  '木材': 'bg-yellow-100 text-yellow-800',
  '油漆': 'bg-green-100 text-green-800',
  '防水材': 'bg-blue-100 text-blue-800',
  '保溫材': 'bg-purple-100 text-purple-800',
  '玻璃': 'bg-cyan-100 text-cyan-800',
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    const matchesActive = activeFilter === 'all' || 
      (activeFilter === 'active' && material.isActive) ||
      (activeFilter === 'inactive' && !material.isActive);
    
    return matchesSearch && matchesCategory && matchesActive;
  });

  const categories = [...new Set(materials.map(m => m.category))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    {
      key: 'materialInfo',
      title: '材料資訊',
      render: (value: any, record: Material) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.name}
          </div>
          <div className="text-sm text-gray-500">
            {record.materialCode}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      title: '分類',
      render: (value: any, record: Material) => (
        <div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            categoryColors[record.category] || 'bg-gray-100 text-gray-800'
          }`}>
            {record.category}
          </span>
          {record.subcategory && (
            <div className="text-xs text-gray-500 mt-1">{record.subcategory}</div>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      title: '描述',
      render: (value: any, record: Material) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {record.description || '-'}
        </div>
      ),
    },
    {
      key: 'unit',
      title: '單位',
      render: (value: any, record: Material) => (
        <div className="text-sm text-gray-900">
          {record.unit}
        </div>
      ),
      align: 'center' as const,
    },
    {
      key: 'estimatedPrice',
      title: '預估單價',
      render: (value: any, record: Material) => (
        <div className="text-sm text-gray-900 text-right">
          {record.estimatedPrice ? formatCurrency(record.estimatedPrice) : '-'}
        </div>
      ),
      align: 'right' as const,
    },
    {
      key: 'status',
      title: '狀態',
      render: (value: any, record: Material) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          record.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {record.isActive ? '啟用中' : '已停用'}
        </span>
      ),
      align: 'center' as const,
    },
    {
      key: 'actions',
      title: '操作',
      render: (value: any, record: Material) => (
        <div className="flex items-center space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-900"
            title="檢視詳情"
            onClick={() => {
              setSelectedMaterial(record);
              setIsDetailModalOpen(true);
            }}
          >
            <Eye size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-900" title="編輯">
            <Edit size={16} />
          </button>
          <button className="text-green-600 hover:text-green-900" title="價格趨勢">
            <TrendingUp size={16} />
          </button>
        </div>
      ),
      width: '120px',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">材料管理</h1>
          <p className="text-gray-600 mt-1">管理材料主檔與價格資訊</p>
        </div>
        <Button icon={<Plus size={20} />}>
          新增材料
        </Button>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋材料名稱、編號、分類或描述..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有分類</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有狀態</option>
            <option value="active">啟用中</option>
            <option value="inactive">已停用</option>
          </select>
          
          <Button variant="outline" icon={<Filter size={20} />}>
            進階篩選
          </Button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">總材料數</div>
              <div className="text-2xl font-bold text-gray-900">{materials.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">啟用材料</div>
              <div className="text-2xl font-bold text-green-600">
                {materials.filter(m => m.isActive).length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">材料分類</div>
              <div className="text-2xl font-bold text-purple-600">
                {categories.length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">有價格資料</div>
              <div className="text-2xl font-bold text-yellow-600">
                {materials.filter(m => m.estimatedPrice).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 材料列表 */}
      <DataTable
        data={filteredMaterials}
        columns={columns}
        emptyText="暫無材料資料"
      />

      {/* 詳情模態視窗 */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="材料詳情"
        size="lg"
      >
        {selectedMaterial && (
          <div className="space-y-6">
            {/* 基本資訊 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">基本資訊</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">材料編號</dt>
                    <dd className="text-sm font-medium text-gray-900">{selectedMaterial.materialCode}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">材料名稱</dt>
                    <dd className="text-sm font-medium text-gray-900">{selectedMaterial.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">主分類</dt>
                    <dd className="text-sm text-gray-900">{selectedMaterial.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">次分類</dt>
                    <dd className="text-sm text-gray-900">{selectedMaterial.subcategory || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">計量單位</dt>
                    <dd className="text-sm text-gray-900">{selectedMaterial.unit}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">狀態</dt>
                    <dd>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedMaterial.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedMaterial.isActive ? '啟用中' : '已停用'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">價格資訊</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">預估單價</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {selectedMaterial.estimatedPrice ? formatCurrency(selectedMaterial.estimatedPrice) : '-'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">建立時間</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(selectedMaterial.createdAt).toLocaleDateString('zh-TW')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">更新時間</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(selectedMaterial.updatedAt).toLocaleDateString('zh-TW')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* 描述 */}
            {selectedMaterial.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">描述</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedMaterial.description}
                </p>
              </div>
            )}

            {/* 規格資訊 */}
            {selectedMaterial.specifications && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">規格資訊</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <dl className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedMaterial.specifications).map(([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-gray-500 capitalize">{key}</dt>
                        <dd className="text-sm font-medium text-gray-900">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                關閉
              </Button>
              <Button variant="outline">編輯</Button>
              <Button variant="primary">查看價格歷史</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}