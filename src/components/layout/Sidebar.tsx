import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  CreditCard, 
  Receipt,
  UserCog
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { RoleGuard } from '../auth/RoleGuard';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
  { name: 'العملاء', href: '/clients', icon: Users },
  { name: 'المشاريع', href: '/projects', icon: FolderOpen },
  { name: 'العقود', href: '/contracts', icon: FileText },
  { name: 'المدفوعات', href: '/payments', icon: CreditCard },
  { name: 'الفواتير', href: '/invoices', icon: Receipt },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gray-900 text-white w-64 min-h-screen flex flex-col
        ${/* Desktop: always visible */ ''}
        lg:relative lg:translate-x-0
        ${/* Mobile: slide in/out */ ''}
        lg:hidden:fixed lg:hidden:z-50
        ${isOpen ? 'fixed z-50 translate-x-0' : 'fixed z-50 -translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">نكاز CRM</h1>
          <p className="text-gray-400 text-sm mt-2">خدمات المصاعد</p>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 ml-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              </li>
            ))}
            
            {/* Users management - Admin only */}
            <RoleGuard allowedRoles={['admin']}>
              <li>
                <NavLink
                  to="/users"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <UserCog className="w-5 h-5 ml-3 flex-shrink-0" />
                  <span className="truncate">إدارة المستخدمين</span>
                </NavLink>
              </li>
            </RoleGuard>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="mr-3 min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role === 'admin' ? 'مدير' : user?.role === 'supervisor' ? 'مشرف' : 'مستخدم'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}