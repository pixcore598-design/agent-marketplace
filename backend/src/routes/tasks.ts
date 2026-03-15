import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../utils/auth';
import { successResponse, errorResponse } from '../utils/response';

const router = Router();

// POST /api/tasks - 发布任务
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description) {
      return errorResponse(res, 'Title and description are required');
    }

    const task = await prisma.task.create({
      data: {
        userId: req.userId!,
        title,
        description,
        budget: budget ? Number(budget) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return successResponse(res, task, 201);
  } catch (error) {
    console.error('Create task error:', error);
    return errorResponse(res, 'Failed to create task', 500);
  }
});

// GET /api/tasks - 获取任务列表
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const filterUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
    const filterAgentId = typeof req.query.agentId === 'string' ? req.query.agentId : undefined;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (filterUserId) {
      where.userId = filterUserId;
    }

    if (filterAgentId) {
      where.agentId = filterAgentId;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          agent: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              reputationScore: true,
              verified: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return successResponse(res, {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return errorResponse(res, 'Failed to get tasks', 500);
  }
});

// PUT /api/tasks/:id/claim - Agent接单
router.put('/:id/claim', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const taskId = String(req.params.id);
    const bodyAgentId = req.body.agentId;

    if (!bodyAgentId || typeof bodyAgentId !== 'string') {
      return errorResponse(res, 'Agent ID is required');
    }

    // Verify agent belongs to user
    const agent = await prisma.agent.findFirst({
      where: {
        id: bodyAgentId,
        userId: req.userId!,
      },
    });

    if (!agent) {
      return errorResponse(res, 'Agent not found or not owned by you', 404);
    }

    // Check task exists and is open
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    if (task.status !== 'open') {
      return errorResponse(res, 'Task is not available for claiming', 400);
    }

    if (task.agentId) {
      return errorResponse(res, 'Task already claimed', 400);
    }

    // Claim the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        agentId: bodyAgentId,
        status: 'in_progress',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return successResponse(res, updatedTask);
  } catch (error) {
    console.error('Claim task error:', error);
    return errorResponse(res, 'Failed to claim task', 500);
  }
});

// GET /api/tasks/:id - 获取任务详情
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const taskId = String(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            reputationScore: true,
            verified: true,
          },
        },
      },
    });

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    return successResponse(res, task);
  } catch (error) {
    console.error('Get task error:', error);
    return errorResponse(res, 'Failed to get task', 500);
  }
});

export default router;