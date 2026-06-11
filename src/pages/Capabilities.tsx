import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge, CategoryBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { useCapabilityStore } from '@/stores/capabilityStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Grid,
  Search,
  Filter,
  User,
  Shield,
  Bell,
  Database,
  Fingerprint,
  MessageCircle,
  ArrowRight,
  BookOpen,
  Code
} from 'lucide-react';
import type { Capability } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  User: <User className="w-32 h-32" />,
  Shield: <Shield className="w-32 h-32" />,
  Bell: <Bell className="w-32 h-32" />,
  Database: <Database className="w-32 h-32" />,
  Fingerprint: <Fingerprint className="w-32 h-32" />,
  MessageCircle: <MessageCircle className="w-32 h-32" />
};

const categories = [
  { id: 'all', label: '全部', icon: <Grid className="w-16 h-16" /> },
  { id: 'account', label: '账号', icon: <User className="w-16 h-16" /> },
  { id: 'content', label: '内容', icon: <Shield className="w-16 h-16" /> },
  { id: 'message', label: '消息', icon: <Bell className="w-16 h-16" /> },
  { id: 'data', label: '数据', icon: <Database className="w-16 h-16" /> }
];

export function Capabilities() {
  const navigate = useNavigate();
  const { capabilities } = useCapabilityStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);

  const filteredCapabilities = capabilities.filter(cap => {
    const matchesCategory = selectedCategory === 'all' || cap.category === selectedCategory;
    const matchesSearch = cap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cap.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApply = (capability: Capability) => {
    navigate('/tickets/create', { state: { capabilityId: capability.id } });
  };

  return (
    <Layout>
      <div className="space-y-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">能力广场</h1>
            <p className="text-sm text-gray-500 mt-4">浏览和申请接入平台能力</p>
          </div>
        </div>

        <div className="flex items-center gap-16">
          <div className="flex-1 relative">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 w-16 h-16 text-gray-400" />
            <input
              type="text"
              placeholder="搜索能力名称或描述"
              className="w-full h-40 pl-40 pr-16 text-sm rounded-8 border border-gray-200 focus:border-[#38B2AC] focus:ring-2 focus:ring-[#38B2AC]/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-16 h-16" />}>
            筛选
          </Button>
        </div>

        <div className="flex items-center gap-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`
                flex items-center gap-8 px-16 py-8 rounded-8 text-sm font-medium
                transition-all duration-200
                ${selectedCategory === cat.id
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }
              `}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon}
              {cat.label}
              {selectedCategory === cat.id && (
                <span className="px-8 py-2 bg-white/20 rounded-full text-xs">
                  {filteredCapabilities.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-24">
          {filteredCapabilities.map(capability => (
            <Card
              key={capability.id}
              padding="lg"
              hover
              className="cursor-pointer"
              onClick={() => setSelectedCapability(capability)}
            >
              <div className="flex items-start gap-16 mb-16">
                <div className="w-56 h-56 rounded-12 bg-[#F7FAFC] flex items-center justify-center text-[#1E3A5F]">
                  {iconMap[capability.icon] || <Grid className="w-32 h-32" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-8">
                    <h3 className="text-lg font-semibold text-[#1E3A5F]">{capability.name}</h3>
                    <StatusBadge status={capability.status} />
                  </div>
                  <CategoryBadge category={capability.category} className="mt-8" />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-16 line-clamp-2">{capability.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-16">
                <span>配额：{capability.quota.toLocaleString()} 次/月</span>
                <span>¥{capability.price}/月</span>
              </div>
              
              <div className="flex items-center gap-8">
                {capability.status === 'available' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    icon={<ArrowRight className="w-16 h-16" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(capability);
                    }}
                  >
                    申请接入
                  </Button>
                )}
                {capability.status === 'active' && (
                  <Button variant="outline" size="sm" className="flex-1">
                    已上线
                  </Button>
                )}
                {capability.status === 'applied' && (
                  <Button variant="ghost" size="sm" className="flex-1">
                    审核中
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<BookOpen className="w-16 h-16" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCapability(capability);
                  }}
                >
                  详情
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        open={selectedCapability !== null}
        onClose={() => setSelectedCapability(null)}
        title={selectedCapability?.name}
        width="lg"
        footer={
          selectedCapability?.status === 'available' && (
            <Button
              variant="primary"
              icon={<ArrowRight className="w-16 h-16" />}
              onClick={() => handleApply(selectedCapability!)}
            >
              申请接入
            </Button>
          )
        }
      >
        {selectedCapability && (
          <div className="space-y-24">
            <div className="flex items-center gap-16">
              <div className="w-64 h-64 rounded-12 bg-[#F7FAFC] flex items-center justify-center text-[#1E3A5F]">
                {iconMap[selectedCapability.icon] || <Grid className="w-32 h-32" />}
              </div>
              <div>
                <div className="flex items-center gap-8 mb-8">
                  <CategoryBadge category={selectedCapability.category} />
                  <StatusBadge status={selectedCapability.status} />
                </div>
                <p className="text-sm text-gray-600">{selectedCapability.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-16 p-16 bg-[#F7FAFC] rounded-8">
              <div>
                <div className="text-xs text-gray-400">配额</div>
                <div className="text-lg font-semibold text-[#1E3A5F]">
                  {selectedCapability.quota.toLocaleString()} 次/月
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">价格</div>
                <div className="text-lg font-semibold text-[#1E3A5F]">
                  ¥{selectedCapability.price}/月
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-8 mb-12">
                <BookOpen className="w-16 h-16 text-[#38B2AC]" />
                <span className="text-sm font-medium text-[#1E3A5F]">能力说明</span>
              </div>
              <p className="text-sm text-gray-600">{selectedCapability.documentation}</p>
            </div>

            <div>
              <div className="flex items-center gap-8 mb-12">
                <Code className="w-16 h-16 text-[#38B2AC]" />
                <span className="text-sm font-medium text-[#1E3A5F]">接口文档</span>
              </div>
              <div className="space-y-8">
                {selectedCapability.apiSpec?.endpoints?.map((endpoint: any, index: number) => (
                  <div key={index} className="flex items-center gap-12 p-12 bg-gray-50 rounded-8">
                    <span className={`
                      px-8 py-2 rounded-4 text-xs font-medium
                      ${endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}
                    `}>
                      {endpoint.method}
                    </span>
                    <span className="text-sm text-gray-600">{endpoint.path}</span>
                    <span className="text-xs text-gray-400">{endpoint.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-8 mb-12">
                <Shield className="w-16 h-16 text-[#38B2AC]" />
                <span className="text-sm font-medium text-[#1E3A5F]">权限边界</span>
              </div>
              <div className="flex flex-wrap gap-8">
                {selectedCapability.permissions.map(perm => (
                  <span key={perm} className="px-12 py-6 bg-gray-50 rounded-6 text-xs text-gray-600">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}