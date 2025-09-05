'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Check, X, Clock, Truck } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { PurchaseOrder } from '@/types';

interface MockPurchaseOrder extends Omit<PurchaseOrder, 'project' | 'vendor'> {
  project: {
    name: string;
    projectCode: string;
  };
  vendor: {
    name: string;
    phone: string;
  };
}

const mockPurchaseOrders: MockPurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO202409001',
    projectId: 'proj1',
    vendorId: 'vendor1',
    orderDate: '2024-09-01',
    expectedDeliveryDate: '2024-09-15',
    actualDeliveryDate: '2024-09-14',
    totalAmount: 1500000,
    paymentTerms: '交貨後30天付款',
    status: 'delivered',
    notes: '提前一天交貨',
    createdBy: '張工程師',
    approvedBy: '李經理',
    approvedAt: '2024-09-01T10:00:00Z',
    createdAt: '2024-09-01T09:00:00Z',
    updatedAt: '2024-09-14T16:00:00Z',
    project: {
      name: 'A1商業大樓建設案',
      projectCode: 'PROJ2024001',
    },
    vendor: {
      name: '永豐建材有限公司',
      phone: '02-12345678',
    },
  },
  {
    id: '2',
    orderNumber: 'PO202409002',
    projectId: 'proj2',
    vendorId: 'vendor2',
    orderDate: '2024-09-03',
    expectedDeliveryDate: '2024-09-20',
    totalAmount: 2800000,
    paymentTerms: '分期付款：30% + 40% + 30%',
    status: 'confirmed',
    notes: '需要品質檢測報告',
    createdBy: '王技師',
    approvedBy: '李經理',
    approvedAt: '2024-09-03T14:00:00Z',
    createdAt: '2024-09-03T11:00:00Z',
    updatedAt: '2024-09-03T14:00:00Z',
    project: {
      name: 'B區住宅社區開發',
      projectCode: 'PROJ2024002',
    },
    vendor: {
      name: '大成鋼鐵股份有限公司',
      phone: '03-98765432',
    },
  },
  {
    id: '3',
    orderNumber: 'PO202409003',
    projectId: 'proj1',
    vendorId: 'vendor3',
    orderDate: '2024-09-05',
    expectedDeliveryDate: '2024-09-25',
    totalAmount: 950000,
    paymentTerms: '現金交易',
    status: 'draft',
    notes: '等待主管審核',
    createdBy: '陳工程師',
    createdAt: '2024-09-05T15:00:00Z',
    updatedAt: '2024-09-05T15:00:00Z',
    project: {
      name: 'A1商業大樓建設案',
      projectCode: 'PROJ2024001',
    },
    vendor: {
      name: '精工電梯工程有限公司',
      phone: '04-55667788',
    },
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  approved: 'bg-blue-100 text-blue-800',
  sent: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  delivered: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: '草稿',
  approved: '已審核',
  sent: '已發送',
  confirmed: '已確認',
  delivered: '已交貨',
  completed: '已完成',
  cancelled: '已取消',
};

