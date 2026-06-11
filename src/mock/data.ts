import type { Enterprise, Capability, Ticket, Bill, Feedback, TestParams, User } from '@/types';

export const mockUser: User = {
  id: 'user-001',
  enterpriseId: 'ent-001',
  name: '张明',
  email: 'zhangming@example.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming'
};

export const mockEnterprise: Enterprise = {
  id: 'ent-001',
  name: '示例科技有限公司',
  creditCode: '91110108MA01ABCD12',
  type: 'technology',
  industry: '软件开发',
  status: 'approved',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z'
};

export const mockCapabilities: Capability[] = [
  {
    id: 'cap-001',
    name: '账号管理',
    category: 'account',
    description: '提供用户账号注册、登录、信息管理等核心能力',
    icon: 'User',
    status: 'available',
    permissions: ['user.read', 'user.write', 'user.delete'],
    quota: 10000,
    price: 500,
    documentation: '账号管理API提供完整的用户生命周期管理能力，包括注册、登录、信息修改、账号注销等功能。',
    apiSpec: {
      endpoints: [
        { path: '/api/v1/users', method: 'POST', description: '创建用户' },
        { path: '/api/v1/users/{id}', method: 'GET', description: '获取用户信息' },
        { path: '/api/v1/users/{id}', method: 'PUT', description: '更新用户信息' },
        { path: '/api/v1/users/{id}', method: 'DELETE', description: '删除用户' }
      ]
    },
    examples: [
      {
        title: '创建用户示例',
        method: 'POST',
        path: '/api/v1/users',
        request: { username: 'testuser', email: 'test@example.com', password: '******' },
        response: { id: 'user-123', username: 'testuser', email: 'test@example.com', createdAt: '2024-01-01T00:00:00Z' }
      }
    ]
  },
  {
    id: 'cap-002',
    name: '内容审核',
    category: 'content',
    description: '提供文本、图片、视频等多媒体内容智能审核能力',
    icon: 'Shield',
    status: 'applied',
    permissions: ['content.scan', 'content.review', 'content.block'],
    quota: 50000,
    price: 1200,
    documentation: '内容审核API支持文本敏感词检测、图片违规内容识别、视频智能审核等功能。',
    apiSpec: {
      endpoints: [
        { path: '/api/v1/content/text/scan', method: 'POST', description: '文本审核' },
        { path: '/api/v1/content/image/scan', method: 'POST', description: '图片审核' },
        { path: '/api/v1/content/video/scan', method: 'POST', description: '视频审核' }
      ]
    },
    examples: [
      {
        title: '文本审核示例',
        method: 'POST',
        path: '/api/v1/content/text/scan',
        request: { text: '这是一段待审核的文本内容', type: 'sensitive' },
        response: { result: 'pass', score: 0.95, details: [] }
      }
    ]
  },
  {
    id: 'cap-003',
    name: '消息推送',
    category: 'message',
    description: '提供短信、邮件、App推送等多渠道消息触达能力',
    icon: 'Bell',
    status: 'active',
    permissions: ['message.sms', 'message.email', 'message.push'],
    quota: 100000,
    price: 800,
    documentation: '消息推送API支持短信发送、邮件投递、App推送通知等多渠道消息触达。',
    apiSpec: {
      endpoints: [
        { path: '/api/v1/message/sms', method: 'POST', description: '发送短信' },
        { path: '/api/v1/message/email', method: 'POST', description: '发送邮件' },
        { path: '/api/v1/message/push', method: 'POST', description: 'App推送' }
      ]
    },
    examples: [
      {
        title: '短信发送示例',
        method: 'POST',
        path: '/api/v1/message/sms',
        request: { phone: '13800138000', content: '您的验证码是123456', templateId: 'sms-001' },
        response: { messageId: 'msg-123', status: 'sent', sentAt: '2024-01-01T00:00:00Z' }
      }
    ]
  },
  {
    id: 'cap-004',
    name: '数据查询',
    category: 'data',
    description: '提供用户画像、行为分析、数据统计等数据服务能力',
    icon: 'Database',
    status: 'available',
    permissions: ['data.profile', 'data.analytics', 'data.export'],
    quota: 20000,
    price: 1500,
    documentation: '数据查询API提供用户画像分析、行为数据统计、数据导出等服务。',
    apiSpec: {
      endpoints: [
        { path: '/api/v1/data/profile/{userId}', method: 'GET', description: '获取用户画像' },
        { path: '/api/v1/data/analytics', method: 'POST', description: '数据分析' },
        { path: '/api/v1/data/export', method: 'POST', description: '数据导出' }
      ]
    },
    examples: [
      {
        title: '用户画像示例',
        method: 'GET',
        path: '/api/v1/data/profile/user-123',
        request: {},
        response: { userId: 'user-123', age: 25, gender: 'male', interests: ['tech', 'sports'], activeDays: 30 }
      }
    ]
  },
  {
    id: 'cap-005',
    name: '身份认证',
    category: 'account',
    description: '提供实名认证、人脸识别、OCR识别等身份验证能力',
    icon: 'Fingerprint',
    status: 'available',
    permissions: ['auth.verify', 'auth.face', 'auth.ocr'],
    quota: 5000,
    price: 2000,
    documentation: '身份认证API提供实名认证、人脸比对、证件OCR识别等功能。',
    apiSpec: {
      endpoints: [
        { path: '/api/v1/auth/verify', method: 'POST', description: '实名认证' },
        { path: '/api/v1/auth/face', method: 'POST', description: '人脸比对' },
        { path: '/api/v1/auth/ocr', method: 'POST', description: '证件OCR' }
      ]
    },
    examples: [
      {
        title: '实名认证示例',
        method: 'POST',
        path: '/api/v1/auth/verify',
        request: { name: '张三', idCard: '110101199001011234', phone: '13800138000' },
        response: { result: 'pass', score: 0.99, verifiedAt: '2024-01-01T00:00:00Z' }
      }
    ]
  },
  {
    id: 'cap-006',
    name: '智能客服',
    category: 'message',
    description: '提供智能对话、意图识别、知识库问答等AI客服能力',
    icon: 'MessageCircle',
    status: 'available',
    permissions: ['chat.bot', 'chat.intent', 'chat.knowledge'],
    quota: 30000,
    price: 3000,
    documentation: '智能客服API提供对话机器人、意图识别、知识库检索等功能。',
    apiSpec: {
      endpoints: [
        { path: '/api/v1/chat/message', method: 'POST', description: '发送对话消息' },
        { path: '/api/v1/chat/intent', method: 'POST', description: '意图识别' },
        { path: '/api/v1/chat/knowledge', method: 'POST', description: '知识库查询' }
      ]
    },
    examples: [
      {
        title: '对话示例',
        method: 'POST',
        path: '/api/v1/chat/message',
        request: { sessionId: 'session-123', message: '我想查询订单状态', userId: 'user-123' },
        response: { reply: '好的，请提供您的订单号', intent: 'order_query', confidence: 0.95 }
      }
    ]
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-001',
    enterpriseId: 'ent-001',
    capabilityId: 'cap-002',
    capabilityName: '内容审核',
    type: 'access',
    status: 'testing',
    assignee: {
      id: 'staff-001',
      name: '李对接',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liduijie',
      phone: '13900139000'
    },
    description: '申请接入内容审核能力，用于平台UGC内容审核',
    attachments: [],
    timeline: [
      { id: 'tl-001', status: 'submitted', operator: '张明', timestamp: '2024-02-01T10:00:00Z' },
      { id: 'tl-002', status: 'assigned', operator: '系统', comment: '已分配对接人：李对接', timestamp: '2024-02-01T11:00:00Z' },
      { id: 'tl-003', status: 'testing', operator: '李对接', comment: '测试参数已发放，请开始联调', timestamp: '2024-02-02T09:00:00Z' }
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-02T09:00:00Z'
  },
  {
    id: 'ticket-002',
    enterpriseId: 'ent-001',
    capabilityId: 'cap-003',
    capabilityName: '消息推送',
    type: 'access',
    status: 'approved',
    assignee: {
      id: 'staff-002',
      name: '王技术',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjishu',
      phone: '13900139001'
    },
    description: '申请接入消息推送能力，用于用户通知触达',
    attachments: [],
    timeline: [
      { id: 'tl-004', status: 'submitted', operator: '张明', timestamp: '2024-01-15T10:00:00Z' },
      { id: 'tl-005', status: 'assigned', operator: '系统', comment: '已分配对接人：王技术', timestamp: '2024-01-15T11:00:00Z' },
      { id: 'tl-006', status: 'testing', operator: '王技术', comment: '测试参数已发放', timestamp: '2024-01-16T09:00:00Z' },
      { id: 'tl-007', status: 'reviewing', operator: '张明', comment: '联调完成，申请验收', timestamp: '2024-01-20T14:00:00Z' },
      { id: 'tl-008', status: 'approved', operator: '王技术', comment: '验收通过，能力已上线', timestamp: '2024-01-22T10:00:00Z' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  },
  {
    id: 'ticket-003',
    enterpriseId: 'ent-001',
    capabilityId: 'cap-001',
    capabilityName: '账号管理',
    type: 'upgrade',
    status: 'submitted',
    description: '申请提升账号管理配额至50000',
    attachments: [],
    timeline: [
      { id: 'tl-009', status: 'submitted', operator: '张明', timestamp: '2024-03-01T10:00:00Z' }
    ],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  }
];

export const mockTestParams: TestParams = {
  id: 'test-001',
  ticketId: 'ticket-001',
  appId: 'app_test_001',
  appSecret: 'secret_test_abc123xyz',
  testAccounts: [
    { id: 'acc-001', username: 'test_admin', password: 'admin123', type: 'admin' },
    { id: 'acc-002', username: 'test_user', password: 'user123', type: 'user' }
  ],
  sandboxUrl: 'https://sandbox.example.com/api',
  expiresAt: '2024-03-15T00:00:00Z'
};

export const mockBills: Bill[] = [
  {
    id: 'bill-001',
    enterpriseId: 'ent-001',
    capabilityId: 'cap-003',
    capabilityName: '消息推送',
    period: '2024年1月',
    quota: 100000,
    usedQuota: 45680,
    amount: 800,
    status: 'paid',
    paidAt: '2024-02-05T10:00:00Z',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'bill-002',
    enterpriseId: 'ent-001',
    capabilityId: 'cap-003',
    capabilityName: '消息推送',
    period: '2024年2月',
    quota: 100000,
    usedQuota: 32150,
    amount: 800,
    status: 'unpaid',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'bill-003',
    enterpriseId: 'ent-001',
    capabilityId: 'cap-002',
    capabilityName: '内容审核',
    period: '2024年2月',
    quota: 50000,
    usedQuota: 12500,
    amount: 1200,
    status: 'overdue',
    createdAt: '2024-03-01T00:00:00Z'
  }
];

export const mockFeedbacks: Feedback[] = [
  {
    id: 'fb-001',
    enterpriseId: 'ent-001',
    type: 'technical',
    title: '接口响应时间过长',
    description: '调用内容审核接口时，响应时间经常超过5秒，影响用户体验',
    attachments: [],
    status: 'processing',
    priority: 'high',
    assignee: '技术支持团队',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-21T09:00:00Z'
  },
  {
    id: 'fb-002',
    enterpriseId: 'ent-001',
    type: 'billing',
    title: '账单金额计算疑问',
    description: '2月份账单金额与预期不符，请核实计算逻辑',
    attachments: [],
    status: 'resolved',
    priority: 'medium',
    assignee: '财务团队',
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-02-18T16:00:00Z',
    resolvedAt: '2024-02-18T16:00:00Z'
  },
  {
    id: 'fb-003',
    enterpriseId: 'ent-001',
    type: 'business',
    title: '希望增加批量发送功能',
    description: '消息推送能力希望能支持批量发送，提升运营效率',
    attachments: [],
    status: 'pending',
    priority: 'low',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  }
];

export const mockQuotaData = [
  { capabilityId: 'cap-003', name: '消息推送', quota: 100000, used: 32150 },
  { capabilityId: 'cap-002', name: '内容审核', quota: 50000, used: 12500 },
  { capabilityId: 'cap-001', name: '账号管理', quota: 10000, used: 2500 }
];