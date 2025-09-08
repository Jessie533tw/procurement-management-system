import { BarChart, FolderOpen, FileSearch, ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">系統總覽</h1>
        <p className="text-gray-600 mt-2">發包管理系統儀表板</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">進行中專案</h3>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileSearch className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">待回覆詢價</h3>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">待確認採購</h3>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">本月預算使用</h3>
              <p className="text-2xl font-bold text-gray-900">78%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="space-y-3">
            <Link href="/projects" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FolderOpen className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium">新建專案</span>
            </Link>
            <Link href="/inquiries" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FileSearch className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium">建立詢價單</span>
            </Link>
            <Link href="/purchase-orders" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-yellow-600 mr-3" />
              <span className="font-medium">新增採購單</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">近期提醒</h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
              <p className="text-sm font-medium text-red-800">A1大樓專案</p>
              <p className="text-xs text-red-600">預算即將超支，請注意控管</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm font-medium text-yellow-800">鋼筋詢價單</p>
              <p className="text-xs text-yellow-600">3家廠商尚未回覆，截止時間明天</p>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm font-medium text-blue-800">水泥採購單</p>
              <p className="text-xs text-blue-600">預計明日交貨，請安排驗收</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
