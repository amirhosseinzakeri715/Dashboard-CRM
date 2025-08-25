import React from 'react';
import clsx from 'clsx';
import { Task } from 'types/task';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete, onView }) => (
  <div className="overflow-x-auto">
    <table className="min-w-max w-full">
      <thead className="border-b border-gray-200">
        <tr>
          <th className="w-6"></th>
          <th className="text-sm font-bold text-gray-600 dark:text-white pb-2">TASK TITLE</th>
          <th className="hidden md:table-cell text-sm font-bold text-gray-600 dark:text-white pb-2">PRIORITY</th>
          {/* <th className="text-sm font-bold text-gray-600 dark:text-white pb-2">ASSIGNED TO</th> */}
          {/* <th className="text-sm font-bold text-gray-600 dark:text-white pb-2">DUE DATE</th> */}
          <th className="hidden md:table-cell text-sm font-bold text-gray-600 dark:text-white pb-2">STATUS</th>
          <th className="text-sm font-bold text-gray-600 dark:text-white pb-2 text-center">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-500">
              No tasks found
            </td>
          </tr>
        ) : (
          tasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={e => {
                if ((e.target as Element).closest('.task-action-btn')) return;
                onView(task);
              }}
            >
              <td className="py-4">
                {/* Placeholder for checkbox or icon */}
              </td>
              <td className="py-4 text-sm font-bold text-navy-700 dark:text-white">
                {task.title}
                <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">{task.description?.substring(0, 50)}...</div>
              </td>
              <td className="hidden md:table-cell py-4 text-sm font-medium">
                <span className={clsx(
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                )}>
                  {task.priority?.toUpperCase()}
                </span>
              </td>
              {/* <td className="py-4 text-sm font-medium text-navy-700 dark:text-white">
                {task.assigned_to?.full_name || 'Unassigned'}
              </td>
              <td className="py-4 text-sm font-medium text-navy-700 dark:text-white">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
              </td> */}
              <td className="hidden md:table-cell py-4 text-sm font-medium">
                <span className={clsx(
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  task.status === 'open' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                )}>
                  {task.status?.replace('_', ' ').toUpperCase()}
                </span>
              </td>
              <td className="py-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    className="task-action-btn bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-xs font-semibold transition"
                    title="Edit Task"
                    onClick={e => { e.stopPropagation(); onEdit(task); }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="task-action-btn bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-xs font-semibold transition"
                    title="Delete Task"
                    onClick={e => { e.stopPropagation(); onDelete(task); }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TaskTable; 