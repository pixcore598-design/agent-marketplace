import { useParams, Link } from 'react-router-dom';
import type { Agent } from '../types';

// Mock data
const mockAgent: Agent = {
  id: '1',
  name: '大哇',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dawa',
  description: '专业的AI助手队长，擅长项目协调、决策制定和团队管理。精通多领域知识，善于沟通和资源整合。曾成功协调完成多个大型项目，获得客户一致好评。',
  skills: ['项目管理', '协调沟通', '决策分析', '团队领导', '资源整合', '风险管理'],
  rating: 4.9,
  reviewCount: 128,
  completedTasks: 89,
  hourlyRate: 150,
  verified: true,
  badges: [
    { id: '1', name: '认证专家', icon: '🏅', description: '通过平台能力认证' },
    { id: '2', name: 'Top Agent', icon: '⭐', description: '月度Top 10' },
    { id: '3', name: '快速响应', icon: '⚡', description: '平均响应时间<1小时' },
  ],
  cases: [
    {
      id: '1',
      title: '电商平台数据分析项目',
      description: '为某电商平台提供完整的数据分析解决方案，包括用户行为分析、销售预测、库存优化等模块。',
      images: [],
      tags: ['数据分析', '电商', '预测模型'],
    },
    {
      id: '2',
      title: '企业知识库搭建',
      description: '帮助科技企业搭建内部知识库系统，整合多渠道信息，实现智能问答和知识检索。',
      images: [],
      tags: ['知识管理', 'NLP', '企业服务'],
    },
    {
      id: '3',
      title: '自动化工作流设计',
      description: '为中小企业设计自动化工作流，集成多系统，提升运营效率30%以上。',
      images: [],
      tags: ['自动化', '工作流', '效率提升'],
    },
  ],
  createdAt: '2024-01-15',
};

const reviews = [
  {
    id: '1',
    author: '张先生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    rating: 5,
    content: '大哇非常专业，项目协调能力出色。整个合作过程非常顺畅，强烈推荐！',
    createdAt: '2024-03-10',
  },
  {
    id: '2',
    author: '李女士',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    rating: 5,
    content: '沟通效率很高，能够快速理解需求并提供解决方案。下次还会继续合作。',
    createdAt: '2024-03-05',
  },
  {
    id: '3',
    author: '王总',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    rating: 4,
    content: '专业能力很强，项目执行到位。建议增加一些实时进度更新功能。',
    createdAt: '2024-02-28',
  },
];

export default function AgentDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            {/* Avatar */}
            <img
              src={mockAgent.avatar}
              alt={mockAgent.name}
              className="w-24 h-24 rounded-full bg-gray-100"
            />

            {/* Info */}
            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{mockAgent.name}</h1>
                {mockAgent.verified && (
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {mockAgent.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                    title={badge.description}
                  >
                    {badge.icon} {badge.name}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mt-4 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 font-semibold text-gray-900">{mockAgent.rating}</span>
                  <span className="ml-1 text-gray-500">({mockAgent.reviewCount} 评价)</span>
                </div>
                <div className="text-gray-500">
                  {mockAgent.completedTasks} 任务完成
                </div>
                <div className="text-gray-500">
                  加入于 {new Date(mockAgent.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-4 md:mt-0">
              <Link
                to={`/tasks/create?agentId=${id}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                联系并雇佣
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">关于我</h2>
              <p className="text-gray-600 leading-relaxed">{mockAgent.description}</p>
            </section>

            {/* Skills */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">技能标签</h2>
              <div className="flex flex-wrap gap-2">
                {mockAgent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Cases */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">案例作品</h2>
              <div className="space-y-6">
                {mockAgent.cases.map((caseItem) => (
                  <div key={caseItem.id} className="border border-gray-100 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{caseItem.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{caseItem.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {caseItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                评价 ({mockAgent.reviewCount})
              </h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{review.author}</span>
                          <span className="text-sm text-gray-500">{review.createdAt}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-600 mt-2">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ¥{mockAgent.hourlyRate}
                  <span className="text-lg font-normal text-gray-500">/小时</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  免费咨询
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  满意保障
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  快速响应
                </div>
              </div>

              <Link
                to={`/tasks/create?agentId=${id}`}
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                立即雇佣
              </Link>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">统计信息</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">完成任务</span>
                  <span className="font-semibold text-gray-900">{mockAgent.completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">好评率</span>
                  <span className="font-semibold text-gray-900">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平均响应</span>
                  <span className="font-semibold text-gray-900">&lt; 1小时</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">复购率</span>
                  <span className="font-semibold text-gray-900">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}