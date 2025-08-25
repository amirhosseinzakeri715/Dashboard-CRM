'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Task } from 'types/task';
import { updateTask } from 'apis/tasks.api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { MdClose, MdSave, MdPriorityHigh, MdSchedule } from 'react-icons/md';
import { NotificationContext } from 'contexts/NotificationContext';
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';

interface EditTaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  error?: string | null;
  onClearError?: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, open, onClose, onSuccess, error, onClearError }) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'open' as 'open' | 'in_progress' | 'closed' | 'pending' | 'completed',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'open',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
  }, [task, open]);

  useEffect(() => {
    if (!open && onClearError) onClearError();
  }, [open, onClearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setLoading(true);
    try {
      await updateTask(task.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined
      });

      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (onClearError) onClearError();
      if (typeof err === 'object' && err !== null && 'setError' in err) {
        // do nothing
      } else {
        if (onClearError) onClearError();
      }
    }
    setLoading(false);
  };

  if (!open || !task) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-md relative transition-all duration-300 animate-modalIn max-h-[90vh] flex flex-col">
          <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy-700 dark:text-white">
                Edit Task
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Close"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>
            {error && <FormMessage type="error">{error}</FormMessage>}
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-700 dark:text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-700 dark:text-white resize-none"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MdPriorityHigh className="inline h-4 w-4 mr-1" />
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-700 dark:text-white"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MdSchedule className="inline h-4 w-4 mr-1" />
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-navy-700 dark:text-white"
                />
              </div>
            </div>
          </form>

          <div className="p-6 pt-4 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !formData.title.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <MdSave className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTaskModal; 