import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function maskSecret(secret: string): string {
  if (secret.length <= 8) return secret;
  return `${secret.slice(0, 4)}****${secret.slice(-4)}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    assigned: 'bg-indigo-100 text-indigo-800',
    testing: 'bg-purple-100 text-purple-800',
    reviewing: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    available: 'bg-blue-100 text-blue-800',
    applied: 'bg-purple-100 text-purple-800',
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
    unpaid: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    pending: '待处理',
    submitted: '已提交',
    assigned: '已分配',
    testing: '测试中',
    reviewing: '审核中',
    approved: '已通过',
    rejected: '已驳回',
    draft: '草稿',
    available: '可接入',
    applied: '已申请',
    active: '已上线',
    suspended: '已停用',
    unpaid: '待支付',
    paid: '已支付',
    overdue: '已逾期',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭'
  };
  return texts[status] || status;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    account: 'bg-blue-50 text-blue-700 border-blue-200',
    content: 'bg-orange-50 text-orange-700 border-orange-200',
    message: 'bg-green-50 text-green-700 border-green-200',
    data: 'bg-purple-50 text-purple-700 border-purple-200'
  };
  return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
}

export function getCategoryText(category: string): string {
  const texts: Record<string, string> = {
    account: '账号',
    content: '内容',
    message: '消息',
    data: '数据'
  };
  return texts[category] || category;
}