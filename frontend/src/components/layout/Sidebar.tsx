'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FolderOpen, 
  FileSearch, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Package,
  Calendar,
  DollarSign
} from 'lucide-react';

const menuItems = [
  { 
    title: '專案管理', 
    icon: FolderOpen, 
    href: '/projects',
    children: [
      { title: '專案列表', href: '/projects' },
      { title: '預算管理', href: '/projects/budgets' },
      { title: '進度追蹤', href: '/projects/progress' },
    ]
  },
  { 
    title: '詢價管理', 
    icon: FileSearch, 
    href: '/inquiries',
    children: [
      { title: '詢價單', href: '/inquiries' },
      { title: '報價比較', href: '/inquiries/comparison' },
    ]
  },
  { 
    title: '採購管理', 
    icon: ShoppingCart, 
    href: '/purchase-orders',
    children: [
      { title: '採購單', href: '/purchase-orders' },
      { title: '驗收管理', href: '/purchase-orders/receiving' },
    ]
  },
  { 
    title: '基礎資料', 
    icon: Package, 
    href: '/master-data',
    children: [
      { title: '供應商', href: '/vendors' },
      { title: '材料管理', href: '/materials' },
    ]
  },
  { 
    title: '報表分析', 
    icon: BarChart3, 
    href: '/reports',
    children: [
      { title: '成本分析', href: '/reports/cost' },
      { title: '進度報告', href: '/reports/progress' },
      { title: '財務報告', href: '/reports/financial' },
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">發包管理系統</h1>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <div key={item.title} className="mb-2">
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{item.title}</span>
              </Link>
              
              {item.children && isActive && (
                <div className="ml-8 mt-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-4 py-2 text-sm rounded transition-colors ${
                        pathname === child.href
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}