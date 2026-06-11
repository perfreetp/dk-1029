import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Timeline } from '@/components/common/Timeline';
import { StatusBadge } from '@/components/common/Badge';
import { useUserStore } from '@/stores/userStore';
import { CheckCircle, Clock, AlertCircle, FileText, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const reviewSteps = [
  { id: 'submitted', title: '资料提交', description: '企业资料已提交' },
  { id: 'initial_review', title: '初审', description: '平台初步审核' },
  { id: 'detail_review', title: '复审', description: '详细资质审核' },
  { id: 'approved', title: '审核通过', description: '账号激活' }
];

export function Review() {
  const { enterprise } = useUserStore();
  const [currentStep] = useState('approved');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const mockTimeline = [
    { id: '1', status: 'submitted', operator: '张明', timestamp: '2024-01-15T10:00:00Z' },
    { id: '2', status: 'initial_review', operator: '审核员A', comment: '初审通过，进入复审阶段', timestamp: '2024-01-16T09:00:00Z' },
    { id: '3', status: 'detail_review', operator: '审核员B', comment: '资质文件审核完成', timestamp: '2024-01-18T14:00:00Z' },
    { id: '4', status: 'approved', operator: '审核主管', comment: '审核通过，账号已激活', timestamp: '2024-01-20T15:30:00Z' }
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = reviewSteps.findIndex(s => s.id === stepId);
    const currentIndex = reviewSteps.findIndex(s => s.id === currentStep);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <Layout>
      <div className="max-w-800 mx-auto">
        <div className="mb-32">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">资质审核</h1>
          <p className="text-sm text-gray-500 mt-4">查看企业入驻审核进度</p>
        </div>

        <Card padding="lg" className="mb-24">
          <CardHeader
            title="审核状态"
            subtitle={`企业：${enterprise?.name || '示例科技有限公司'}`}
            action={<StatusBadge status={enterprise?.status || 'approved'} />}
          />
          <CardContent>
            <div className="flex items-center justify-between mb-32">
              {reviewSteps.map((step, index) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-48 h-48 rounded-full flex items-center justify-center
                        ${status === 'completed' ? 'bg-green-500 text-white' :
                          status === 'current' ? 'bg-[#38B2AC] text-white animate-pulse' :
                          'bg-gray-100 text-gray-400'}
                      `}>
                        {status === 'completed' ? (
                          <CheckCircle className="w-24 h-24" />
                        ) : status === 'current' ? (
                          <Clock className="w-24 h-24" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      <div className="mt-8 text-center">
                        <div className={`text-sm font-medium ${
                          status === 'completed' ? 'text-green-600' :
                          status === 'current' ? 'text-[#38B2AC]' :
                          'text-gray-400'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400">{step.description}</div>
                      </div>
                    </div>
                    {index < reviewSteps.length - 1 && (
                      <div className={`w-80 h-2 mx-16 ${
                        status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardHeader title="审核时间线" />
          <CardContent>
            <Timeline items={mockTimeline} currentStatus={currentStep} />
          </CardContent>
        </Card>

        {enterprise?.status === 'approved' && (
          <Card padding="lg" className="mt-24 bg-green-50 border-green-200">
            <div className="flex items-center gap-16">
              <CheckCircle className="w-48 h-48 text-green-500" />
              <div>
                <div className="text-lg font-semibold text-green-700">审核已通过</div>
                <div className="text-sm text-green-600 mt-4">
                  您的企业账号已激活，可以开始接入平台能力
                </div>
              </div>
              <Button variant="primary" className="ml-auto">
                开始接入能力
              </Button>
            </div>
          </Card>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card padding="lg" className="max-w-500">
              <CardHeader
                title="审核驳回"
                action={
                  <button onClick={() => setShowRejectModal(false)}>
                    <AlertCircle className="w-20 h-20" />
                  </button>
                }
              />
              <CardContent>
                <div className="space-y-16">
                  <div className="p-16 bg-red-50 rounded-8">
                    <div className="text-sm text-red-700">
                      驳回原因：营业执照图片不清晰，请重新上传清晰的资质文件
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <FileText className="w-16 h-16 text-gray-500" />
                    <span className="text-sm text-gray-600">需要补充的材料：</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-8">
                    <li>清晰的营业执照扫描件或照片</li>
                    <li>企业授权书（加盖公章）</li>
                  </ul>
                </div>
              </CardContent>
              <div className="flex justify-end gap-12 mt-24">
                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                  关闭
                </Button>
                <Button variant="primary" icon={<RefreshCw className="w-16 h-16" />}>
                  重新提交
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}