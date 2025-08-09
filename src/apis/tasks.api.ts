import { Task } from '../types/task';
import { apiCall } from '../utils/api';

export const getTasks = async (): Promise<Task[]> => {
  return await apiCall<Task[]>('/crm/tasks/');
};

export const getTask = async (id: number): Promise<Task> => {
  return await apiCall<Task>(`/crm/tasks/${id}/`);
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  console.log('Creating task with payload:', task);
  return await apiCall<Task>('/crm/tasks/', {
    method: 'POST',
    body: JSON.stringify(task),
  });
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  return await apiCall<Task>(`/crm/tasks/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(task),
  });
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiCall<void>(`/crm/tasks/${id}/`, {
    method: 'DELETE',
  });
};