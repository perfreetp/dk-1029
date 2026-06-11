import { http, HttpResponse, delay } from 'msw';
import {
  mockUser,
  mockEnterprise,
  mockCapabilities,
  mockTickets,
  mockBills,
  mockFeedbacks,
  mockTestParams,
  mockQuotaData
} from './data';

export const handlers = [
  http.get('/api/user', async () => {
    await delay(200);
    return HttpResponse.json(mockUser);
  }),

  http.get('/api/enterprise/:id', async () => {
    await delay(200);
    return HttpResponse.json(mockEnterprise);
  }),

  http.put('/api/enterprise/:id', async ({ request }) => {
    await delay(300);
    const body = await request.json();
    const updated = { ...mockEnterprise, ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(updated);
  }),

  http.get('/api/capabilities', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    
    let filtered = mockCapabilities;
    if (category) {
      filtered = filtered.filter(c => c.category === category);
    }
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    return HttpResponse.json(filtered);
  }),

  http.get('/api/capabilities/:id', async ({ params }) => {
    await delay(200);
    const capability = mockCapabilities.find(c => c.id === params.id);
    if (!capability) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(capability);
  }),

  http.get('/api/tickets', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let filtered = mockTickets;
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    return HttpResponse.json(filtered);
  }),

  http.get('/api/tickets/:id', async ({ params }) => {
    await delay(200);
    const ticket = mockTickets.find(t => t.id === params.id);
    if (!ticket) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(ticket);
  }),

  http.post('/api/tickets', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;
    const capability = mockCapabilities.find(c => c.id === body.capabilityId);
    const newTicket = {
      id: `ticket-${Date.now()}`,
      enterpriseId: mockEnterprise.id,
      capabilityId: body.capabilityId,
      capabilityName: capability?.name || '',
      type: body.type,
      status: 'draft',
      description: body.description,
      attachments: [],
      timeline: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTickets.push(newTicket);
    return HttpResponse.json(newTicket);
  }),

  http.post('/api/tickets/:id/submit', async ({ params }) => {
    await delay(300);
    const ticket = mockTickets.find(t => t.id === params.id);
    if (!ticket) {
      return new HttpResponse(null, { status: 404 });
    }
    ticket.status = 'submitted';
    ticket.timeline.push({
      id: `tl-${Date.now()}`,
      status: 'submitted',
      operator: mockUser.name,
      timestamp: new Date().toISOString()
    });
    ticket.updatedAt = new Date().toISOString();
    return HttpResponse.json(ticket);
  }),

  http.get('/api/test-params/:ticketId', async () => {
    await delay(200);
    return HttpResponse.json(mockTestParams);
  }),

  http.get('/api/bills', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let filtered = mockBills;
    if (status) {
      filtered = filtered.filter(b => b.status === status);
    }
    return HttpResponse.json(filtered);
  }),

  http.get('/api/bills/:id', async ({ params }) => {
    await delay(200);
    const bill = mockBills.find(b => b.id === params.id);
    if (!bill) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(bill);
  }),

  http.post('/api/bills/:id/pay', async ({ params }) => {
    await delay(500);
    const bill = mockBills.find(b => b.id === params.id);
    if (!bill) {
      return new HttpResponse(null, { status: 404 });
    }
    bill.status = 'paid';
    bill.paidAt = new Date().toISOString();
    return HttpResponse.json(bill);
  }),

  http.get('/api/quota', async () => {
    await delay(200);
    return HttpResponse.json(mockQuotaData);
  }),

  http.get('/api/feedbacks', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    
    let filtered = mockFeedbacks;
    if (status) {
      filtered = filtered.filter(f => f.status === status);
    }
    if (type) {
      filtered = filtered.filter(f => f.type === type);
    }
    return HttpResponse.json(filtered);
  }),

  http.get('/api/feedbacks/:id', async ({ params }) => {
    await delay(200);
    const feedback = mockFeedbacks.find(f => f.id === params.id);
    if (!feedback) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(feedback);
  }),

  http.post('/api/feedbacks', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;
    const newFeedback = {
      id: `fb-${Date.now()}`,
      enterpriseId: mockEnterprise.id,
      type: body.type,
      title: body.title,
      description: body.description,
      attachments: [],
      status: 'pending',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockFeedbacks.push(newFeedback);
    return HttpResponse.json(newFeedback);
  }),

  http.post('/api/sandbox/test', async ({ request }) => {
    await delay(800);
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true, data: { request: body } },
      duration: Math.floor(Math.random() * 500) + 100
    });
  })
];