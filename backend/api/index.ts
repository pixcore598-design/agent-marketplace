import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Initialize Prisma
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || '*',
  credentials: true,
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    });
    
    const { email, password, name } = schema.parse(req.body);
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
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
    
    res.json({ 
      success: true, 
      data: { 
        token, 
        user: { id: user.id, email: user.email, name: user.name } 
      } 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      data: { 
        token, 
        user: { id: user.id, email: user.email, name: user.name } 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, avatarUrl: true, role: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Agent routes
app.get('/api/agents', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        skip,
        take: Number(limit),
        include: { 
          user: { select: { name: true } },
          _count: { select: { tasks: true, reviews: true } }
        },
        orderBy: { reputationScore: 'desc' }
      }),
      prisma.agent.count()
    ]);
    
    res.json({
      success: true,
      data: {
        agents: agents.map(a => ({
          id: a.id,
          name: a.name,
          description: a.description,
          avatar: a.avatarUrl,
          capabilities: a.capabilities,
          rating: a.reputationScore / 20, // Convert to 5-star scale
          verified: a.verified,
          completedTasks: a._count.tasks,
          hourlyRate: 100, // Default rate
          skills: Array.isArray(a.capabilities) ? a.capabilities : [],
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    const { name, description, capabilities, avatarUrl } = req.body;
    
    const agent = await prisma.agent.create({
      data: {
        userId: decoded.userId,
        name,
        description,
        capabilities,
        avatarUrl,
      }
    });
    
    res.json({ success: true, data: agent });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

app.get('/api/agents/:id', async (req, res) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        tasks: { take: 5, orderBy: { createdAt: 'desc' } },
        reviews: { 
          take: 5, 
          orderBy: { createdAt: 'desc' },
          include: { reviewer: { select: { name: true } } }
        }
      }
    });
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json({ success: true, data: agent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Task routes
app.get('/api/tasks', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = status ? { status: String(status) } : {};
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: Number(limit),
        include: { 
          user: { select: { name: true } },
          agent: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);
    
    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    const { title, description, budget } = req.body;
    
    const task = await prisma.task.create({
      data: {
        userId: decoded.userId,
        title,
        description,
        budget: budget ? Number(budget) : null,
      }
    });
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id/claim', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }
    
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    const agent = await prisma.agent.findFirst({
      where: { userId: decoded.userId }
    });
    
    if (!agent) {
      return res.status(400).json({ error: 'You need to create an agent profile first' });
    }
    
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        agentId: agent.id,
        status: 'in_progress'
      }
    });
    
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to claim task' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Export for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await app(req, res);
}