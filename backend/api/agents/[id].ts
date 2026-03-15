import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { id } = req.query;
    
    const agent = await prisma.agent.findUnique({
      where: { id: String(id) },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        tasks: { take: 5, orderBy: { createdAt: 'desc' } },
      }
    });
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    return res.json({ success: true, data: agent });
  } catch (error) {
    console.error('Agent error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}