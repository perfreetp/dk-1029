import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Input, TextArea, Select } from '@/components/common/Input';
import { UploadComponent } from '@/components/common/Upload';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  ClipboardList,
  ArrowRight,
  CheckCircle,
  FileUp
} from 'lucide-react';
import { useCapabilityStore } from '@/stores/capabilityStore';
import { useTicketStore } from '@/stores/ticketStore';

export function TicketCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { capabilities } = useCapabilityStore();
  const { createTicket } = useTicketStore();
  
  const preselectedCapabilityId = location.state?.capabilityId;
  
  const [formData, setFormData] = useState({
    capabilityId: preselectedCapabilityId || '',
    type: 'access',
    description: '',
    files: [] as File[]
  });

  const handleSubmit = async () => {
    const newTicket = await createTicket({
      capabilityId: formData.capabilityId,
      type: formData.type,
      description: formData.description
    });
    navigate(`/tickets/${newTicket.id}`);
  };

  const availableCapabilities = capabilities.filter(c => c.status === 'available' || c.status === 'active');

  return (
    <Layout>
      <div className="max-w-800 mx-auto">
        <div className="mb-32">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">创建接入工单</h1>
          <p className="text-sm text-gray-500 mt-4">申请接入新的平台能力</p>
        </div>

        <Card padding="lg">
          <CardHeader
            title="工单信息"
            subtitle="填写接入申请的基本信息"
          />
          <CardContent>
            <div className="space-y-24">
              <Select
                label="选择能力"
                options={availableCapabilities.map(c => ({
                  value: c.id,
                  label: `${c.name} - ${c.category === 'account' ? '账号' : 
                    c.category === 'content' ? '内容' : 
                    c.category === 'message' ? '消息' : '数据'}`
                }))}
                required
                value={formData.capabilityId}
                onChange={(e) => setFormData({ ...formData, capabilityId: e.target.value })}
              />

              {formData.capabilityId && (
                <div className="p-16 bg-[#F7FAFC] rounded-8">
                  {(() => {
                    const cap = capabilities.find(c => c.id === formData.capabilityId);
                    if (!cap) return null;
                    return (
                      <div className="flex items-start gap-16">
                        <div className="w-48 h-48 rounded-8 bg-white flex items-center justify-center">
                          <ClipboardList className="w-24 h-24 text-[#1E3A5F]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-8">
                            <span className="font-medium text-[#1E3A5F]">{cap.name}</span>
                            <StatusBadge status={cap.status} />
                          </div>
                          <p className="text-sm text-gray-500 mt-4">{cap.description}</p>
                          <div className="flex items-center gap-16 mt-8 text-xs text-gray-400">
                            <span>配额：{cap.quota.toLocaleString()} 次/月</span>
                            <span>价格：¥{cap.price}/月</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <Select
                label="工单类型"
                options={[
                  { value: 'access', label: '接入申请' },
                  { value: 'upgrade', label: '配额升级' },
                  { value: 'maintenance', label: '维护支持' },
                  { value: 'cancel', label: '停用申请' }
                ]}
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />

              <TextArea
                label="接入需求描述"
                placeholder="请详细描述您的接入需求、使用场景、预期目标等"
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div>
                <div className="text-sm font-medium text-[#1E3A5F] mb-12">
                  需求文档上传
                  <span className="text-gray-400 ml-8">(可选)</span>
                </div>
                <UploadComponent
                  accept=".pdf,.doc,.docx"
                  maxSize={10 * 1024 * 1024}
                  value={formData.files}
                  onChange={(files) => setFormData({ ...formData, files })}
                >
                  <div className="flex flex-col items-center gap-12 py-24">
                    <FileUp className="w-32 h-32 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      上传需求文档、技术方案等
                    </div>
                    <div className="text-xs text-gray-400">
                      支持 PDF、DOC、DOCX，最大 10MB
                    </div>
                  </div>
                </UploadComponent>
              </div>
            </div>
          </CardContent>

          <div className="flex items-center justify-between pt-24 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => navigate('/tickets')}
            >
              取消
            </Button>
            <Button
              variant="primary"
              icon={<CheckCircle className="w-16 h-16" />}
              onClick={handleSubmit}
              disabled={!formData.capabilityId || !formData.description}
            >
              提交工单
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}