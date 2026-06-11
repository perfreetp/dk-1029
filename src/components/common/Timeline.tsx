import { cn } from '@/utils/format';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import type { TimelineItem as TimelineItemType } from '@/types';
import { formatDateTime } from '@/utils/format';

interface TimelineProps {
  items: TimelineItemType[];
  currentStatus?: string;
  className?: string;
}

export function Timeline({ items, currentStatus, className }: TimelineProps) {
  const getStatusIcon = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return <Clock className="w-20 h-20 text-[#38B2AC]" />;
    }
    
    const completedStatuses = ['submitted', 'assigned', 'testing', 'reviewing', 'approved'];
    if (completedStatuses.includes(status)) {
      return <CheckCircle className="w-20 h-20 text-green-500" />;
    }
    
    return <Circle className="w-20 h-20 text-gray-300" />;
  };

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) return 'bg-[#38B2AC]';
    
    const completedStatuses = ['submitted', 'assigned', 'testing', 'reviewing', 'approved'];
    if (completedStatuses.includes(status)) return 'bg-green-500';
    
    return 'bg-gray-300';
  };

  const statusTexts: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    assigned: '已分配对接人',
    testing: '测试中',
    reviewing: '验收审核中',
    approved: '已通过',
    rejected: '已驳回'
  };

  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => {
        const isCurrent = item.status === currentStatus;
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.id} className="relative flex gap-16 pb-24">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-40 h-40 rounded-full flex items-center justify-center',
                'bg-white border-2',
                isCurrent ? 'border-[#38B2AC]' : 
                index < items.findIndex(i => i.status === currentStatus) ? 'border-green-500' : 'border-gray-300'
              )}>
                {getStatusIcon(item.status, isCurrent)}
              </div>
              {!isLast && (
                <div className={cn(
                  'w-2 flex-1 mt-4',
                  getStatusColor(item.status, isCurrent)
                )} />
              )}
            </div>
            
            <div className="flex-1 pt-4">
              <div className="flex items-center gap-8">
                <span className={cn(
                  'font-medium',
                  isCurrent ? 'text-[#38B2AC]' : 'text-gray-700'
                )}>
                  {statusTexts[item.status] || item.status}
                </span>
                {isCurrent && (
                  <span className="px-8 py-2 bg-[#38B2AC]/10 text-[#38B2AC] text-xs rounded-full">
                    当前状态
                  </span>
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <span>{item.operator}</span>
                <span className="mx-8">·</span>
                <span>{formatDateTime(item.timestamp)}</span>
              </div>
              
              {item.comment && (
                <div className="mt-8 text-sm text-gray-600 bg-gray-50 rounded-6 px-12 py-8">
                  {item.comment}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}