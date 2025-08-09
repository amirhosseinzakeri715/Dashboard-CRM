import { IUser } from "./user"

export interface ITask {
  id: number;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed' | 'completed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  assigned_to: import('../utils/api').User;
  assigned_to_id: number;
  created_by: import('../utils/api').User;
  company?: number | null;
  opportunity?: number | null;
  interaction?: number | null;
}

export type ICreateTask= Omit<ITask, "company" | "opportunity" | "interaction" | "id" | "created_by" | "assigned_to" | "created_at" | "updated_at">