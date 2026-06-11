import { cn } from '@/utils/format';
import {
  Home,
  FileText,
  CheckCircle,
  Grid,
  ClipboardList,
  FlaskConical,
  Rocket,
  Receipt,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: '首页', icon: <Home className="w-20 h-20" /> },
  { path: '/apply', label: '入驻申请', icon: <FileText className="w-20 h-20" /> },
  { path: '/review', label: '资质审核', icon: <CheckCircle className="w-20 h-20" /> },
  { path: '/capabilities', label: '能力广场', icon: <Grid className="w-20 h-20" /> },
  { path: '/tickets', label: '接入工单', icon: <ClipboardList className="w-20 h-20" /> },
  { path: '/sandbox', label: '测试沙箱', icon: <FlaskConical className="w-20 h-20" /> },
  { path: '/acceptance', label: '上线验收', icon: <Rocket className="w-20 h-20" /> },
  { path: '/billing', label: '账单中心', icon: <Receipt className="w-20 h-20" /> },
  { path: '/feedback', label: '服务评价', icon: <MessageSquare className="w-20 h-20" /> }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-64 bottom-0 bg-white border-r border-gray-100',
        'flex flex-col transition-all duration-300 z-30',
        collapsed ? 'w-72' : 'w-240',
        className
      )}
    >
      <nav className="flex-1 py-16 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-12 px-20 py-12 mx-12 rounded-8',
              'transition-all duration-200',
              'hover:bg-[#F7FAFC]',
              isActive
                ? 'bg-[#1E3A5F] text-white hover:bg-[#2C5282]'
                : 'text-gray-600 hover:text-[#1E3A5F]'
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        className={cn(
          'flex items-center justify-center py-12',
          'border-t border-gray-100 hover:bg-gray-50 transition-colors'
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="w-20 h-20 text-gray-500" />
        ) : (
          <ChevronLeft className="w-20 h-20 text-gray-500" />
        )}
      </button>
    </aside>
  );
}