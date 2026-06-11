import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Input, TextArea, Select } from '@/components/common/Input';
import { UploadComponent } from '@/components/common/Upload';
import { useTicketStore } from '@/stores/ticketStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  FlaskConical,
  Copy,
  Download,
  Play,
  Send,
  CheckCircle,
  Clock,
  Key,
  User,
  Server,
  AlertTriangle
} from 'lucide-react';
import { formatDateTime, maskSecret } from '@/utils/format';
import { mockTestParams } from '@/mock/data';

export function Sandbox() {
  const navigate = useNavigate();
  const { tickets } = useTicketStore();
  const testingTicket = tickets.find(t => t.status === 'testing');
  
  const [testRequest, setTestRequest] = useState({
    method: 'POST',
    path: '/api/v1/content/text/scan',
    headers: { 'Content-Type': 'application/json' },
    body: { text: '这是一段测试文本', type: 'sensitive' }
  });
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);
  const [resultDescription, setResultDescription] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/sandbox/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testRequest)
      });
      const data = await response.json();
      setTestResponse(data);
    } catch (error) {
      setTestResponse({
        status: 500,
        body: { error: '请求失败' },
        duration: 0
      });
    }
    setTesting(false);
  };

  const handleSubmitResult = () => {
    navigate('/acceptance');
  };

  if (!testingTicket) {
    return (
      <Layout>
        <div className="max-w-600 mx-auto text-center py-80">
          <FlaskConical className="w-64 h-64 text-gray-300 mx-auto mb-24" />
          <h2 className="text-xl font-semibold text-gray-700 mb-12">暂无测试工单</h2>
          <p className="text-sm text-gray-400 mb-32">
            您当前没有处于测试阶段的工单，请先创建接入工单
          </p>
          <Button variant="primary" onClick={() => navigate('/tickets/create')}>
            创建工单
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">测试沙箱</h1>
            <p className="text-sm text-gray-500 mt-4">
              工单 {testingTicket.id} - {testingTicket.capabilityName}
            </p>
          </div>
          <StatusBadge status={testingTicket.status} />
        </div>

        <div className="grid grid-cols-2 gap-24">
          <Card padding="lg">
            <CardHeader title="测试环境信息" />
            <CardContent>
              <div className="space-y-16">
                <div className="p-16 bg-[#F7FAFC] rounded-8">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs text-gray-400">沙箱环境地址</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Copy className="w-14 h-14" />}
                      onClick={() => handleCopy(mockTestParams.sandboxUrl)}
                    >
                      复制
                    </Button>
                  </div>
                  <div className="text-sm font-medium text-[#1E3A5F]">
                    {mockTestParams.sandboxUrl}
                  </div>
                </div>

                <div className="flex items-center gap-16 p-16 bg-yellow-50 rounded-8">
                  <Clock className="w-20 h-20 text-yellow-600" />
                  <div>
                    <div className="text-sm text-yellow-700">有效期</div>
                    <div className="text-xs text-yellow-600">
                      至 {formatDateTime(mockTestParams.expiresAt)}
                    </div>
                  </div>
                </div>

                <div className="p-16 bg-blue-50 rounded-8">
                  <div className="text-sm text-blue-700 mb-8">调用限制说明</div>
                  <ul className="text-xs text-blue-600 space-y-4">
                    <li>• 每分钟最多 100 次调用</li>
                    <li>• 每天最多 10000 次调用</li>
                    <li>• 测试数据仅用于验证，不会影响生产环境</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card padding="lg">
            <CardHeader 
              title="测试参数"
              action={
                <Button variant="outline" size="sm" icon={<Download className="w-14 h-14" />}>
                  下载参数
                </Button>
              }
            />
            <CardContent>
              <div className="space-y-12">
                <div className="flex items-center justify-between p-12 bg-gray-50 rounded-8">
                  <div className="flex items-center gap-12">
                    <Key className="w-16 h-16 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-400">AppID</div>
                      <div className="text-sm text-gray-700">{mockTestParams.appId}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(mockTestParams.appId)}
                  >
                    <Copy className="w-14 h-14" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-12 bg-gray-50 rounded-8">
                  <div className="flex items-center gap-12">
                    <Key className="w-16 h-16 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-400">AppSecret</div>
                      <div className="text-sm text-gray-700">{maskSecret(mockTestParams.appSecret)}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(mockTestParams.appSecret)}
                  >
                    <Copy className="w-14 h-14" />
                  </Button>
                </div>

                <div className="p-12 bg-gray-50 rounded-8">
                  <div className="flex items-center gap-12 mb-12">
                    <User className="w-16 h-16 text-gray-500" />
                    <span className="text-xs text-gray-400">测试账号</span>
                  </div>
                  <div className="space-y-8">
                    {mockTestParams.testAccounts.map(account => (
                      <div key={account.id} className="flex items-center gap-8 text-sm">
                        <span className="text-gray-600">{account.username}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">{account.password}</span>
                        <span className={`
                          px-8 py-2 rounded-4 text-xs
                          ${account.type === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                        `}>
                          {account.type === 'admin' ? '管理员' : '普通用户'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-8 p-12 bg-red-50 rounded-8">
                  <AlertTriangle className="w-16 h-16 text-red-500" />
                  <span className="text-xs text-red-600">
                    请妥善保管测试参数，切勿泄露给他人
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card padding="lg">
          <CardHeader title="接口联调工具" />
          <CardContent>
            <div className="grid grid-cols-2 gap-24">
              <div>
                <div className="text-sm font-medium text-[#1E3A5F] mb-12">请求构造</div>
                <div className="space-y-12">
                  <Select
                    label="请求方法"
                    options={[
                      { value: 'GET', label: 'GET' },
                      { value: 'POST', label: 'POST' },
                      { value: 'PUT', label: 'PUT' },
                      { value: 'DELETE', label: 'DELETE' }
                    ]}
                    value={testRequest.method}
                    onChange={(e) => setTestRequest({ ...testRequest, method: e.target.value })}
                  />
                  <Input
                    label="请求路径"
                    value={testRequest.path}
                    onChange={(e) => setTestRequest({ ...testRequest, path: e.target.value })}
                  />
                  <TextArea
                    label="请求体 (JSON)"
                    rows={6}
                    value={JSON.stringify(testRequest.body, null, 2)}
                    onChange={(e) => {
                      try {
                        setTestRequest({ ...testRequest, body: JSON.parse(e.target.value) });
                      } catch {}
                    }}
                  />
                  <Button
                    variant="primary"
                    icon={<Play className="w-16 h-16" />}
                    loading={testing}
                    onClick={handleTest}
                    className="w-full"
                  >
                    发送请求
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-[#1E3A5F] mb-12">响应结果</div>
                <div className="h-full bg-gray-900 rounded-8 p-16 text-white font-mono text-sm overflow-auto">
                  {testResponse ? (
                    <pre>{JSON.stringify(testResponse, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-400">等待发送请求...</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardHeader title="提交联调结果" />
          <CardContent>
            <div className="space-y-16">
              <div className="flex items-center gap-16">
                <button
                  className={`
                    flex items-center gap-12 px-24 py-16 rounded-8 border-2
                    transition-all duration-200
                    ${testResult === 'success'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                    }
                  `}
                  onClick={() => setTestResult('success')}
                >
                  <CheckCircle className="w-20 h-20" />
                  <span className="text-sm font-medium">联调成功</span>
                </button>
                <button
                  className={`
                    flex items-center gap-12 px-24 py-16 rounded-8 border-2
                    transition-all duration-200
                    ${testResult === 'fail'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-red-300'
                    }
                  `}
                  onClick={() => setTestResult('fail')}
                >
                  <AlertTriangle className="w-20 h-20" />
                  <span className="text-sm font-medium">联调失败</span>
                </button>
              </div>

              <TextArea
                label="联调说明"
                placeholder="请描述联调过程中的情况、遇到的问题等"
                rows={4}
                value={resultDescription}
                onChange={(e) => setResultDescription(e.target.value)}
              />

              <div>
                <div className="text-sm font-medium text-[#1E3A5F] mb-12">联调截图上传</div>
                <UploadComponent
                  accept=".jpg,.png"
                  maxSize={5 * 1024 * 1024}
                  listType="picture"
                />
              </div>
            </div>
          </CardContent>

          <div className="flex items-center justify-end gap-12 pt-24 border-t border-gray-100">
            <Button variant="outline" onClick={() => navigate('/tickets')}>
              返回工单列表
            </Button>
            <Button
              variant="primary"
              icon={<Send className="w-16 h-16" />}
              onClick={handleSubmitResult}
              disabled={!testResult}
            >
              提交联调结果
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}