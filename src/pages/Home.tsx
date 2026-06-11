import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Progress } from '@/components/common/Progress';
import { StatusBadge } from '@/components/common/Badge';
import { useCapabilityStore } from '@/stores/capabilityStore';
import { useTicketStore } from '@/stores/ticketStore';
import { useBillStore } from '@/stores/dataStore';
import { Link } from 'react-router-dom';
import {
  Rocket,
  ClipboardList,
  Receipt,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { formatDateTime } from '@/utils/format';

export function Home() {
  const { capabilities } = useCapabilityStore();
  const { tickets } = useTicketStore();
  const { quotaData } = useBillStore();

  const activeCapabilities = capabilities.filter(c => c.status === 'active');
  const pendingTickets = tickets.filter(t => t.status !== 'approved' && t.status !== 'rejected');
  const testingTicket = tickets.find(t => t.status === 'testing');

  const stats = [
    {
      label: '已上线能力',
      value: activeCapabilities.length,
      icon: <CheckCircle className="w-24 h-24 text-green-500" />,
      color: 'bg-green-50'
    },
    {
      label: '待处理工单',
      value: pendingTickets.length,
      icon: <ClipboardList className="w-24 h-24 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      label: '本月调用',
      value: '45,680',
      icon: <TrendingUp className="w-24 h-24 text-purple-500" />,
      color: 'bg-purple-50'
    },
    {
      label: '服务评分',
      value: '4.8',
      icon: <Zap className="w-24 h-24 text-yellow-500" />,
      color: 'bg-yellow-50'
    }
  ];

  const quickActions = [
    {
      title: '浏览能力广场',
      description: '查看可接入的平台能力',
      icon: <Rocket className="w-32 h-32" />,
      path: '/capabilities',
      color: 'text-[#38B2AC]'
    },
    {
      title: '创建接入工单',
      description: '申请接入新的平台能力',
      icon: <ClipboardList className="w-32 h-32" />,
      path: '/tickets/create',
      color: 'text-[#1E3A5F]'
    },
    {
      title: '查看账单明细',
      description: '管理配额和支付账单',
      icon: <Receipt className="w-32 h-32" />,
      path: '/billing',
      color: 'text-[#E53E3E]'
    },
    {
      title: '提交问题反馈',
      description: '反馈使用问题或建议',
      icon: <Users className="w-32 h-32" />,
      path: '/feedback',
      color: 'text-[#ED8936]'
    }
  ];

  return (
    <Layout>
      <div className="space-y-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">欢迎回来，张明</h1>
            <p className="text-sm text-gray-500 mt-4">今天是 {formatDateTime(new Date())}</p>
          </div>
          <Link to="/capabilities">
            <Button variant="primary" icon={<Rocket className="w-16 h-16" />}>
              接入新能力
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-16">
          {stats.map((stat, index) => (
            <Card key={index} padding="md">
              <div className="flex items-center gap-16">
                <div className={`w-48 h-48 rounded-12 ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#1E3A5F]">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {testingTicket && (
          <Card padding="lg">
            <CardHeader
              title="当前进行中的工单"
              subtitle="您有工单正在测试阶段，请尽快完成联调"
              action={
                <Link to={`/tickets/${testingTicket.id}`}>
                  <Button variant="outline" size="sm">
                    查看详情
                  </Button>
                </Link>
              }
            />
            <CardContent>
              <div className="flex items-center gap-16 p-16 bg-[#F7FAFC] rounded-8">
                <div className="flex-1">
                  <div className="flex items-center gap-8">
                    <span className="font-medium text-[#1E3A5F]">{testingTicket.capabilityName}</span>
                    <StatusBadge status={testingTicket.status} />
                  </div>
                  <div className="text-sm text-gray-500 mt-4">
                    创建时间：{formatDateTime(testingTicket.createdAt)}
                  </div>
                </div>
                <Link to="/sandbox">
                  <Button variant="secondary" icon={<ArrowRight className="w-16 h-16" />}>
                    进入测试沙箱
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-24">
          <Card padding="lg">
            <CardHeader title="配额使用情况" />
            <CardContent>
              <div className="space-y-16">
                {quotaData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-xs text-gray-500">
                        {item.used.toLocaleString()} / {item.quota.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={item.used}
                      max={item.quota}
                      showLabel={false}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card padding="lg">
            <CardHeader title="快速操作" />
            <CardContent>
              <div className="grid grid-cols-2 gap-12">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className="flex items-center gap-12 p-16 rounded-8 border border-gray-100 hover:border-[#38B2AC] hover:bg-[#F7FAFC] transition-all"
                  >
                    <div className={action.color}>{action.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-[#1E3A5F]">{action.title}</div>
                      <div className="text-xs text-gray-400">{action.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card padding="lg">
          <CardHeader
            title="最近工单"
            action={
              <Link to="/tickets">
                <Button variant="ghost" size="sm">
                  查看全部
                </Button>
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-12">
              {[...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-12 rounded-8 hover:bg-[#F7FAFC] transition-colors"
                >
                  <div className="flex items-center gap-12">
                    <div className="w-40 h-40 rounded-8 bg-[#F7FAFC] flex items-center justify-center">
                      <ClipboardList className="w-20 h-20 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{ticket.capabilityName}</div>
                      <div className="text-xs text-gray-400">{ticket.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-16">
                    <StatusBadge status={ticket.status} />
                    <span className="text-xs text-gray-400">{formatDateTime(ticket.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}