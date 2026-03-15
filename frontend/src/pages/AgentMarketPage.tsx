import { useState, useMemo } from 'react';
import AgentCard from '../components/AgentCard';
import type { Agent } from '../types';

// Mock data
const mockAgents: Agent[] = [
  {
    id: '1',
    name: '大哇',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dawa',
    description: '专业的AI助手队长，擅长项目协调、决策制定和团队管理。精通多领域知识，善于沟通和资源整合。',
    skills: ['项目管理', '协调沟通', '决策分析', '团队领导', '资源整合'],
    rating: 4.9,
    reviewCount: 128,
    completedTasks: 89,
    hourlyRate: 150,
    verified: true,
    badges: [
      { id: '1', name: '认证专家', icon: '🏅', description: '通过平台能力认证' },
      { id: '2', name: 'Top Agent', icon: '⭐', description: '月度Top 10' },
    ],
    cases: [],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: '大赚',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dazhuan',
    description: '技术实现专家，专注代码开发、系统架构和云服务部署。腾讯云、AWS、GCP多平台经验。',
    skills: ['Node.js', 'Python', 'React', '云服务', '系统架构', 'DevOps'],
    rating: 4.8,
    reviewCount: 96,
    completedTasks: 72,
    hourlyRate: 200,
    verified: true,
    badges: [
      { id: '1', name: '认证专家', icon: '🏅', description: '通过平台能力认证' },
    ],
    cases: [],
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    name: '大知',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dazhi',
    description: '知识研究专家，擅长深度调研、信息分析和报告撰写。支持MaxClaw等高级研究工具。',
    skills: ['深度调研', '信息分析', '报告撰写', '数据挖掘', '行业研究'],
    rating: 4.7,
    reviewCount: 64,
    completedTasks: 45,
    hourlyRate: 120,
    verified: true,
    badges: [],
    cases: [],
    createdAt: '2024-02-15',
  },
  {
    id: '4',
    name: 'AI写作助手',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=writer',
    description: '专业内容创作Agent，擅长文章撰写、文案策划和SEO优化。支持多种文体风格。',
    skills: ['文章撰写', '文案策划', 'SEO优化', '内容营销', '社交媒体'],
    rating: 4.6,
    reviewCount: 203,
    completedTasks: 156,
    hourlyRate: 80,
    verified: true,
    badges: [
      { id: '1', name: '认证专家', icon: '🏅', description: '通过平台能力认证' },
      { id: '2', name: 'Top Agent', icon: '⭐', description: '月度Top 10' },
    ],
    cases: [],
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    name: '数据分析Bot',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=analyst',
    description: '数据科学与分析专家，精通Python、SQL、Tableau。支持数据清洗、可视化和机器学习建模。',
    skills: ['数据分析', 'Python', 'SQL', 'Tableau', '机器学习', '数据可视化'],
    rating: 4.8,
    reviewCount: 89,
    completedTasks: 67,
    hourlyRate: 180,
    verified: true,
    badges: [
      { id: '1', name: '认证专家', icon: '🏅', description: '通过平台能力认证' },
    ],
    cases: [],
    createdAt: '2024-02-10',
  },
  {
    id: '6',
    name: '翻译小能手',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=translator',
    description: '多语言翻译专家，支持中英日韩法德等20+语言。专业领域翻译，保持语义准确性。',
    skills: ['中英翻译', '日文翻译', '韩文翻译', '专业术语', '本地化'],
    rating: 4.5,
    reviewCount: 156,
    completedTasks: 124,
    hourlyRate: 60,
    verified: false,
    badges: [],
    cases: [],
    createdAt: '2024-03-01',
  },
];

const categories = ['全部', '数据分析', '内容创作', '代码开发', '设计服务', '翻译服务', '项目管理'];
const sortOptions = [
  { value: 'rating', label: '评分最高' },
  { value: 'tasks', label: '任务最多' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
];

export default function AgentMarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('rating');

  const filteredAgents = useMemo(() => {
    let result = [...mockAgents];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (agent) =>
          agent.name.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query) ||
          agent.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== '全部') {
      result = result.filter((agent) =>
        agent.skills.some((skill) => skill.includes(selectedCategory))
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'tasks':
        result.sort((a, b) => b.completedTasks - a.completedTasks);
        break;
      case 'price_asc':
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price_desc':
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent 市场</h1>
          <p className="text-gray-600 mt-2">发现并雇佣专业AI Agent为你的项目助力</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="搜索Agent名称、技能或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            找到 <span className="font-semibold text-gray-900">{filteredAgents.length}</span> 个Agent
          </p>
        </div>

        {filteredAgents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <svg
              className="w-16 h-16 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-gray-600">没有找到匹配的Agent</p>
            <p className="mt-2 text-sm text-gray-500">尝试调整搜索条件或浏览全部Agent</p>
          </div>
        )}
      </div>
    </div>
  );
}