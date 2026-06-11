import { cn } from '@/utils/format';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };

  const sizes = {
    sm: 'px-8 py-2 text-xs',
    md: 'px-12 py-4 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<string, { color: string; text: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700', text: '待处理' },
    submitted: { color: 'bg-blue-100 text-blue-700', text: '已提交' },
    assigned: { color: 'bg-indigo-100 text-indigo-700', text: '已分配' },
    testing: { color: 'bg-purple-100 text-purple-700', text: '测试中' },
    reviewing: { color: 'bg-orange-100 text-orange-700', text: '审核中' },
    approved: { color: 'bg-green-100 text-green-700', text: '已通过' },
    rejected: { color: 'bg-red-100 text-red-700', text: '已驳回' },
    draft: { color: 'bg-gray-100 text-gray-700', text: '草稿' },
    available: { color: 'bg-blue-100 text-blue-700', text: '可接入' },
    applied: { color: 'bg-purple-100 text-purple-700', text: '已申请' },
    active: { color: 'bg-green-100 text-green-700', text: '已上线' },
    suspended: { color: 'bg-red-100 text-red-700', text: '已停用' },
    unpaid: { color: 'bg-yellow-100 text-yellow-700', text: '待支付' },
    paid: { color: 'bg-green-100 text-green-700', text: '已支付' },
    overdue: { color: 'bg-red-100 text-red-700', text: '已逾期' },
    processing: { color: 'bg-blue-100 text-blue-700', text: '处理中' },
    resolved: { color: 'bg-green-100 text-green-700', text: '已解决' },
    closed: { color: 'bg-gray-100 text-gray-700', text: '已关闭' }
  };

  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700', text: status };

  return (
    <span
      className={cn(
        'inline-flex items-center px-8 py-2 rounded-full text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.text}
    </span>
  );
}

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const categoryConfig: Record<string, { color: string; text: string }> = {
    account: { color: 'bg-blue-50 text-blue-700 border border-blue-200', text: '账号' },
    content: { color: 'bg-orange-50 text-orange-700 border border-orange-200', text: '内容' },
    message: { color: 'bg-green-50 text-green-700 border border-green-200', text: '消息' },
    data: { color: 'bg-purple-50 text-purple-700 border border-purple-200', text: '数据' }
  };

  const config = categoryConfig[category] || { color: 'bg-gray-50 text-gray-700 border border-gray-200', text: category };

  return (
    <span
      className={cn(
        'inline-flex items-center px-8 py-2 rounded-4 text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.text}
    </span>
  );
}