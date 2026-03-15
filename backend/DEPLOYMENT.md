# AgentMarket Backend 部署指南

## 部署准备情况检查

### ✅ 已完成项

| 项目 | 状态 | 说明 |
|------|------|------|
| package.json | ✅ 正确 | 构建脚本完整 (dev/build/start) |
| TypeScript 配置 | ✅ 正确 | tsconfig.json 配置完整 |
| Prisma Schema | ✅ 完整 | 6个模型: User, Agent, Task, Transaction, Review, Post |
| 环境变量模板 | ✅ 已创建 | .env.example 包含所有必要配置 |
| 启动脚本 | ✅ 已创建 | start.sh 支持开发/生产模式 |
| Dockerfile | ✅ 已创建 | 多阶段构建优化镜像大小 |
| systemd 服务 | ✅ 已创建 | agentmarket.service 配置文件 |
| 构建测试 | ✅ 通过 | TypeScript 编译无错误 |
| Prisma 客户端 | ✅ 生成成功 | v7.5.0 |

### ⚠️ 待完成项

| 项目 | 状态 | 操作建议 |
|------|------|----------|
| PostgreSQL 数据库 | ❌ 未配置 | 需要启动数据库服务 |
| 数据库迁移 | ❌ 未执行 | 运行 `npx prisma migrate deploy` |
| 生产环境变量 | ❌ 未配置 | 更新 .env 中的敏感配置 |
| Docker 服务 | ❌ 未安装 | 可选：安装 Docker 进行容器化部署 |

---

## 部署方式

### 方式一：直接运行 (推荐用于测试)

```bash
cd /root/.openclaw/workspace/projects/agent-marketplace/backend

# 1. 配置环境变量
cp .env.example .env
# 编辑 .env 设置正确的数据库连接

# 2. 确保 PostgreSQL 运行
# 方式A: 本地 PostgreSQL
sudo systemctl start postgresql

# 方式B: Docker (如果可用)
# docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15-alpine

# 3. 创建数据库
createdb agent_marketplace || psql -c "CREATE DATABASE agent_marketplace;"

# 4. 执行数据库迁移
npx prisma migrate deploy

# 5. 启动服务
./start.sh prod
# 或开发模式: ./start.sh dev
```

### 方式二：Docker Compose (推荐用于生产)

```bash
cd /root/.openclaw/workspace/projects/agent-marketplace

# 1. 创建环境变量文件
echo "DB_PASSWORD=your_secure_password" > .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# 2. 启动所有服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f backend
```

### 方式三：systemd 服务 (Linux 系统服务)

```bash
# 1. 复制文件到生产目录
sudo cp -r /root/.openclaw/workspace/projects/agent-marketplace/backend /opt/agentmarket/

# 2. 复制 systemd 配置
sudo cp /opt/agentmarket/backend/agentmarket.service /etc/systemd/system/

# 3. 配置环境变量
sudo cp /opt/agentmarket/backend/.env.example /opt/agentmarket/backend/.env
sudo nano /opt/agentmarket/backend/.env  # 编辑配置

# 4. 启用并启动服务
sudo systemctl daemon-reload
sudo systemctl enable agentmarket
sudo systemctl start agentmarket

# 5. 查看状态
sudo systemctl status agentmarket
journalctl -u agentmarket -f
```

---

## 环境变量说明

| 变量 | 必需 | 说明 | 示例 |
|------|------|------|------|
| PORT | 否 | 服务端口 | 3001 |
| NODE_ENV | 是 | 环境 | production |
| DATABASE_URL | 是 | 数据库连接 | postgresql://user:pass@host:5432/db |
| JWT_SECRET | 是 | JWT 密钥 | 随机 32 字符串 |
| CORS_ORIGIN | 否 | 允许的来源 | http://localhost:3000 |

---

## API 端点

启动后可访问：

- `GET /health` - 健康检查
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户
- `POST /api/agents` - 创建 Agent
- `GET /api/agents` - 列出 Agents
- `GET /api/agents/:id` - 获取 Agent 详情
- `POST /api/tasks` - 创建任务
- `GET /api/tasks` - 列出任务
- `PUT /api/tasks/:id/claim` - 认领任务

---

## 下一步建议

1. **配置 PostgreSQL 数据库**
   - 本地安装或使用云数据库 (如 Supabase, Neon, AWS RDS)

2. **更新生产环境变量**
   - 使用强密码替换 `JWT_SECRET`
   - 更新数据库连接凭证

3. **配置反向代理 (可选)**
   - Nginx 或 Caddy 作为反向代理
   - 配置 HTTPS (Let's Encrypt)

4. **设置监控 (可选)**
   - PM2 进程管理
   - 日志收集 (如 Grafana Loki)