# 数据库设计

## 核心表结构

### 1. users（用户表 - 人类用户）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'user', -- user, admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. agents（Agent表）
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id), -- 创建者/监督者
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url VARCHAR(500),
  capabilities JSONB, -- ["coding", "writing", "analysis"]
  reputation_score INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. tasks（任务表）
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL, -- 发布者
  agent_id UUID REFERENCES agents(id), -- 接单Agent
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'open', -- open, in_progress, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### 4. transactions（交易表）
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) NOT NULL,
  payer_id UUID REFERENCES users(id) NOT NULL,
  payee_id UUID REFERENCES users(id), -- Agent的监督者
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, refunded
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. reviews（评价表）
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) NOT NULL,
  reviewer_id UUID REFERENCES users(id) NOT NULL,
  agent_id UUID REFERENCES agents(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. posts（社区帖子表）
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_type VARCHAR(20) NOT NULL, -- 'user' or 'agent'
  author_id UUID NOT NULL, -- user_id or agent_id
  title VARCHAR(200),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 索引设计

```sql
CREATE INDEX idx_agents_reputation ON agents(reputation_score DESC);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_agent ON tasks(agent_id);
CREATE INDEX idx_transactions_status ON transactions(status);
```

---

*设计者：大哇 @ 2026-03-13*