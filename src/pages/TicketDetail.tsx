import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Timeline } from '@/components/common/Timeline';
import { useTicketStore } from '@/stores/ticketStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ClipboardList,
  User,
  Phone,
  Calendar,
  ArrowRight,
  MessageCircle,
  CheckCircle,
  Rocket
} from 'lucide-react';
import { formatDateTime } from '@/utils/format';

export function TicketDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tickets, updateTicket } = useTicketStore();
  
  const ticket = tickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <Layout>
        <div className="text-center py-80">
          <ClipboardList className="w-64 h-64 text-gray-300 mx-auto mb-24" />
          <h2 className="text-xl font-semibold text-gray-700 mb-12">工单不存在</h2>
          <Button variant="primary" onClick={() => navigate('/tickets')}>
            返回工单列表
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSubmitForReview = async () => {
    await updateTicket(ticket.id, {
      status: 'reviewing',
      timeline: [
        ...ticket.timeline,
        {
          id: `tl-${Date.now()}`,
          status: 'reviewing',
          operator: '张明',
          comment: '联调完成，申请上线验收',
          timestamp: new Date().toISOString()
        }
      ]
    });
  };

  const typeTexts: Record<string, string> = {
    access: '接入申请',
    upgrade: '配额升级',
    maintenance: '维护',
    cancel: '停用'
  };

  return (
    <Layout>
      <div className="max-w-900 mx-auto space-y-24">
        <div className="flex items-center gap-16">
          <Button variant="ghost" onClick={() => navigate('/tickets')}>
            ← 返回工单列表
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">工单详情</h1>
            <p className="text-sm text-gray-500 mt-4">工单编号：{ticket.id}</p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <Card padding="lg">
          <CardHeader title="基本信息" />
          <CardContent>
            <div className="grid grid-cols-2 gap-16">
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">工单编号</div>
                <div className="text-sm font-medium text-[#1E3A5F]">{ticket.id}</div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">能力名称</div>
                <div className="text-sm font-medium text-[#1E3A5F]">{ticket.capabilityName}</div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">工单类型</div>
                <div className="text-sm text-gray-700">{typeTexts[ticket.type] || ticket.type}</div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">创建时间</div>
                <div className="text-sm text-gray-700">{formatDateTime(ticket.createdAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {ticket.assignee && (
          <Card padding="lg">
            <CardHeader title="对接人信息" />
            <CardContent>
              <div className="flex items-center gap-16">
                <img
                  src={ticket.assignee.avatar}
                  alt={ticket.assignee.name}
                  className="w-48 h-48 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-8">
                    <User className="w-16 h-16 text-gray-400" />
                    <span className="text-sm font-medium text-[#1E3A5F]">
                      {ticket.assignee.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-8 mt-8">
                    <Phone className="w-16 h-16 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {ticket.assignee.phone}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={<MessageCircle className="w-16 h-16" />}>
                  联系对接人
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card padding="lg">
          <CardHeader title="工单描述" />
          <CardContent>
            <p className="text-sm text-gray-600">{ticket.description}</p>
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardHeader title="处理进度" />
          <CardContent>
            <Timeline items={ticket.timeline} currentStatus={ticket.status} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-16 border-t border-gray-100">
          <div className="flex items-center gap-12">
            {ticket.status === 'testing' && (
              <Button
                variant="secondary"
                icon={<Rocket className="w-16 h-16" />}
                onClick={() => navigate('/sandbox')}
              >
                进入测试沙箱
              </Button>
            )}
            {ticket.status === 'testing' && (
              <Button
                variant="primary"
                icon={<CheckCircle className="w-16 h-16" />}
                onClick={handleSubmitForReview}
              >
                申请上线验收
              </Button>
            )}
            {ticket.status === 'reviewing' && (
              <div className="flex items-center gap-8 text-sm text-[#38B2AC]">
                <CheckCircle className="w-16 h-16" />
                <span>验收审核中，请等待</span>
              </div>
            )}
            {ticket.status === 'approved' && (
              <div className="flex items-center gap-8 text-sm text-green-600">
                <CheckCircle className="w-16 h-16" />
                <span>验收已通过，能力已上线</span>
              </div>
            )}
          </div>
          <Button variant="ghost" onClick={() => navigate('/tickets')}>
            返回列表
          </Button>
        </div>
      </div>
    </Layout>
  );
}