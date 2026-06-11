import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Table } from '@/components/common/Table';
import { Progress, CircularProgress } from '@/components/common/Progress';
import { Modal } from '@/components/common/Modal';
import { useBillStore } from '@/stores/dataStore';
import { useCapabilityStore } from '@/stores/capabilityStore';
import { useState } from 'react';
import {
  Receipt,
  CreditCard,
  TrendingUp,
  Download,
  RefreshCw,
  Power,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { formatDateTime, formatCurrency } from '@/utils/format';
import type { Bill } from '@/types';

export function Billing() {
  const { bills, quotaData, payBill, renewHistory } = useBillStore();
  const { capabilities, renewCapability, suspendCapability } = useCapabilityStore();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [renewPeriod, setRenewPeriod] = useState(1);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);

  const unpaidBills = bills.filter(b => b.status === 'unpaid' || b.status === 'overdue');
  const totalAmount = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const handlePay = async (billId: string) => {
    await payBill(billId);
    setSelectedBill(null);
  };

  const handleRenew = () => {
    if (selectedCapabilityId) {
      renewCapability(selectedCapabilityId, renewPeriod);
      setShowRenewModal(false);
    }
  };

  const handleSuspend = () => {
    if (selectedCapabilityId) {
      suspendCapability(selectedCapabilityId);
      setShowSuspendModal(false);
    }
  };

  const openRenewModal = (capabilityId: string) => {
    setSelectedCapabilityId(capabilityId);
    setShowRenewModal(true);
  };

  const openSuspendModal = (capabilityId: string) => {
    setSelectedCapabilityId(capabilityId);
    setShowSuspendModal(true);
  };

  const columns = [
    {
      key: 'period',
      title: '账单周期',
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
      key: 'quota',
      title: '配额',
      render: (_, record) => {
        const bill = record as Bill;
        return (
          <span className="text-sm text-gray-600">
            {bill.usedQuota.toLocaleString()} / {bill.quota.toLocaleString()}
          </span>
        );
      }
    },
    {
      key: 'amount',
      title: '金额',
      align: 'right' as const,
      render: (value: unknown) => (
        <span className="text-sm font-medium text-[#1E3A5F]">
          {formatCurrency(Number(value))}
        </span>
      )
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
      align: 'right' as const,
      render: (_, record) => {
        const bill = record as Bill;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedBill(bill)}
          >
            查看详情
          </Button>
        );
      }
    }
  ];

  return (
    <Layout>
      <div className="space-y-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">账单中心</h1>
            <p className="text-sm text-gray-500 mt-4">管理配额和账单支付</p>
          </div>
          <Button variant="outline" icon={<Download className="w-16 h-16" />}>
            导出账单
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-16">
          <Card padding="md">
            <div className="flex items-center gap-16">
              <div className="w-48 h-48 rounded-12 bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-24 h-24 text-blue-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400">已上线能力</div>
                <div className="text-xl font-bold text-[#1E3A5F]">
                  {capabilities.filter(c => c.status === 'active').length}
                </div>
              </div>
            </div>
          </Card>
          
          <Card padding="md">
            <div className="flex items-center gap-16">
              <div className="w-48 h-48 rounded-12 bg-green-50 flex items-center justify-center">
                <Receipt className="w-24 h-24 text-green-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400">本月总配额</div>
                <div className="text-xl font-bold text-[#1E3A5F]">
                  {quotaData.reduce((sum, q) => sum + q.quota, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
          
          <Card padding="md">
            <div className="flex items-center gap-16">
              <div className="w-48 h-48 rounded-12 bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-24 h-24 text-purple-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400">本月已使用</div>
                <div className="text-xl font-bold text-[#1E3A5F]">
                  {quotaData.reduce((sum, q) => sum + q.used, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
          
          <Card padding="md">
            <div className="flex items-center gap-16">
              <div className="w-48 h-48 rounded-12 bg-yellow-50 flex items-center justify-center">
                <CreditCard className="w-24 h-24 text-yellow-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400">待支付金额</div>
                <div className="text-xl font-bold text-[#E53E3E]">
                  {formatCurrency(totalAmount)}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card padding="lg">
          <CardHeader title="配额概览" />
          <CardContent>
            <div className="grid grid-cols-3 gap-24">
              {capabilities.filter(cap => 
                cap.status === 'active' || 
                cap.status === 'applied' || 
                cap.status === 'suspended'
              ).map((cap) => {
                const quota = quotaData.find(q => q.capabilityId === cap.id);
                const used = quota?.used || 0;
                const total = quota?.quota || cap.quota;
                const latestRenew = renewHistory.find(r => r.capabilityId === cap.id);
                
                return (
                  <div key={cap.id} className={`p-16 rounded-12 relative ${cap.status === 'suspended' ? 'bg-gray-100' : 'bg-[#F7FAFC]'}`}>
                    {latestRenew && (
                      <div className="absolute top-8 right-8 px-8 py-4 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-4">
                        <CheckCircle className="w-12 h-12" />
                        续费{latestRenew.period}个月
                      </div>
                    )}
                    {cap.status === 'suspended' && !latestRenew && (
                      <div className="absolute top-8 right-8 px-8 py-4 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-4">
                        <AlertTriangle className="w-12 h-12" />
                        已停用
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-16">
                      <span className="text-sm font-medium text-[#1E3A5F]">{cap.name}</span>
                      <StatusBadge status={cap.status} />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                      <CircularProgress
                        value={used}
                        max={total}
                        size={60}
                        strokeWidth={6}
                      />
                    </div>
                    <div className="space-y-4 mb-16">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">已使用</span>
                        <span className="text-gray-600">{used.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">总配额</span>
                        <span className="text-gray-600">{total.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">剩余</span>
                        <span className="text-[#38B2AC]">{(total - used).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<RefreshCw className="w-14 h-14" />}
                        onClick={() => openRenewModal(cap.id)}
                      >
                        {cap.status === 'suspended' ? '重新激活' : '续费'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Power className="w-14 h-14" />}
                        onClick={() => openSuspendModal(cap.id)}
                        disabled={cap.status === 'suspended'}
                      >
                        停用
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardHeader
            title="账单明细"
            action={
              <div className="flex items-center gap-8">
                <select className="h-32 px-12 text-sm rounded-6 border border-gray-200">
                  <option value="all">全部状态</option>
                  <option value="unpaid">待支付</option>
                  <option value="paid">已支付</option>
                  <option value="overdue">已逾期</option>
                </select>
              </div>
            }
          />
          <CardContent>
            <Table columns={columns} data={bills} rowKey="id" />
          </CardContent>
        </Card>
      </div>

      <Modal
        open={selectedBill !== null}
        onClose={() => setSelectedBill(null)}
        title="账单详情"
        width="md"
        footer={
          selectedBill?.status === 'unpaid' || selectedBill?.status === 'overdue' ? (
            <Button
              variant="primary"
              icon={<CreditCard className="w-16 h-16" />}
              onClick={() => handlePay(selectedBill!.id)}
            >
              立即支付
            </Button>
          ) : null
        }
      >
        {selectedBill && (
          <div className="space-y-16">
            <div className="grid grid-cols-2 gap-16">
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">账单周期</div>
                <div className="text-sm font-medium text-[#1E3A5F]">{selectedBill.period}</div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">能力名称</div>
                <div className="text-sm font-medium text-[#1E3A5F]">{selectedBill.capabilityName}</div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">配额使用</div>
                <div className="text-sm text-gray-700">
                  {selectedBill.usedQuota.toLocaleString()} / {selectedBill.quota.toLocaleString()}
                </div>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">账单金额</div>
                <div className="text-lg font-bold text-[#1E3A5F]">
                  {formatCurrency(selectedBill.amount)}
                </div>
              </div>
            </div>
            
            <div className="p-16 bg-gray-50 rounded-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">支付状态</span>
                <StatusBadge status={selectedBill.status} />
              </div>
              {selectedBill.paidAt && (
                <div className="mt-8 text-xs text-gray-400">
                  支付时间：{formatDateTime(selectedBill.paidAt)}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showRenewModal}
        onClose={() => setShowRenewModal(false)}
        title="续费能力"
        width="sm"
        footer={
          <Button variant="primary" onClick={handleRenew}>
            确认续费
          </Button>
        }
      >
        <div className="space-y-16">
          <div className="text-sm text-gray-600">
            请选择续费周期：
          </div>
          <div className="grid grid-cols-3 gap-12">
            {[1, 3, 6].map(month => (
              <button
                key={month}
                className={`
                  p-16 rounded-8 border-2 text-center
                  ${renewPeriod === month
                    ? 'border-[#38B2AC] bg-[#38B2AC]/10'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setRenewPeriod(month)}
              >
                <div className="text-sm font-medium text-[#1E3A5F]">{month} 个月</div>
                <div className="text-xs text-gray-400 mt-4">
                  ¥{800 * month}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        title="停用能力"
        width="sm"
        footer={
          <Button variant="danger" onClick={handleSuspend}>
            确认停用
          </Button>
        }
      >
        <div className="space-y-16">
          <div className="flex items-center gap-12 p-16 bg-red-50 rounded-8">
            <AlertTriangle className="w-20 h-20 text-red-500" />
            <div className="text-sm text-red-700">
              停用后将无法继续使用该能力，请谨慎操作
            </div>
          </div>
          <div className="text-sm text-gray-600">
            请选择停用原因：
          </div>
          <select className="w-full h-40 px-16 text-sm rounded-6 border border-gray-200">
            <option value="">请选择原因</option>
            <option value="cost">成本控制</option>
            <option value="unused">不再使用</option>
            <option value="switch">切换其他方案</option>
            <option value="other">其他原因</option>
          </select>
        </div>
      </Modal>
    </Layout>
  );
}