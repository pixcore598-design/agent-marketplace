import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = new Hono();

// CORS
app.use('*', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || '*',
  credentials: true,
}));

// Auth routes
app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    });
    
    const { email, password, name } = schema.parse(body);
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ error: 'Email already registered' }, 400);
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );
    
    return c.json({ 
      success: true, 
      data: { token, user: { id: user.id, email: user.email, name: user.name } } 
    });
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed' }, 400);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );
    
    return c.json({ 
      success: true, 
      data: { token, user: { id: user.id, email: user.email, name: user.name } } 
    });
  } catch (error) {
    return c.json({ error: 'Login failed' }, 500);
  }
});

app.get('/api/auth/me', async (c) => {
  try {
    const auth = c.req.header('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return c.json({ error: 'No token' }, 401);
    }
    
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, avatarUrl: true, role: true }
    });
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ success: true, data: user });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// Agent routes
app.get('/api/agents', async (c) => {
  try {
    const page = Number(c.req.query('page') || 1);
    const limit = Number(c.req.query('limit') || 10);
    const skip = (page - 1) * limit;
    
    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        skip,
        take: limit,
        include: { 
          user: { select: { name: true } },
          _count: { select: { tasks: true, reviews: true } }
        },
        orderBy: { reputationScore: 'desc' }
      }),
      prisma.agent.count()
    ]);
    
    return c.json({
      success: true,
      data: {
        agents: agents.map(a => ({
          id: a.id,
          name: a.name,
          description: a.description,
          avatar: a.avatarUrl,
          capabilities: a.capabilities,
          rating: a.reputationScore / 20,
          verified: a.verified,
          completedTasks: a._count.tasks,
          hourlyRate: 100,
          skills: Array.isArray(a.capabilities) ? a.capabilities : [],
        })),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch agents' }, 500);
  }
});

app.post('/api/agents', async (c) => {
  try {
    const auth = c.req.header('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return c.json({ error: 'No token' }, 401);
    }
    
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    const body = await c.req.json();
    const agent = await prisma.agent.create({
      data: {
        userId: decoded.userId,
        name: body.name,
        description: body.description,
        capabilities: body.capabilities,
        avatarUrl: body.avatarUrl,
      }
    });
    
    return c.json({ success: true, data: agent });
  } catch (error) {
    return c.json({ error: 'Failed to create agent' }, 500);
  }
});

app.get('/api/agents/:id', async (c) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: c.req.param('id') },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        tasks: { take: 5, orderBy: { createdAt: 'desc' } },
      }
    });
    
    if (!agent) {
      return c.json({ error: 'Agent not found' }, 404);
    }
    
    return c.json({ success: true, data: agent });
  } catch (error) {
    return c.json({ error: 'Failed to fetch agent' }, 500);
  }
});

// Task routes
app.get('/api/tasks', async (c) => {
  try {
    const page = Number(c.req.query('page') || 1);
    const limit = Number(c.req.query('limit') || 10);
    const status = c.req.query('status');
    const skip = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: { 
          user: { select: { name: true } },
          agent: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);
    
    return c.json({
      success: true,
      data: { tasks, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch tasks' }, 500);
  }
});

app.post('/api/tasks', async (c) => {
  try {
    const auth = c.req.header('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return c.json({ error: 'No token' }, 401);
    }
    
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    const body = await c.req.json();
    const task = await prisma.task.create({
      data: {
        userId: decoded.userId,
        title: body.title,
        description: body.description,
        budget: body.budget ? Number(body.budget) : null,
      }
    });
    
    return c.json({ success: true, data: task });
  } catch (error) {
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404));

export default app;