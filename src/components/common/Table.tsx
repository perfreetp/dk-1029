import { cn } from '@/utils/format';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  title: string;
  width?: string;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (record: T) => void;
  className?: string;
  rowKey?: string;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyText = '暂无数据',
  onRowClick,
  className,
  rowKey = 'id',
  pagination
}: TableProps<T>) {
  if (loading) {
    return (
      <div className={cn('bg-white rounded-8 overflow-hidden', className)}>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-100" />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-56 bg-gray-50 border-b border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-8 overflow-hidden border border-gray-100', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7FAFC] border-b border-gray-200">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-16 py-12 text-sm font-semibold text-[#1E3A5F]',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.width
                  )}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-16 py-32 text-center text-gray-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={String(record[rowKey])}
                  className={cn(
                    'border-b border-gray-100 hover:bg-[#F7FAFC] transition-colors',
                    index % 2 === 1 && 'bg-gray-50/50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(record)}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-16 py-14 text-sm text-gray-600',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
                    >
                      {col.render
                        ? col.render(record[col.key], record, index)
                        : String(record[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between px-16 py-12 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            共 {pagination.total} 条，第 {pagination.current} 页
          </span>
          <div className="flex items-center gap-8">
            <button
              className="p-8 rounded-4 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.current === 1}
              onClick={() => pagination.onChange(pagination.current - 1)}
            >
              <ChevronLeft className="w-16 h-16" />
            </button>
            <span className="text-sm text-gray-600">
              {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              className="p-8 rounded-4 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.current + 1)}
            >
              <ChevronRight className="w-16 h-16" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}