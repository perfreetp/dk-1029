import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Table } from '@/components/common/Table';
import { Modal } from '@/components/common/Modal';
import { TextArea, Select } from '@/components/common/Input';
import { UploadComponent } from '@/components/common/Upload';
import { RatingStars, RatingDisplay } from '@/components/common/Rating';
import { useFeedbackStore } from '@/stores/dataStore';
import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
  User,
  CheckCircle,
  Star,
  Send
} from 'lucide-react';
import { formatDateTime } from '@/utils/format';
import type { Feedback } from '@/types';

export function FeedbackPage() {
  const { feedbacks, createFeedback } = useFeedbackStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formData, setFormData] = useState({
    type: 'technical',
    title: '',
    description: '',
    files: [] as File[]
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesType = typeFilter === 'all' || fb.type === typeFilter;
    const matchesSearch = fb.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSubmit = async () => {
    await createFeedback({
      type: formData.type,
      title: formData.title,
      description: formData.description
    });
    setShowCreateModal(false);
    setFormData({ type: 'technical', title: '', description: '', files: [] });
  };

  const handleRatingSubmit = () => {
    setShowRatingModal(false);
    setRating(0);
    setRatingComment('');
  };

  const columns = [
    {
      key: 'title',
      title: '问题标题',
      render: (value: unknown) => (
        <span className="text-sm font-medium text-[#1E3A5F]">{String(value)}</span>
      )
    },
    {
      key: 'type',
      title: '问题类型',
      render: (value: unknown) => {
        const typeTexts: Record<string, string> = {
          technical: '技术问题',
          business: '业务问题',
          billing: '账单问题',
          other: '其他'
        };
        return (
          <span className={`
            px-12 py-4 rounded-4 text-xs
            ${value === 'technical' ? 'bg-blue-100 text-blue-700' :
              value === 'business' ? 'bg-green-100 text-green-700' :
              value === 'billing' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'}
          `}>
            {typeTexts[String(value) as string] || String(value)}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: '状态',
      render: (value: unknown) => <StatusBadge status={String(value)} />
    },
    {
      key: 'priority',
      title: '优先级',
      render: (value: unknown) => {
        const priorityColors: Record<string, string> = {
          low: 'bg-gray-100 text-gray-600',
          medium: 'bg-blue-100 text-blue-600',
          high: 'bg-orange-100 text-orange-600',
          urgent: 'bg-red-100 text-red-600'
        };
        const priorityTexts: Record<string, string> = {
          low: '低',
          medium: '中',
          high: '高',
          urgent: '紧急'
        };
        return (
          <span className={`px-12 py-4 rounded-4 text-xs ${priorityColors[String(value) as string]}`}>
            {priorityTexts[String(value) as string] || String(value)}
          </span>
        );
      }
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
          onClick={() => setSelectedFeedback(record as Feedback)}
        >
          查看详情
        </Button>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">服务评价</h1>
            <p className="text-sm text-gray-500 mt-4">反馈问题和评价服务支持</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-16 h-16" />}
            onClick={() => setShowCreateModal(true)}
          >
            提交反馈
          </Button>
        </div>

        <Card padding="md">
          <div className="flex items-center gap-16">
            <div className="flex-1 relative">
              <Search className="absolute left-12 top-1/2 -translate-y-1/2 w-16 h-16 text-gray-400" />
              <input
                type="text"
                placeholder="搜索问题标题"
                className="w-full h-40 pl-40 pr-16 text-sm rounded-8 border border-gray-200 focus:border-[#38B2AC]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="h-40 px-16 text-sm rounded-8 border border-gray-200"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">全部类型</option>
              <option value="technical">技术问题</option>
              <option value="business">业务问题</option>
              <option value="billing">账单问题</option>
              <option value="other">其他</option>
            </select>
          </div>
        </Card>

        <Table columns={columns} data={filteredFeedbacks} rowKey="id" />
      </div>

      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="提交问题反馈"
        width="md"
        footer={
          <Button
            variant="primary"
            icon={<Send className="w-16 h-16" />}
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description}
          >
            提交反馈
          </Button>
        }
      >
        <div className="space-y-16">
          <Select
            label="问题类型"
            options={[
              { value: 'technical', label: '技术问题' },
              { value: 'business', label: '业务问题' },
              { value: 'billing', label: '账单问题' },
              { value: 'other', label: '其他' }
            ]}
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextArea
            label="问题标题"
            placeholder="简要描述您遇到的问题"
            required
            rows={2}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextArea
            label="问题描述"
            placeholder="详细描述问题情况、发生时间、影响范围等"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div>
            <div className="text-sm font-medium text-[#1E3A5F] mb-12">上传截图</div>
            <UploadComponent
              accept=".jpg,.png"
              maxSize={5 * 1024 * 1024}
              listType="picture"
              value={formData.files}
              onChange={(files) => setFormData({ ...formData, files })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={selectedFeedback !== null}
        onClose={() => setSelectedFeedback(null)}
        title="反馈详情"
        width="md"
        footer={
          selectedFeedback?.status === 'resolved' ? (
            <Button
              variant="primary"
              icon={<Star className="w-16 h-16" />}
              onClick={() => setShowRatingModal(true)}
            >
              评价服务
            </Button>
          ) : null
        }
      >
        {selectedFeedback && (
          <div className="space-y-16">
            <div className="grid grid-cols-2 gap-16">
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">问题类型</div>
                <span className={`
                  px-12 py-4 rounded-4 text-xs
                  ${selectedFeedback.type === 'technical' ? 'bg-blue-100 text-blue-700' :
                    selectedFeedback.type === 'business' ? 'bg-green-100 text-green-700' :
                    selectedFeedback.type === 'billing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'}
                `}>
                  {selectedFeedback.type === 'technical' ? '技术问题' :
                    selectedFeedback.type === 'business' ? '业务问题' :
                    selectedFeedback.type === 'billing' ? '账单问题' : '其他'}
                </span>
              </div>
              <div className="p-16 bg-[#F7FAFC] rounded-8">
                <div className="text-xs text-gray-400 mb-4">当前状态</div>
                <StatusBadge status={selectedFeedback.status} />
              </div>
            </div>

            <div className="p-16 bg-gray-50 rounded-8">
              <div className="text-sm font-medium text-[#1E3A5F] mb-8">{selectedFeedback.title}</div>
              <p className="text-sm text-gray-600">{selectedFeedback.description}</p>
            </div>

            <div className="p-16 bg-[#F7FAFC] rounded-8">
              <div className="flex items-center gap-16 mb-12">
                <Clock className="w-16 h-16 text-gray-400" />
                <span className="text-sm text-gray-600">处理进度</span>
              </div>
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <span className="text-sm text-gray-600">已提交</span>
                  <span className="text-xs text-gray-400">{formatDateTime(selectedFeedback.createdAt)}</span>
                </div>
                {selectedFeedback.assignee && (
                  <div className="flex items-center gap-8">
                    <User className="w-16 h-16 text-blue-500" />
                    <span className="text-sm text-gray-600">已分配：{selectedFeedback.assignee}</span>
                  </div>
                )}
                {selectedFeedback.status === 'resolved' && selectedFeedback.resolvedAt && (
                  <div className="flex items-center gap-8">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <span className="text-sm text-gray-600">已解决</span>
                    <span className="text-xs text-gray-400">{formatDateTime(selectedFeedback.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title="服务评价"
        width="sm"
        footer={
          <Button
            variant="primary"
            onClick={handleRatingSubmit}
            disabled={rating === 0}
          >
            提交评价
          </Button>
        }
      >
        <div className="space-y-16">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-16">请为本次服务支持打分</div>
            <RatingStars
              value={rating}
              onChange={setRating}
              size="lg"
            />
          </div>
          <TextArea
            placeholder="请输入您的评价内容（可选）"
            rows={4}
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
          />
        </div>
      </Modal>
    </Layout>
  );
}