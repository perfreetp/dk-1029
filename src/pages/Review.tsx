import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Timeline } from '@/components/common/Timeline';
import { StatusBadge } from '@/components/common/Badge';
import { useApplyStore } from '@/stores/applyStore';
import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw,
  User,
  Phone,
  Mail,
  Link as LinkIcon,
  Building2
} from 'lucide-react';

const reviewSteps = [
  { id: 'submitted', title: '资料提交', description: '企业资料已提交' },
  { id: 'initial_review', title: '初审', description: '平台初步审核' },
  { id: 'detail_review', title: '复审', description: '详细资质审核' },
  { id: 'approved', title: '审核通过', description: '账号激活' }
];

const typeLabels: Record<string, string> = {
  technology: '科技/互联网',
  finance: '金融/保险',
  retail: '零售/电商',
  manufacturing: '制造/工业',
  other: '其他'
};

const industryLabels: Record<string, string> = {
  software: '软件开发',
  saas: 'SaaS服务',
  platform: '平台运营',
  ecommerce: '电子商务',
  fintech: '金融科技',
  other: '其他'
};

export function Review() {
  const { enterprise, applyData, reviewStatus, reviewTimeline, approve, reject } = useApplyStore();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getCurrentStep = () => {
    switch (reviewStatus) {
      case 'pending': return 'submitted';
      case 'in_review': return 'initial_review';
      case 'approved': return 'approved';
      case 'rejected': return 'submitted';
      default: return 'submitted';
    }
  };

  const currentStep = getCurrentStep();

  const getStepStatus = (stepId: string) => {
    const stepIndex = reviewSteps.findIndex(s => s.id === stepId);
    const currentIndex = reviewSteps.findIndex(s => s.id === currentStep);
    if (reviewStatus === 'approved') return 'completed';
    if (reviewStatus === 'rejected') return stepId === 'submitted' ? 'current' : 'pending';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const handleApprove = () => {
    approve();
  };

  const handleReject = () => {
    reject(rejectReason || '资料不符合要求');
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <Layout>
      <div className="max-w-900 mx-auto space-y-24">
        <div className="mb-32">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">资质审核</h1>
          <p className="text-sm text-gray-500 mt-4">查看企业入驻审核进度</p>
        </div>

        {!applyData && (
          <Card padding="lg">
            <div className="text-center py-32">
              <FileText className="w-48 h-48 text-gray-300 mx-auto mb-16" />
              <h2 className="text-lg font-semibold text-gray-700 mb-8">暂无入驻申请</h2>
              <p className="text-sm text-gray-400 mb-24">请先提交入驻申请</p>
              <Button variant="primary" onClick={() => window.location.href = '/apply'}>
                前往入驻申请
              </Button>
            </div>
          </Card>
        )}

        {applyData && (
          <>
            <Card padding="lg">
              <CardHeader
                title="企业信息"
                subtitle={`企业：${applyData.enterpriseName || '未填写'}`}
                action={<StatusBadge status={reviewStatus === 'in_review' ? 'pending' : reviewStatus} />}
              />
              <CardContent>
                <div className="grid grid-cols-2 gap-16 mb-24">
                  <div className="p-16 bg-[#F7FAFC] rounded-8">
                    <div className="flex items-center gap-8 mb-8">
                      <Building2 className="w-16 h-16 text-gray-400" />
                      <span className="text-xs text-gray-400">企业名称</span>
                    </div>
                    <div className="text-sm font-medium text-[#1E3A5F]">{applyData.enterpriseName}</div>
                  </div>
                  <div className="p-16 bg-[#F7FAFC] rounded-8">
                    <div className="text-xs text-gray-400 mb-4">统一社会信用代码</div>
                    <div className="text-sm font-medium text-[#1E3A5F]">{applyData.creditCode}</div>
                  </div>
                  <div className="p-16 bg-[#F7FAFC] rounded-8">
                    <div className="text-xs text-gray-400 mb-4">企业类型</div>
                    <div className="text-sm text-gray-700">{typeLabels[applyData.enterpriseType] || applyData.enterpriseType}</div>
                  </div>
                  <div className="p-16 bg-[#F7FAFC] rounded-8">
                    <div className="text-xs text-gray-400 mb-4">行业分类</div>
                    <div className="text-sm text-gray-700">{industryLabels[applyData.industry] || applyData.industry}</div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-24">
                  <h4 className="text-sm font-medium text-[#1E3A5F] mb-16">联系人信息</h4>
                  <div className="grid grid-cols-3 gap-16">
                    <div className="p-12 bg-blue-50 rounded-8">
                      <div className="text-xs text-blue-600 mb-8">技术联系人</div>
                      <div className="flex items-center gap-8 text-sm text-gray-700">
                        <User className="w-14 h-14" />
                        <span>{applyData.technicalContact?.name || '-'}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm text-gray-500 mt-4">
                        <Phone className="w-14 h-14" />
                        <span>{applyData.technicalContact?.phone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm text-gray-500 mt-4">
                        <Mail className="w-14 h-14" />
                        <span>{applyData.technicalContact?.email || '-'}</span>
                      </div>
                    </div>
                    <div className="p-12 bg-green-50 rounded-8">
                      <div className="text-xs text-green-600 mb-8">商务联系人</div>
                      <div className="flex items-center gap-8 text-sm text-gray-700">
                        <User className="w-14 h-14" />
                        <span>{applyData.businessContact?.name || '-'}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm text-gray-500 mt-4">
                        <Phone className="w-14 h-14" />
                        <span>{applyData.businessContact?.phone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm text-gray-500 mt-4">
                        <Mail className="w-14 h-14" />
                        <span>{applyData.businessContact?.email || '-'}</span>
                      </div>
                    </div>
                    <div className="p-12 bg-orange-50 rounded-8">
                      <div className="text-xs text-orange-600 mb-8">紧急联系人</div>
                      <div className="flex items-center gap-8 text-sm text-gray-700">
                        <User className="w-14 h-14" />
                        <span>{applyData.emergencyContact?.name || '-'}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm text-gray-500 mt-4">
                        <Phone className="w-14 h-14" />
                        <span>{applyData.emergencyContact?.phone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-8 text-sm text-gray-500 mt-4">
                        <Mail className="w-14 h-14" />
                        <span>{applyData.emergencyContact?.email || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-24 mt-24">
                  <h4 className="text-sm font-medium text-[#1E3A5F] mb-16">回调地址</h4>
                  <div className="space-y-8">
                    {applyData.callbackUrls?.map((url, index) => (
                      <div key={index} className="flex items-center gap-12 p-12 bg-gray-50 rounded-8">
                        <LinkIcon className="w-16 h-16 text-gray-400" />
                        <span className="text-sm text-gray-700 flex-1">{url.url || '-'}</span>
                        <span className={`
                          px-8 py-2 rounded-4 text-xs
                          ${url.type === 'notification' ? 'bg-blue-100 text-blue-600' :
                            url.type === 'event' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'}
                        `}>
                          {url.type === 'notification' ? '通知回调' : url.type === 'event' ? '事件回调' : '数据回调'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card padding="lg">
              <CardHeader title="审核进度" />
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

            {reviewTimeline.length > 0 && (
              <Card padding="lg">
                <CardHeader title="审核记录" />
                <CardContent>
                  <Timeline items={reviewTimeline} currentStatus={currentStep} />
                </CardContent>
              </Card>
            )}

            {reviewStatus === 'in_review' && (
              <Card padding="lg">
                <div className="flex items-center justify-end gap-12">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(true)}
                  >
                    驳回申请
                  </Button>
                  <Button
                    variant="primary"
                    icon={<CheckCircle className="w-16 h-16" />}
                    onClick={handleApprove}
                  >
                    通过审核
                  </Button>
                </div>
              </Card>
            )}

            {reviewStatus === 'approved' && (
              <Card padding="lg" className="bg-green-50 border-green-200">
                <div className="flex items-center gap-16">
                  <CheckCircle className="w-48 h-48 text-green-500" />
                  <div>
                    <div className="text-lg font-semibold text-green-700">审核已通过</div>
                    <div className="text-sm text-green-600 mt-4">
                      您的企业账号已激活，可以开始接入平台能力
                    </div>
                  </div>
                  <Button variant="primary" className="ml-auto" onClick={() => window.location.href = '/capabilities'}>
                    开始接入能力
                  </Button>
                </div>
              </Card>
            )}

            {reviewStatus === 'rejected' && (
              <Card padding="lg" className="bg-red-50 border-red-200">
                <div className="flex items-center gap-16">
                  <AlertCircle className="w-48 h-48 text-red-500" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-red-700">审核未通过</div>
                    <div className="text-sm text-red-600 mt-4">
                      {reviewTimeline[reviewTimeline.length - 1]?.comment || '资料不符合要求'}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    icon={<RefreshCw className="w-16 h-16" />}
                    onClick={() => window.location.href = '/apply'}
                  >
                    重新申请
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card padding="lg" className="max-w-400">
            <CardHeader
              title="驳回原因"
              action={
                <button onClick={() => setShowRejectModal(false)}>
                  <AlertCircle className="w-20 h-20" />
                </button>
              }
            />
            <CardContent>
              <textarea
                className="w-full h-100 px-12 py-8 text-sm rounded-6 border border-gray-200 focus:border-[#38B2AC] focus:ring-2 focus:ring-[#38B2AC]/20 resize-none"
                placeholder="请输入驳回原因"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </CardContent>
            <div className="flex justify-end gap-12 mt-24">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                取消
              </Button>
              <Button variant="danger" onClick={handleReject}>
                确认驳回
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}