import React from 'react';

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg transition-all duration-300 animate-modalIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-600">Task Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl font-bold" aria-label="Close">&times;</button>
        </div>
        <div className="space-y-4 text-base">
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Title:</span>
            <span>{task.title}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Description:</span>
            <span className="whitespace-pre-wrap">{task.description || 'No description'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Status:</span>
            <span className={`w-fit px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Priority:</span>
            <span className={`w-fit px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Due Date:</span>
            <span>{task.due_date ? new Date(task.due_date).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Assigned To:</span>
            <span>{task.assigned_to?.full_name || 'Unassigned'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskDetailModal; 