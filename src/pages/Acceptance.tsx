import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Input, TextArea } from '@/components/common/Input';
import { useTicketStore } from '@/stores/ticketStore';
import { useState } from 'react';
import {
  Rocket,
  CheckCircle,
  AlertTriangle,
  Server,
  Link as LinkIcon,
  Shield,
  Clock,
  FileText,
  ArrowRight
} from 'lucide-react';

const checklistItems = [
  { id: '1', name: '接口联调完成', description: '所有接口均已通过联调测试', required: true },
  { id: '2', name: '错误处理完善', description: '异常情况和错误码处理完善', required: true },
  { id: '3', name: '性能测试通过', description: '接口响应时间符合预期', required: true },
  { id: '4', name: '安全配置正确', description: 'HTTPS、签名验证等配置正确', required: true },
  { id: '5', name: '日志记录完整', description: '关键操作日志记录完整', required: false },
  { id: '6', name: '文档齐全', description: '接入文档和说明文档齐全', required: false }
];

export function Acceptance() {
  const { tickets } = useTicketStore();
  const testingTicket = tickets.find(t => t.status === 'testing');
  
  const [formData, setFormData] = useState({
    serverUrl: '',
    callbackUrl: '',
    ipWhitelist: ''
  });
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleCheckItem = (itemId: string) => {
    if (checkedItems.includes(itemId)) {
      setCheckedItems(checkedItems.filter(id => id !== itemId));
    } else {
      setCheckedItems([...checkedItems, itemId]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const allRequiredChecked = checklistItems
    .filter(item => item.required)
    .every(item => checkedItems.includes(item.id));

  if (!testingTicket) {
    return (
      <Layout>
        <div className="max-w-600 mx-auto text-center py-80">
          <Rocket className="w-64 h-64 text-gray-300 mx-auto mb-24" />
          <h2 className="text-xl font-semibold text-gray-700 mb-12">暂无验收工单</h2>
          <p className="text-sm text-gray-400 mb-32">
            您当前没有需要验收的工单，请先完成测试联调
          </p>
          <Button variant="primary" onClick={() => navigate('/sandbox')}>
            进入测试沙箱
          </Button>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-600 mx-auto">
          <Card padding="lg" className="bg-green-50 border-green-200">
            <div className="flex items-center gap-16 mb-24">
              <CheckCircle className="w-48 h-48 text-green-500" />
              <div>
                <div className="text-lg font-semibold text-green-700">验收申请已提交</div>
                <div className="text-sm text-green-600 mt-4">
                  请等待平台审核，审核结果将通过邮件通知您
                </div>
              </div>
            </div>
            <div className="space-y-12 text-sm text-green-600">
              <div className="flex items-center gap-8">
                <Clock className="w-16 h-16" />
                <span>预计审核时间：1-3个工作日</span>
              </div>
              <div className="flex items-center gap-8">
                <FileText className="w-16 h-16" />
                <span>工单编号：{testingTicket.id}</span>
              </div>
            </div>
            <Button
              variant="primary"
              className="mt-24"
              onClick={() => navigate('/tickets')}
            >
              返回工单列表
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-800 mx-auto">
        <div className="mb-32">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">上线验收</h1>
          <p className="text-sm text-gray-500 mt-4">
            工单 {testingTicket.id} - {testingTicket.capabilityName}
          </p>
        </div>

        <Card padding="lg" className="mb-24">
          <CardHeader title="生产环境配置" />
          <CardContent>
            <div className="space-y-16">
              <Input
                label="生产服务器地址"
                placeholder="https://your-production-server.com"
                required
                icon={<Server className="w-16 h-16" />}
                value={formData.serverUrl}
                onChange={(e) => setFormData({ ...formData, serverUrl: e.target.value })}
              />
              <Input
                label="回调地址"
                placeholder="https://your-domain.com/callback"
                required
                icon={<LinkIcon className="w-16 h-16" />}
                value={formData.callbackUrl}
                onChange={(e) => setFormData({ ...formData, callbackUrl: e.target.value })}
              />
              <Input
                label="IP白名单"
                placeholder="多个IP用逗号分隔，如：192.168.1.1,192.168.1.2"
                icon={<Shield className="w-16 h-16" />}
                value={formData.ipWhitelist}
                onChange={(e) => setFormData({ ...formData, ipWhitelist: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card padding="lg" className="mb-24">
          <CardHeader title="验收标准清单" />
          <CardContent>
            <div className="space-y-12">
              {checklistItems.map(item => (
                <div
                  key={item.id}
                  className={`
                    flex items-start gap-16 p-16 rounded-8 border
                    transition-all duration-200
                    ${checkedItems.includes(item.id)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-100 hover:border-gray-200'
                    }
                  `}
                  onClick={() => handleCheckItem(item.id)}
                >
                  <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center mt-4
                    ${checkedItems.includes(item.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {checkedItems.includes(item.id) && (
                      <CheckCircle className="w-16 h-16" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-8">
                      <span className="text-sm font-medium text-[#1E3A5F]">{item.name}</span>
                      {item.required && (
                        <span className="px-8 py-2 bg-red-100 text-red-600 text-xs rounded-4">
                          必选
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {!allRequiredChecked && (
              <div className="flex items-center gap-8 p-16 bg-yellow-50 rounded-8 mt-16">
                <AlertTriangle className="w-16 h-16 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  请完成所有必选检查项后提交验收申请
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardHeader title="验收申请说明" />
          <CardContent>
            <TextArea
              placeholder="请描述您的上线准备情况、注意事项等"
              rows={4}
            />
          </CardContent>
          
          <div className="flex items-center justify-end gap-12 pt-24 border-t border-gray-100">
            <Button variant="outline" onClick={() => navigate('/sandbox')}>
              返回测试沙箱
            </Button>
            <Button
              variant="primary"
              icon={<Rocket className="w-16 h-16" />}
              onClick={handleSubmit}
              disabled={!allRequiredChecked || !formData.serverUrl || !formData.callbackUrl}
            >
              提交验收申请
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

import { useNavigate } from 'react-router-dom';