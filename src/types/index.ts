export interface Enterprise {
  id: string;
  name: string;
  creditCode: string;
  type: 'technology' | 'finance' | 'retail' | 'manufacturing' | 'other';
  industry: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  enterpriseId: string;
  type: 'technical' | 'business' | 'emergency';
  name: string;
  phone: string;
  email: string;
}

export interface CallbackUrl {
  id: string;
  enterpriseId: string;
  url: string;
  type: 'notification' | 'event' | 'data';
  status: 'active' | 'inactive';
}

export interface Capability {
  id: string;
  name: string;
  category: 'account' | 'content' | 'message' | 'data';
  description: string;
  icon: string;
  status: 'available' | 'applied' | 'active' | 'suspended';
  permissions: string[];
  quota: number;
  price: number;
  documentation?: string;
  apiSpec?: Record<string, unknown>;
  examples?: ApiExample[];
}

export interface ApiExample {
  title: string;
  method: string;
  path: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
}

export interface Ticket {
  id: string;
  enterpriseId: string;
  capabilityId: string;
  capabilityName: string;
  type: 'access' | 'upgrade' | 'maintenance' | 'cancel';
  status: 'draft' | 'submitted' | 'assigned' | 'testing' | 'reviewing' | 'approved' | 'rejected';
  assignee?: Assignee;
  description: string;
  attachments: Attachment[];
  timeline: TimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

export interface TimelineItem {
  id: string;
  status: string;
  operator: string;
  comment?: string;
  timestamp: string;
}

export interface TestParams {
  id: string;
  ticketId: string;
  appId: string;
  appSecret: string;
  testAccounts: TestAccount[];
  sandboxUrl: string;
  expiresAt: string;
}

export interface TestAccount {
  id: string;
  username: string;
  password: string;
  type: 'admin' | 'user';
}

export interface Bill {
  id: string;
  enterpriseId: string;
  capabilityId: string;
  capabilityName: string;
  period: string;
  quota: number;
  usedQuota: number;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  paidAt?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  enterpriseId: string;
  type: 'technical' | 'business' | 'billing' | 'other';
  title: string;
  description: string;
  attachments: Attachment[];
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ServiceRating {
  id: string;
  feedbackId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  enterpriseId: string;
  name: string;
  email: string;
  role: 'admin' | 'technical' | 'finance';
  avatar?: string;
}

export interface ApiTestRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: Record<string, unknown>;
}

export interface ApiTestResponse {
  status: number;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  duration: number;
}

export interface AcceptanceCheckItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  checked: boolean;
}

export interface AcceptanceApplication {
  id: string;
  ticketId: string;
  productionConfig: {
    serverUrl: string;
    callbackUrl: string;
    ipWhitelist: string[];
  };
  checklist: AcceptanceCheckItem[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  rejectReason?: string;
}