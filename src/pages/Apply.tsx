import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input, TextArea, Select } from '@/components/common/Input';
import { UploadComponent } from '@/components/common/Upload';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  Phone,
  Mail,
  Link as LinkIcon,
  FileUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { useApplyStore } from '@/stores/applyStore';

const steps = [
  { id: 1, title: '企业信息', description: '填写企业基本信息' },
  { id: 2, title: '联系人信息', description: '录入联系人信息' },
  { id: 3, title: '回调地址', description: '配置回调地址' },
  { id: 4, title: '资质文件', description: '上传资质文件' }
];

const enterpriseTypes = [
  { value: 'technology', label: '科技/互联网' },
  { value: 'finance', label: '金融/保险' },
  { value: 'retail', label: '零售/电商' },
  { value: 'manufacturing', label: '制造/工业' },
  { value: 'other', label: '其他' }
];

const industries = [
  { value: 'software', label: '软件开发' },
  { value: 'saas', label: 'SaaS服务' },
  { value: 'platform', label: '平台运营' },
  { value: 'ecommerce', label: '电子商务' },
  { value: 'fintech', label: '金融科技' },
  { value: 'other', label: '其他' }
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

export function Apply() {
  const navigate = useNavigate();
  const { applyData, setApplyData, submitApply, reviewStatus } = useApplyStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    enterpriseName: applyData?.enterpriseName || '',
    creditCode: applyData?.creditCode || '',
    enterpriseType: applyData?.enterpriseType || '',
    industry: applyData?.industry || '',
    technicalContact: applyData?.technicalContact || { id: '', enterpriseId: '', type: 'technical' as const, name: '', phone: '', email: '' },
    businessContact: applyData?.businessContact || { id: '', enterpriseId: '', type: 'business' as const, name: '', phone: '', email: '' },
    emergencyContact: applyData?.emergencyContact || { id: '', enterpriseId: '', type: 'emergency' as const, name: '', phone: '', email: '' },
    callbackUrls: applyData?.callbackUrls || [{ id: '', enterpriseId: '', url: '', type: 'notification' as const, status: 'active' as const }],
    files: [] as File[]
  });

  useEffect(() => {
    setApplyData(formData);
  }, [formData, setApplyData]);

  useEffect(() => {
    if (reviewStatus === 'pending' && applyData) {
      setFormData({
        enterpriseName: applyData.enterpriseName || '',
        creditCode: applyData.creditCode || '',
        enterpriseType: applyData.enterpriseType || '',
        industry: applyData.industry || '',
        technicalContact: applyData.technicalContact || formData.technicalContact,
        businessContact: applyData.businessContact || formData.businessContact,
        emergencyContact: applyData.emergencyContact || formData.emergencyContact,
        callbackUrls: applyData.callbackUrls || formData.callbackUrls,
        files: []
      });
    }
  }, [applyData]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    submitApply();
    navigate('/review');
  };

  const addCallbackUrl = () => {
    setFormData({
      ...formData,
      callbackUrls: [...formData.callbackUrls, { id: '', enterpriseId: '', url: '', type: 'notification' as const, status: 'active' as const }]
    });
  };

  const removeCallbackUrl = (index: number) => {
    setFormData({
      ...formData,
      callbackUrls: formData.callbackUrls.filter((_, i) => i !== index)
    });
  };

  return (
    <Layout>
      <div className="max-w-800 mx-auto">
        <div className="mb-32">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">入驻申请</h1>
          <p className="text-sm text-gray-500 mt-4">填写企业信息，申请接入平台能力</p>
        </div>

        <div className="flex items-center justify-between mb-32">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-40 h-40 rounded-full flex items-center justify-center
                ${currentStep >= step.id
                  ? 'bg-[#38B2AC] text-white'
                  : 'bg-gray-100 text-gray-400'
                }
              `}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-20 h-20" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-12">
                <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-[#1E3A5F]' : 'text-gray-400'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-80 h-2 mx-24 ${currentStep > step.id ? 'bg-[#38B2AC]' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>

        <Card padding="lg">
          {currentStep === 1 && (
            <>
              <CardHeader title="企业基本信息" subtitle="请填写企业的基本信息" />
              <CardContent>
                <div className="space-y-20">
                  <Input
                    label="企业名称"
                    placeholder="请输入企业全称"
                    required
                    icon={<Building2 className="w-16 h-16" />}
                    value={formData.enterpriseName}
                    onChange={(e) => setFormData({ ...formData, enterpriseName: e.target.value })}
                  />
                  <Input
                    label="统一社会信用代码"
                    placeholder="请输入18位信用代码"
                    required
                    value={formData.creditCode}
                    onChange={(e) => setFormData({ ...formData, creditCode: e.target.value })}
                  />
                  <Select
                    label="企业类型"
                    options={enterpriseTypes}
                    required
                    value={formData.enterpriseType}
                    onChange={(e) => setFormData({ ...formData, enterpriseType: e.target.value })}
                  />
                  <Select
                    label="行业分类"
                    options={industries}
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader title="联系人信息" subtitle="请录入各类型联系人信息" />
              <CardContent>
                <div className="space-y-24">
                  <div className="p-16 bg-blue-50 rounded-8">
                    <div className="text-sm font-medium text-blue-700 mb-12">技术联系人</div>
                    <div className="grid grid-cols-3 gap-16">
                      <Input
                        label="姓名"
                        placeholder="技术负责人姓名"
                        required
                        icon={<User className="w-16 h-16" />}
                        value={formData.technicalContact.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          technicalContact: { ...formData.technicalContact, name: e.target.value }
                        })}
                      />
                      <Input
                        label="电话"
                        placeholder="手机号码"
                        required
                        icon={<Phone className="w-16 h-16" />}
                        value={formData.technicalContact.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          technicalContact: { ...formData.technicalContact, phone: e.target.value }
                        })}
                      />
                      <Input
                        label="邮箱"
                        placeholder="工作邮箱"
                        required
                        icon={<Mail className="w-16 h-16" />}
                        value={formData.technicalContact.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          technicalContact: { ...formData.technicalContact, email: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="p-16 bg-green-50 rounded-8">
                    <div className="text-sm font-medium text-green-700 mb-12">商务联系人</div>
                    <div className="grid grid-cols-3 gap-16">
                      <Input
                        label="姓名"
                        placeholder="商务负责人姓名"
                        icon={<User className="w-16 h-16" />}
                        value={formData.businessContact.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          businessContact: { ...formData.businessContact, name: e.target.value }
                        })}
                      />
                      <Input
                        label="电话"
                        placeholder="手机号码"
                        icon={<Phone className="w-16 h-16" />}
                        value={formData.businessContact.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          businessContact: { ...formData.businessContact, phone: e.target.value }
                        })}
                      />
                      <Input
                        label="邮箱"
                        placeholder="工作邮箱"
                        icon={<Mail className="w-16 h-16" />}
                        value={formData.businessContact.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          businessContact: { ...formData.businessContact, email: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="p-16 bg-orange-50 rounded-8">
                    <div className="text-sm font-medium text-orange-700 mb-12">紧急联系人</div>
                    <div className="grid grid-cols-3 gap-16">
                      <Input
                        label="姓名"
                        placeholder="紧急联系人姓名"
                        icon={<User className="w-16 h-16" />}
                        value={formData.emergencyContact.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                        })}
                      />
                      <Input
                        label="电话"
                        placeholder="手机号码"
                        icon={<Phone className="w-16 h-16" />}
                        value={formData.emergencyContact.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                        })}
                      />
                      <Input
                        label="邮箱"
                        placeholder="工作邮箱"
                        icon={<Mail className="w-16 h-16" />}
                        value={formData.emergencyContact.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, email: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader title="回调地址配置" subtitle="配置接收平台回调通知的地址" />
              <CardContent>
                <div className="space-y-16">
                  {formData.callbackUrls.map((item, index) => (
                    <div key={index} className="flex items-start gap-16 p-16 bg-gray-50 rounded-8">
                      <div className="flex-1">
                        <Input
                          label="回调地址"
                          placeholder="https://your-domain.com/callback"
                          required
                          icon={<LinkIcon className="w-16 h-16" />}
                          value={item.url}
                          onChange={(e) => {
                            const newUrls = [...formData.callbackUrls];
                            newUrls[index] = { ...newUrls[index], url: e.target.value };
                            setFormData({ ...formData, callbackUrls: newUrls });
                          }}
                        />
                      </div>
                      <Select
                        label="类型"
                        options={[
                          { value: 'notification', label: '通知回调' },
                          { value: 'event', label: '事件回调' },
                          { value: 'data', label: '数据回调' }
                        ]}
                        value={item.type}
                        onChange={(e) => {
                          const newUrls = [...formData.callbackUrls];
                          newUrls[index] = { ...newUrls[index], type: e.target.value as 'notification' | 'event' | 'data' };
                          setFormData({ ...formData, callbackUrls: newUrls });
                        }}
                      />
                      {formData.callbackUrls.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="mt-24"
                          onClick={() => removeCallbackUrl(index)}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCallbackUrl}>
                    添加回调地址
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader title="资质文件上传" subtitle="上传企业资质证明文件" />
              <CardContent>
                <div className="space-y-24">
                  <div>
                    <div className="text-sm font-medium text-[#1E3A5F] mb-12">营业执照</div>
                    <UploadComponent
                      accept=".pdf,.jpg,.png"
                      maxSize={5 * 1024 * 1024}
                      value={formData.files}
                      onChange={(files) => setFormData({ ...formData, files })}
                    />
                  </div>
                  <div className="p-16 bg-yellow-50 rounded-8">
                    <div className="text-sm text-yellow-700">
                      <strong>提示：</strong>请确保上传的文件清晰可读，文件格式支持 PDF、JPG、PNG，单个文件不超过 5MB
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          <CardFooter>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                icon={<ArrowLeft className="w-16 h-16" />}
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                上一步
              </Button>
              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  icon={<ArrowRight className="w-16 h-16" />}
                  onClick={handleNext}
                >
                  下一步
                </Button>
              ) : (
                <Button
                  variant="primary"
                  icon={<CheckCircle className="w-16 h-16" />}
                  onClick={handleSubmit}
                >
                  提交申请
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}