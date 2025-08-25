"use client"

import clsx from "clsx"
import React, { useState } from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Task } from "types/task";
import { getTasks, updateTask, deleteTask } from "apis/tasks.api";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "contexts/AuthContext"
import EditTaskModal from "./EditTaskModal"
import TaskDetailModal from "../customers/TaskDetailModal"; // Import the detail modal
import { MdPriorityHigh, MdSchedule, MdPerson, MdEdit, MdDelete } from "react-icons/md"
import Checkbox from "components/checkbox";
import { getErrorMessage } from 'utils/getErrorMessage';
import FormMessage from 'components/fields/FormMessage';
import Pagination from 'components/common/Pagination';

export default function TaskManagerTable() {
  const { user } = useAuth();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null); // State for detail modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {data, isLoading, error}= useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    refetchOnWindowFocus: false
  })

  // Show all tasks (not filtered by user)
  const allTasks = data || [];

  const displayTasks = allTasks;

  // Tasks pagination state
  const [tasksPage, setTasksPage] = useState(1);
  const tasksPageSize = 10;
  const tasksTotalPages = Math.ceil(displayTasks.length / tasksPageSize);
  const paginatedTasks = React.useMemo(() => {
    const start = (tasksPage - 1) * tasksPageSize;
    return displayTasks.slice(start, start + tasksPageSize);
  }, [displayTasks, tasksPage, tasksPageSize]);

  const handleTaskToggle = async (taskId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'closed' ? 'open' : 'closed';
      console.log(`Updating task ${taskId} from ${currentStatus} to ${newStatus}`);
      
      const updatedTask = await updateTask(taskId, { status: newStatus });
      console.log('Task updated successfully:', updatedTask);
      
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Failed to update task status:', error);
      // You could add a toast notification here for user feedback
      setEditError(`Failed to update task status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    try {
      await deleteTask(taskId);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Failed to delete task:', error);
      setEditError(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setEditModalOpen(true);
    setEditError(null);
  };

  const columnHelper= createColumnHelper<Task>();
  const columns= [
    columnHelper.accessor("title", {
      header: "TASK TITLE",
      cell: (info) => (
        <div className="flex flex-col">
          <span className={`font-bold text-navy-700 dark:text-white ${
            info.row.original.status === 'closed' ? 'line-through text-gray-400 dark:text-gray-500' : ''
          }`}>
            {info.getValue()}
          </span>
          <span className={`text-xs text-gray-500 dark:text-gray-400 ${
            info.row.original.status === 'closed' ? 'line-through' : ''
          }`}>
            {info.row.original.description?.substring(0, 50)}...
          </span>
        </div>
      ),
      meta: { className: "table-cell text-start" }
    }),
    columnHelper.accessor("priority", {
      header: "PRIORITY",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <MdPriorityHigh className={`h-4 w-4 ${
            info.getValue() === "high" ? "text-red-500" : 
            info.getValue() === "medium" ? "text-yellow-500" : "text-green-500"
          }`} />
          <span className={`font-medium ${
            info.getValue() === "high" ? "text-red-600" : 
            info.getValue() === "medium" ? "text-yellow-600" : "text-green-600"
          }`}>
            {(info.getValue() || '').toUpperCase()}
          </span>
        </div>
      ),
      meta: { className: "table-cell text-start" }
    }),
    columnHelper.accessor("assigned_to", {
      header: "ASSIGNED TO",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <MdPerson className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-navy-700 dark:text-white">
            {info.getValue()?.full_name || "Unassigned"}
          </span>
        </div>
      ),
      meta: { className: "table-cell text-start" }
    }),
    columnHelper.accessor("due_date", {
      header: "DUE DATE",
      meta: { className: "table-cell text-start" },
      cell: (info) => {
        const dateString = info.getValue();
        if (!dateString) return (
          <div className="flex items-center gap-2">
            <MdSchedule className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">No date</span>
          </div>
        );
        const [date] = dateString.split("T");
        const formattedDate = date.split("-").reverse().join("-");
        const isOverdue = new Date(date) < new Date();
        
        return (
          <div className="flex items-center gap-2">
            <MdSchedule className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-gray-500"}`} />
            <span className={`font-medium ${isOverdue ? "text-red-600" : "text-navy-700 dark:text-white"}`}>
              {formattedDate}
            </span>
          </div>
        );
      }
    }),
    columnHelper.accessor("status", {
      header: "STATUS",
      cell: (info) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          info.getValue() === "open" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : 
          info.getValue() === "in_progress" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : 
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        }`}>
          {(info.getValue() || '').replace("_", " ").toUpperCase()}
        </span>
      ),
      meta: { className: "table-cell text-start" }
    }),
    {
      size: 120,
      minSize: 100,
      maxSize: 150,
      id: "actions",
      header: "ACTIONS",
      enableResizing: false,
      meta: { className: "text-center" },
      cell: (info) => (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            className="task-action-btn p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Task"
            onClick={() => handleEditTask(info.row.original)}
          >
            <MdEdit className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]

  const table= useReactTable({
    columns,
    data: paginatedTasks,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full">
        <thead className="border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th className="w-12"></th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={clsx(
                    (header.column.columnDef.meta as any)?.className,
                    "text-sm font-bold text-gray-600 dark:text-white pb-2 dark:border-white/30"
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
                          <td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
              No tasks found
            </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) =>(
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                  if ((e.target as Element).closest('.task-action-btn')) return;
                  setSelectedTaskDetail(row.original);
                }}
              >
                <td className="py-4">
                  <Checkbox 
                    color="green" 
                    checked={false} // Always unchecked for delete
                    onChange={() => handleTaskDelete(row.original.id)}
                    className="task-action-btn"
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={ clsx("py-4 text-sm font-medium text-navy-700 dark:text-white") }
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination for tasks at the bottom of the section */}
      <Pagination
        currentPage={tasksPage}
        totalPages={tasksTotalPages}
        onPageChange={page => setTasksPage(page)}
      />
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
      {/* Detail Task Modal */}
      {selectedTaskDetail && (
        <TaskDetailModal
          task={selectedTaskDetail}
          onClose={() => setSelectedTaskDetail(null)}
        />
      )}
    </div>
  )
} 