"use client"

import React, { useState } from "react"
import { Task } from "types/task";
import { getTasks as fetchTasksFromApi, updateTask, deleteTask } from "apis/tasks.api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "contexts/AuthContext"
import EditTaskModal from "./EditTaskModal"
import TaskCard from "./TaskCard"
import { getErrorMessage } from 'utils/getErrorMessage';
import FormMessage from 'components/fields/FormMessage';
import DeleteConfirmationModal from 'components/fields/DeleteConfirmationModal';

export default function TaskManagerCards() {
  const { user } = useAuth();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Wrapper to fetch all tasks (no company filter)
  const fetchAllTasks = () => fetchTasksFromApi();

  const {data = [], isLoading, error}= useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchAllTasks,
    refetchOnWindowFocus: false
  });

  // Show all tasks (not filtered by user)
  const displayTasks = data;

  const handleTaskToggle = async (taskId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      console.log(`Updating task ${taskId} from ${currentStatus} to ${newStatus}`);
      
      const updatedTask = await updateTask(taskId, { status: newStatus });
      console.log('Task updated successfully:', updatedTask);
      
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Failed to update task status:', error);
      // You could add a toast notification here for user feedback
      setEditError('Failed to update task status.');
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    try {
      await deleteTask(taskId);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Failed to delete task:', error);
      setEditError('Failed to delete task.');
    }
  };

  const handleEditTask = async (task: Task) => {
    setEditTask(task);
    setEditModalOpen(true);
    setEditError(null);
  };



  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-red-500">Error loading tasks</p>
      </div>
    );
  }

  if (displayTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={handleEditTask}
          onToggle={handleTaskToggle}
          onDelete={handleTaskDelete} // Pass the new delete handler
        />
      ))}
      
      {/* Edit Task Modal */}
      <EditTaskModal
        task={editTask}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditTask(null);
          setEditError(null);
        }}
        onSuccess={() => {
          setEditModalOpen(false);
          setEditTask(null);
          setEditError(null);
        }}
        error={editError}
        onClearError={() => setEditError(null)}
      />
    </div>
  )
} 