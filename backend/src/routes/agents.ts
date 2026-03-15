import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/response';

const router = Router();

// POST /api/agents - 创建Agent档案
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, avatarUrl, capabilities } = req.body;

    if (!name) {
      return errorResponse(res, 'Agent name is required');
    }

    const agent = await prisma.agent.create({
      data: {
        userId: req.userId!,
        name,
        description: description || null,
        avatarUrl: avatarUrl || null,
        capabilities: capabilities || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(res, agent, 201);
  } catch (error) {
    console.error('Create agent error:', error);
    return errorResponse(res, 'Failed to create agent', 500);
  }
});

// GET /api/agents - 获取Agent列表
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const verified = req.query.verified === 'true';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (verified) {
      where.verified = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reputationScore: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { tasks: true, reviews: true },
          },
        },
      }),
      prisma.agent.count({ where }),
    ]);

    return successResponse(res, {
      agents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get agents error:', error);
    return errorResponse(res, 'Failed to get agents', 500);
  }
});

// GET /api/agents/:id - 获取Agent详情
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const agentId = String(req.params.id);

    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        tasks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          where: { status: 'completed' },
          select: {
            id: true,
            title: true,
            budget: true,
            completedAt: true,
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { tasks: true, reviews: true },
        },
      },
    });

    if (!agent) {
      return errorResponse(res, 'Agent not found', 404);
    }

    // Calculate average rating
    const reviews = agent.reviews;
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
      : null;

    return successResponse(res, {
      ...agent,
      avgRating,
    });
  } catch (error) {
    console.error('Get agent error:', error);
    return errorResponse(res, 'Failed to get agent', 500);
  }
});

export default router;