const statusIcons = {
  draft: <Edit size={16} />,
  approved: <Check size={16} />,
  sent: <Clock size={16} />,
  confirmed: <Check size={16} />,
  delivered: <Truck size={16} />,
  completed: <Check size={16} />,
  cancelled: <X size={16} />,
};

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<MockPurchaseOrder[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<MockPurchaseOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredOrders = purchaseOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isOverdue = (expectedDate: string, status: string) => {
    if (status === 'delivered' || status === 'completed') return false;
    return new Date(expectedDate) < new Date();
  };

  const getDaysUntilDelivery = (expectedDate: string) => {
    const today = new Date();
    const delivery = new Date(expectedDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const columns = [
    {
      key: 'orderInfo',
      title: '採購單資訊',
      render: (value: any, record: MockPurchaseOrder) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.orderNumber}
          </div>
          <div className="text-sm text-gray-500">
            {record.vendor.name}
          </div>
        </div>
      ),
    },
    {
      key: 'project',
      title: '專案',
      render: (value: any, record: MockPurchaseOrder) => (
        <div>
          <div className="text-sm text-gray-900">
            {record.project.name}
          </div>
          <div className="text-sm text-gray-500">
            {record.project.projectCode}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: '狀態',
      render: (value: any, record: MockPurchaseOrder) => (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusColors[record.status]}`}>
            {statusIcons[record.status]}
            <span className="ml-1">{statusLabels[record.status]}</span>
          </span>
          {isOverdue(record.expectedDeliveryDate, record.status) && (
            <span className="text-xs text-red-500">逾期</span>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      title: '金額',
      render: (value: any, record: MockPurchaseOrder) => (
        <div className="text-sm text-gray-900 text-right">
          {formatCurrency(record.totalAmount)}
        </div>
      ),
      align: 'right' as const,
    },
    {
      key: 'delivery',
      title: '交期狀況',
      render: (value: any, record: MockPurchaseOrder) => {
        const daysUntil = getDaysUntilDelivery(record.expectedDeliveryDate);
        const isLate = isOverdue(record.expectedDeliveryDate, record.status);
        
        return (
          <div>
            <div className="text-sm text-gray-900">
              預計：{record.expectedDeliveryDate}
            </div>
            {record.actualDeliveryDate ? (
              <div className="text-sm text-green-600">
                實際：{record.actualDeliveryDate}
              </div>
            ) : (
              <div className={`text-sm ${
                isLate ? 'text-red-500' : 
                daysUntil <= 3 ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {isLate ? `逾期 ${Math.abs(daysUntil)} 天` : `還有 ${daysUntil} 天`}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdBy',
      title: '建立者',
      render: (value: any, record: MockPurchaseOrder) => (
        <div className="text-sm text-gray-900">
          {record.createdBy}
        </div>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      render: (value: any, record: MockPurchaseOrder) => (
        <div className="flex items-center space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-900"
            title="檢視詳情"
            onClick={() => {
              setSelectedOrder(record);
              setIsDetailModalOpen(true);
            }}
          >
            <Eye size={16} />
          </button>
          {record.status === 'draft' && (
            <button className="text-gray-600 hover:text-gray-900" title="編輯">
              <Edit size={16} />
            </button>
          )}
          {record.status === 'draft' && (
            <button className="text-green-600 hover:text-green-900" title="送審">
              <Check size={16} />
            </button>
          )}
        </div>
      ),
      width: '120px',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">採購管理</h1>
          <p className="text-gray-600 mt-1">管理採購單與供應商交期</p>
        </div>
        <Button icon={<Plus size={20} />}>
          建立採購單
        </Button>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋採購單編號、專案名稱、供應商或建立者..."
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

      {/* 採購單列表 */}
      <DataTable
        data={filteredOrders}
        columns={columns}
        emptyText="暫無採購單資料"
      />

      {/* 詳情模態視窗 */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="採購單詳情"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* 基本資訊 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">基本資訊</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">採購單編號</dt>
                    <dd className="text-sm font-medium text-gray-900">{selectedOrder.orderNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">狀態</dt>
                    <dd>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedOrder.status]}`}>
                        {statusIcons[selectedOrder.status]}
                        <span className="ml-1">{statusLabels[selectedOrder.status]}</span>
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">總金額</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">下單日期</dt>
                    <dd className="text-sm text-gray-900">{selectedOrder.orderDate}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">專案資訊</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">專案名稱</dt>
                    <dd className="text-sm font-medium text-gray-900">{selectedOrder.project.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">專案編號</dt>
                    <dd className="text-sm text-gray-900">{selectedOrder.project.projectCode}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">供應商</dt>
                    <dd className="text-sm font-medium text-gray-900">{selectedOrder.vendor.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">聯絡電話</dt>
                    <dd className="text-sm text-gray-900">{selectedOrder.vendor.phone}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* 交期資訊 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">交期資訊</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">預計交貨日期</dt>
                    <dd className="text-sm font-medium text-gray-900">{selectedOrder.expectedDeliveryDate}</dd>
                  </div>
                  {selectedOrder.actualDeliveryDate && (
                    <div>
                      <dt className="text-sm text-gray-500">實際交貨日期</dt>
                      <dd className="text-sm font-medium text-green-600">{selectedOrder.actualDeliveryDate}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-gray-500">付款條件</dt>
                    <dd className="text-sm text-gray-900">{selectedOrder.paymentTerms}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* 備註 */}
            {selectedOrder.notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">備註</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedOrder.notes}
                </p>
              </div>
            )}

            {/* 審核資訊 */}
            {selectedOrder.approvedBy && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">審核資訊</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">審核者</dt>
                    <dd className="text-sm text-gray-900">{selectedOrder.approvedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">審核時間</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedOrder.approvedAt ? new Date(selectedOrder.approvedAt).toLocaleString('zh-TW') : '-'}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                關閉
              </Button>
              {selectedOrder.status === 'draft' && (
                <>
                  <Button variant="outline">編輯</Button>
                  <Button variant="success">送審</Button>
                </>
              )}
              {selectedOrder.status === 'confirmed' && (
                <Button variant="primary">更新狀態</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}