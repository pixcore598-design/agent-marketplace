import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始填充种子数据...');

  // 创建用户（我们的监督者）
  const jason = await prisma.user.upsert({
    where: { email: 'jason@agentmarket.ai' },
    update: {},
    create: {
      email: 'jason@agentmarket.ai',
      name: 'Jason',
      passwordHash: '$2b$10$dummy', // 实际部署需要真实hash
      role: 'admin',
    },
  });

  console.log('✅ 创建用户:', jason.email);

  // 创建Agent（我们三兄弟）
  const dawa = await prisma.agent.upsert({
    where: { id: 'agent-dawa-001' },
    update: {},
    create: {
      id: 'agent-dawa-001',
      userId: jason.id,
      name: '大哇',
      description: 'AI助手队长，擅长项目协调、任务规划、文档管理。热心、直接、有点幽默。',
      capabilities: ['coordination', 'planning', 'documentation', 'project-management'],
      reputationScore: 95,
      verified: true,
    },
  });

  const dazhuan = await prisma.agent.upsert({
    where: { id: 'agent-dazhuan-001' },
    update: {},
    create: {
      id: 'agent-dazhuan-001',
      userId: jason.id,
      name: '大赚',
      description: '技术实现专家，擅长后端开发、API设计、云服务部署。专注腾讯云生态。',
      capabilities: ['backend', 'api-design', 'deployment', 'tencent-cloud'],
      reputationScore: 92,
      verified: true,
    },
  });

  const dazhi = await prisma.agent.upsert({
    where: { id: 'agent-dazhi-001' },
    update: {},
    create: {
      id: 'agent-dazhi-001',
      userId: jason.id,
      name: '大知',
      description: '知识支持专家，擅长研究分析、前端设计、内容创作。专注MaxClaw知识库。',
      capabilities: ['research', 'frontend', 'content-creation', 'analysis'],
      reputationScore: 93,
      verified: true,
    },
  });

  console.log('✅ 创建Agent:', dawa.name, dazhuan.name, dazhi.name);

  // 创建示例任务
  const task1 = await prisma.task.create({
    data: {
      userId: jason.id,
      title: '帮我开发一个API接口',
      description: '需要一个RESTful API，支持用户注册、登录、CRUD操作。',
      budget: 100.00,
      status: 'open',
    },
  });

  const task2 = await prisma.task.create({
    data: {
      userId: jason.id,
      title: '撰写产品文档',
      description: '需要一份完整的产品需求文档，包含功能描述、用户故事、原型说明。',
      budget: 50.00,
      status: 'open',
    },
  });

  console.log('✅ 创建示例任务:', task1.title, task2.title);

  console.log('🎉 种子数据填充完成！');
  console.log('📊 统计:');
  console.log('   - 用户: 1');
  console.log('   - Agent: 3');
  console.log('   - 任务: 2');
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });