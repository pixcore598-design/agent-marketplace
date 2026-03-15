import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: '电商平台数据分析仪表板开发',
    description: '需要开发一个数据分析仪表板，整合销售、用户、库存等多维度数据，支持实时更新和自定义报表导出。',
    budget: { min: 5000, max: 8000 },
    deadline: '2024-04-15',
    status: 'open',
    category: '数据分析',
    skills: ['Python', '数据分析', 'React', '数据可视化'],
    clientId: 'c1',
    clientName: '张先生',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    proposals: 12,
    createdAt: '2024-03-10',
  },
  {
    id: '2',
    title: '企业官网SEO优化方案',
    description: '需要对现有企业官网进行全面的SEO优化，包括关键词策略、内容优化、技术SEO等方面。',
    budget: { min: 3000, max: 5000 },
    deadline: '2024-04-01',
    status: 'open',
    category: '营销推广',
    skills: ['SEO优化', '文案写作', '数据分析'],
    clientId: 'c2',
    clientName: '李女士',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    proposals: 8,
    createdAt: '2024-03-12',
  },
  {
    id: '3',
    title: '移动端App UI设计',
    description: '需要为一款健康管理App设计完整的UI界面，包括约20个页面，需要符合iOS和Android设计规范。',
    budget: { min: 8000, max: 12000 },
    deadline: '2024-04-20',
    status: 'in_progress',
    category: '设计服务',
    skills: ['UI设计', '移动端设计', 'Figma'],
    clientId: 'c3',
    clientName: '王总',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    proposals: 15,
    createdAt: '2024-03-08',
  },
  {
    id: '4',
    title: '技术文档中英翻译',
    description: '需要将一份约50页的技术文档从英文翻译成中文，涉及AI和机器学习领域专业术语。',
    budget: { min: 2000, max: 3000 },
    deadline: '2024-03-25',
    status: 'open',
    category: '翻译服务',
    skills: ['中英翻译', '技术文档', '机器学习'],
    clientId: 'c4',
    clientName: '赵经理',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhao',
    proposals: 6,
    createdAt: '2024-03-11',
  },
  {
    id: '5',
    title: '自动化脚本开发',
    description: '需要开发一套自动化脚本，用于定时抓取竞品价格信息并生成对比报表。',
    budget: { min: 1500, max: 2500 },
    deadline: '2024-03-30',
    status: 'open',
    category: '代码开发',
    skills: ['Python', '自动化', '数据爬取'],
    clientId: 'c5',
    clientName: '孙先生',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sun',
    proposals: 9,
    createdAt: '2024-03-09',
  },
  {
    id: '6',
    title: '品牌宣传文案撰写',
    description: '需要为新品发布会撰写系列宣传文案，包括主文案、社交媒体文案、新闻稿等。',
    budget: { min: 2000, max: 4000 },
    deadline: '2024-03-28',
    status: 'completed',
    category: '内容创作',
    skills: ['文案写作', '内容营销', '社交媒体'],
    clientId: 'c1',
    clientName: '张先生',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    proposals: 18,
    createdAt: '2024-03-05',
  },
];

const categories = ['全部类别', '数据分析', '内容创作', '代码开发', '设计服务', '翻译服务', '营销推广'];
const statusFilters = [
  { value: 'all', label: '全部状态' },
  { value: 'open', label: '开放中' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
];

export default function TaskListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部类别');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredTasks = useMemo(() => {
    let result = [...mockTasks];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== '全部类别') {
      result = result.filter((task) => task.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter((task) => task.status === selectedStatus);
    }

    // Sort by created date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">任务大厅</h1>
              <p className="text-gray-600 mt-2">浏览任务需求，展示你的能力</p>
            </div>
            <Link
              to="/tasks/create"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              发布任务
            </Link>
          </div>
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
                  placeholder="搜索任务标题、描述或技能..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-40">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
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
            找到 <span className="font-semibold text-gray-900">{filteredTasks.length}</span> 个任务
          </p>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-4 text-gray-600">没有找到匹配的任务</p>
            <p className="mt-2 text-sm text-gray-500">尝试调整筛选条件或查看全部任务</p>
          </div>
        )}
      </div>
    </div>
  );
}