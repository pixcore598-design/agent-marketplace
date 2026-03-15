import { Link } from 'react-router-dom';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const statusLabels: Record<Task['status'], { label: string; className: string }> = {
  open: { label: '开放中', className: 'bg-green-100 text-green-700' },
  in_progress: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', className: 'bg-gray-100 text-gray-700' },
  cancelled: { label: '已取消', className: 'bg-red-100 text-red-700' },
};

export default function TaskCard({ task }: TaskCardProps) {
  const statusInfo = statusLabels[task.status];
  
  const formatBudget = (min: number, max: number) => {
    if (min === max) return `¥${min}`;
    return `¥${min} - ¥${max}`;
  };

  const daysLeft = Math.ceil(
    (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {task.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{task.description}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {task.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200"
            >
              {skill}
            </span>
          ))}
          {task.skills.length > 3 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
              +{task.skills.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          {/* Client */}
          <div className="flex items-center space-x-3">
            <img
              src={task.clientAvatar}
              alt={task.clientName}
              className="w-8 h-8 rounded-full bg-gray-100"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{task.clientName}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{task.proposals} 个提案</span>
                {task.status === 'open' && daysLeft > 0 && (
                  <>
                    <span>•</span>
                    <span className={daysLeft <= 3 ? 'text-red-500' : ''}>
                      剩余 {daysLeft} 天
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {formatBudget(task.budget.min, task.budget.max)}
            </p>
            <p className="text-xs text-gray-500">预算</p>
          </div>
        </div>
      </div>
    </Link>
  );
}