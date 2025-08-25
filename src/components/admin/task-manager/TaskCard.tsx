import React from 'react';
import Card from 'components/card';
import Checkbox from 'components/checkbox';
import { Task } from 'types/task';
import { MdPriorityHigh, MdSchedule, MdPerson, MdEdit, MdDelete } from 'react-icons/md';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onToggle?: (taskId: number, currentStatus: string) => void;
  onDelete?: (taskId: number) => void; // Add onDelete prop
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onToggle, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const [date] = dateString.split('T');
    return date.split('-').reverse().join('-');
  };

  const isOverdue = task.due_date ? new Date(task.due_date) < new Date() : false;

    return (
    <Card extra="p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => onDelete?.(task.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Task"
          >
            <MdDelete className="h-5 w-5" />
          </button>
          <h3 className={`text-lg font-bold text-navy-700 dark:text-white line-clamp-2 ${
            task.status === 'closed' ? 'line-through text-gray-400 dark:text-gray-500' : ''
          }`}>
            {task.title}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit?.(task)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit Task"
          >
            <MdEdit className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 ${
          task.status === 'closed' ? 'line-through' : ''
        }`}>
          {task.description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdPerson className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {task.assigned_to?.full_name || 'Unassigned'}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdSchedule className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
              {formatDate(task.due_date)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MdPriorityHigh className={`h-4 w-4 ${
              task.priority === 'high' ? 'text-red-500' : 
              task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
            }`} />
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard; 