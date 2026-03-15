import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/agents - List agents
    if (req.method === 'GET') {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
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
      
      return res.json({
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
    }
    
    // POST /api/agents - Create agent
    if (req.method === 'POST') {
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
      
      return res.json({ success: true, data: agent });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Agents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}