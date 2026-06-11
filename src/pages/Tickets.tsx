import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { Timeline } from '@/components/common/Timeline';
import { useTicketStore } from '@/stores/ticketStore';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ClipboardList,
  User,
  Phone,
  Calendar,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { formatDateTime } from '@/utils/format';
import type { Ticket } from '@/types';

export function Tickets() {
  const navigate = useNavigate();
  const { tickets } = useTicketStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSearch = ticket.capabilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'id',
      title: '工单编号',
      width: '180px',
      render: (value: unknown) => (
        <span className="text-sm font-medium text-[#1E3A5F]">{String(value)}</span>
      )
    },
    {
      key: 'capabilityName',
      title: '能力名称',
      render: (value: unknown) => (
        <span className="text-sm text-gray-700">{String(value)}</span>
      )
    },
    {
      key: 'type',
      title: '类型',
      render: (value: unknown) => {
        const typeTexts: Record<string, string> = {
          access: '接入申请',
          upgrade: '配额升级',
          maintenance: '维护',
          cancel: '停用'
        };
        return (
          <span className="text-sm text-gray-600">{typeTexts[String(value) as string] || String(value)}</span>
        );
      }
    },
    {
      key: 'status',
      title: '状态',
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    {
      key: 'createdAt',
      title: '创建时间',
      render: (value: unknown) => (
        <span className="text-sm text-gray-400">{formatDateTime(String(value))}</span>
      )
    },
    {
      key: 'actions',
      title: '操作',
      align: 'right',
      render: (_, record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedTicket(record as Ticket)}
        >
          查看详情
        </Button>
      )
    }
  ];

  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'draft', label: '草稿' },
    { value: 'submitted', label: '已提交' },
    { value: 'assigned', label: '已分配' },
    { value: 'testing', label: '测试中' },
    { value: 'reviewing', label: '审核中' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已驳回' }
  ];

  return (
    <Layout>
      <div className="space-y-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">接入工单</h1>
            <p className="text-sm text-gray-500 mt-4">管理能力接入工单</p>
          </div>
          <Link to="/tickets/create">
            <Button variant="primary" icon={<Plus className="w-16 h-16" />}>
              创建工单
            </Button>
          </Link>
        </div>

        <Card padding="md">
          <div className="flex items-center gap-16">
            <div className="flex-1 relative">
              <Search className="absolute left-12 top-1/2 -translate-y-1/2 w-16 h-16 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工单编号或能力名称"
                className="w-full h-40 pl-40 pr-16 text-sm rounded-8 border border-gray-200 focus:border-[#38B2AC]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="h-40 px-16 text-sm rounded-8 border border-gray-200 focus:border-[#38B2AC]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </Card>

        <Table
          columns={columns}
          data={filteredTickets}
          rowKey="id"
          onRowClick={(record) => setSelectedTicket(record)}
        />
      </div>

      <Modal
        open={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        title="工单详情"
        width="lg"
      >
        {selectedTicket && (
          <div className="space-y-24">
            <div className="grid grid-cols-2 gap-16">
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">工单编号</div>
                <div className="text-sm font-medium text-[#1E3A5F]">{selectedTicket.id}</div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">能力名称</div>
                <div className="text-sm font-medium text-[#1E3A5F]">{selectedTicket.capabilityName}</div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">工单类型</div>
                <div className="text-sm text-gray-700">
                  {selectedTicket.type === 'access' ? '接入申请' : selectedTicket.type}
                </div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">当前状态</div>
                <StatusBadge status={selectedTicket.status} />
              </div>
            </div>

            {selectedTicket.assignee && (
              <Card padding="md">
                <CardHeader title="对接人信息" />
                <CardContent>
                  <div className="flex items-center gap-16">
                    <img
                      src={selectedTicket.assignee.avatar}
                      alt={selectedTicket.assignee.name}
                      className="w-48 h-48 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-8">
                        <User className="w-16 h-16 text-gray-400" />
                        <span className="text-sm font-medium text-[#1E3A5F]">
                          {selectedTicket.assignee.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-8 mt-8">
                        <Phone className="w-16 h-16 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedTicket.assignee.phone}
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

            <Card padding="md">
              <CardHeader title="工单描述" />
              <CardContent>
                <p className="text-sm text-gray-600">{selectedTicket.description}</p>
              </CardContent>
            </Card>

            <Card padding="md">
              <CardHeader title="处理进度" />
              <CardContent>
                <Timeline items={selectedTicket.timeline} currentStatus={selectedTicket.status} />
              </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-16 border-t border-gray-100">
              <div className="flex items-center gap-8 text-sm text-gray-400">
                <Calendar className="w-16 h-16" />
                <span>创建时间：{formatDateTime(selectedTicket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-12">
                {selectedTicket.status === 'testing' && (
                  <Button
                    variant="secondary"
                    icon={<ArrowRight className="w-16 h-16" />}
                    onClick={() => navigate('/sandbox')}
                  >
                    进入测试沙箱
                  </Button>
                )}
                {selectedTicket.status === 'testing' && (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/acceptance')}
                  >
                    申请验收
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}