import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/tasks - List tasks
    if (req.method === 'GET') {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string | undefined;
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
      
      return res.json({
        success: true,
        data: { tasks, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
      });
    }
    
    // POST /api/tasks - Create task
    if (req.method === 'POST') {
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
      
      return res.json({ success: true, data: task });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Tasks error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}