# AgentMarket 部署指南 - Vercel + Supabase

本指南帮助你将 AgentMarket 部署到 Vercel + Supabase 架构。

## 架构说明

```
┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │    Vercel       │
│   (Frontend)    │────▶│   (Backend API) │
│   React + Vite  │     │   Serverless    │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    Supabase     │
                        │   PostgreSQL    │
                        │   + Auth (可选) │
                        └─────────────────┘
```

## 前置条件

- GitHub 账号
- Vercel 账号 (可用 GitHub 登录)
- Supabase 账号 (可用 GitHub 登录)

---

## Step 1: 创建 Supabase 项目

1. 访问 https://supabase.com 并登录
2. 点击 **New Project**
3. 填写项目信息：
   - Name: `agent-market`
   - Database Password: **保存好这个密码！**
   - Region: 选择离你最近的 (如 Singapore)
4. 点击 **Create new project**，等待约 2 分钟

### 获取数据库连接字符串

1. 进入项目后，点击左侧 **Project Settings** (齿轮图标)
2. 点击 **Database**
3. 找到 **Connection string** > **URI**
4. 复制连接字符串，格式如下：
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
   
### 执行数据库 Schema

1. 点击左侧 **SQL Editor**
2. 点击 **New query**
3. 复制 `backend/supabase.sql` 的全部内容
4. 点击 **Run** 执行

---

## Step 2: 推送代码到 GitHub

```bash
# 在项目根目录
cd /root/.openclaw/workspace/projects/agent-marketplace

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Prepare for Vercel + Supabase deployment"

# 创建 GitHub 仓库并推送
# 方法 1: 使用 gh CLI
gh repo create agent-marketplace --public --source=. --push

# 方法 2: 手动创建
# 1. 访问 https://github.com/new
# 2. 创建名为 agent-marketplace 的仓库
# 3. 运行:
git remote add origin https://github.com/YOUR_USERNAME/agent-marketplace.git
git push -u origin main
```

---

## Step 3: 部署后端到 Vercel

1. 访问 https://vercel.com 并用 GitHub 登录
2. 点击 **Add New** > **Project**
3. 选择你的 `agent-marketplace` 仓库
4. 配置项目：
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: 留空
   - **Output Directory**: 留空
5. 添加环境变量：
   
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | 你的 Supabase 数据库连接字符串 |
   | `JWT_SECRET` | 随机 32 位字符串 (可用 `openssl rand -base64 32` 生成) |
   | `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` (先填占位符，后面改) |
   | `NODE_ENV` | `production` |

6. 点击 **Deploy**
7. 等待部署完成，记下你的 API URL（如 `https://agent-market-api.vercel.app`）

### 后端部署配置文件

后端使用 `vercel.json` 配置，已创建在 `backend/vercel.json`。

---

## Step 4: 部署前端到 Vercel

1. 在 Vercel Dashboard，点击 **Add New** > **Project**
2. 再次选择 `agent-marketplace` 仓库
3. 配置项目：
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. 添加环境变量：
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | 你的后端 API URL (如 `https://agent-market-api.vercel.app`) |

5. 点击 **Deploy**
6. 等待部署完成

---

## Step 5: 更新 CORS 配置

1. 回到后端项目设置
2. 更新 `ALLOWED_ORIGINS` 环境变量为你的前端 URL
3. 重新部署后端

---

## 环境变量汇总

### 后端 (.env)
```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
JWT_SECRET=your-32-char-random-string
ALLOWED_ORIGINS=https://your-frontend.vercel.app
NODE_ENV=production
```

### 前端
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## 验证部署

### 1. 检查后端 API
```bash
curl https://your-backend.vercel.app/health
# 应返回: {"status":"ok","timestamp":"..."}

curl https://your-backend.vercel.app/api/agents
# 应返回: {"success":true,"data":{"agents":[],"pagination":{...}}}
```

### 2. 检查前端
访问你的前端 URL，应能看到 AgentMarket 页面。

### 3. 测试注册/登录
```bash
# 注册
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# 登录
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 常见问题

### Q: Prisma Client 报错
A: 需要在 Vercel 构建时生成 Prisma Client。在 `backend/package.json` 添加：
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Q: CORS 错误
A: 确保 `ALLOWED_ORIGINS` 包含你的前端完整 URL（包括 https://）。

### Q: 数据库连接失败
A: 
1. 检查 Supabase 项目是否正常运行
2. 确认 DATABASE_URL 格式正确
3. Supabase 免费版有连接数限制，Serverless 可能需要使用 Connection Pooling

---

## 下一步

- [ ] 配置自定义域名
- [ ] 设置 Supabase Auth 替代 JWT
- [ ] 添加 Supabase Storage 用于头像上传
- [ ] 配置 Supabase Realtime 用于实时通知

---

*Created by 大哇 @ 2026-03-15*