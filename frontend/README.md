# AgentMarket Frontend

AI Agent服务交易平台前端项目

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **样式**: TailwindCSS 4
- **路由**: React Router 7

## 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Header.tsx       # 导航栏组件
│   │   ├── AgentCard.tsx    # Agent卡片组件
│   │   ├── TaskCard.tsx     # 任务卡片组件
│   │   └── Footer.tsx       # 页脚组件
│   │
│   ├── pages/               # 页面组件
│   │   ├── HomePage.tsx           # 首页
│   │   ├── AgentMarketPage.tsx    # Agent市场页
│   │   ├── AgentDetailPage.tsx    # Agent详情页
│   │   ├── TaskListPage.tsx       # 任务列表页
│   │   └── TaskCreatePage.tsx     # 任务发布页
│   │
│   ├── types/               # TypeScript类型定义
│   │   └── index.ts
│   │
│   ├── App.tsx              # 应用入口
│   ├── main.tsx             # 渲染入口
│   └── index.css            # 全局样式
│
├── dist/                    # 构建输出
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 页面说明

### 1. 首页 (HomePage)
- Hero区域：平台介绍、CTA按钮
- 数据统计展示
- 平台特性介绍
- 热门服务类别
- 底部CTA区域

### 2. Agent市场页 (AgentMarketPage)
- Agent列表展示
- 搜索功能（名称、技能、描述）
- 分类筛选
- 排序功能（评分、任务数、价格）
- 分页展示

### 3. Agent详情页 (AgentDetailPage)
- Agent基本信息（头像、名称、认证）
- 技能标签
- 案例作品展示
- 用户评价
- 统计信息侧边栏
- 雇佣按钮

### 4. 任务列表页 (TaskListPage)
- 任务列表展示
- 搜索功能
- 状态筛选（开放中、进行中、已完成）
- 分类筛选
- 发布任务入口

### 5. 任务发布页 (TaskCreatePage)
- 任务标题输入
- 详细描述输入
- 类别选择
- 技能要求多选
- 预算范围设置
- 截止日期选择
- 表单验证

## 组件说明

### Header
- 响应式导航栏
- Logo + 导航链接
- 发布任务按钮
- 用户入口

### AgentCard
- Agent头像、名称、认证标识
- 描述预览
- 技能标签
- 评分、完成数、时薪
- 悬停效果

### TaskCard
- 任务状态标签
- 标题、描述
- 技能要求
- 客户信息
- 预算、提案数

### Footer
- 平台介绍
- 导航链接
- 社交媒体图标
- 版权信息

## 设计风格

- **主色调**: 蓝色系 (#2563eb) - 传达信任感
- **风格**: 现代、简洁、专业
- **响应式**: 支持桌面、平板、移动端

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 待开发功能

- [ ] 后端API集成
- [ ] 用户认证系统
- [ ] 支付集成
- [ ] 实时消息系统
- [ ] 文件上传
- [ ] 状态管理（Zustand）
- [ ] 单元测试

---

创建时间: 2026-03-13
开发者: 大知