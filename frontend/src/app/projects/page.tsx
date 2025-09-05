'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import type { Project } from '@/types';

const statusColors = {
  planning: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  planning: '規劃中',
  active: '進行中',
  completed: '已完成',
  cancelled: '已取消',
};

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectManager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateBudgetPercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (confirm(`確定要刪除專案「${project.name}」嗎？`)) {
      try {
        await deleteProject.mutateAsync(project.id);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProject(null);
  };

  const columns = [
    {
      key: 'projectInfo',
      title: '專案資訊',
      render: (value: any, record: Project) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.name}
          </div>
          <div className="text-sm text-gray-500">
            {record.projectCode}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: '狀態',
      render: (value: any, record: Project) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[record.status]}`}>
          {statusLabels[record.status]}
        </span>
      ),
    },
    {
      key: 'budget',
      title: '預算使用',
      render: (value: any, record: Project) => {
        const budgetPercentage = calculateBudgetPercentage(record.usedBudget, record.totalBudget);
        return (
          <div className="text-sm text-gray-900">
            <div>{formatCurrency(record.usedBudget)} / {formatCurrency(record.totalBudget)}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full ${budgetPercentage > 80 ? 'bg-red-500' : budgetPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{budgetPercentage}%</div>
          </div>
        );
      },
    },
    {
      key: 'projectManager',
      title: '負責人',
      render: (value: any, record: Project) => (
        <div className="text-sm text-gray-900">
          {record.projectManager}
        </div>
      ),
    },
    {
      key: 'schedule',
      title: '時程',
      render: (value: any, record: Project) => (
        <div className="text-sm text-gray-900">
          <div>{record.startDate}</div>
          {record.endDate && (
            <div className="text-gray-500">至 {record.endDate}</div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      render: (value: any, record: Project) => (
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900" title="檢視">
            <Eye size={16} />
          </button>
          <button 
            className="text-gray-600 hover:text-gray-900" 
            title="編輯"
            onClick={() => handleEdit(record)}
          >
            <Edit size={16} />
          </button>
          <button 
            className="text-red-600 hover:text-red-900" 
            title="刪除"
            onClick={() => handleDelete(record)}
          >
            <Trash2 size={16} />
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
          <h1 className="text-2xl font-bold text-gray-900">專案管理</h1>
          <p className="text-gray-600 mt-1">管理所有建設專案</p>
        </div>
        <Button
          icon={<Plus size={20} />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          新建專案
        </Button>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋專案名稱、編號或負責人..."
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

      {/* 專案列表 */}
      <DataTable
        data={filteredProjects}
        columns={columns}
        loading={isLoading}
        emptyText="暫無專案資料"
      />

      {/* 新建專案模態視窗 */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新建專案"
        size="lg"
      >
        <ProjectForm
          onSuccess={handleFormSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* 編輯專案模態視窗 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="編輯專案"
        size="lg"
      >
        {selectedProject && (
          <ProjectForm
            project={selectedProject}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}