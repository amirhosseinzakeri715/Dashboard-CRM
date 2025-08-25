import React, { useState, useEffect } from 'react';
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';
import { fetchUsersList } from 'apis/users.api';

interface AddTaskModalProps {
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'closed';
    due_date?: string;
    assigned_to_id?: number;
    company?: number;
    opportunity?: number;
    interaction?: number;
  }, assignedUser: any | null) => Promise<void>;
  initialData?: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'closed';
    due_date?: string;
    assigned_to_id?: number;
    company?: number;
    opportunity?: number;
    interaction?: number;
  };
  customerId?: number;
  error?: string | null;
  onClearError?: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSubmit, initialData, customerId, error, onClearError }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [status, setStatus] = useState<'open' | 'in_progress' | 'closed'>('open');
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState<number | ''>('');
  const [company, setCompany] = useState<number | ''>('');
  const [opportunity, setOpportunity] = useState<number | ''>('');
  const [interaction, setInteraction] = useState<number | ''>('');

  // User select state
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    setUsersLoading(true);
    fetchUsersList()
      .then(data => {
        setUsers(Array.isArray(data) ? data : (data.results || []));
        setUsersError(null);
      })
      .catch(err => {
        setUsersError('Failed to load users');
        setUsers([]);
      })
      .finally(() => setUsersLoading(false));
  }, []);

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'low');
      setStatus(initialData.status || 'open');
      setDueDate(initialData.due_date ? initialData.due_date.slice(0, 16) : '');
      setAssignedToId(initialData.assigned_to_id ?? '');
      setCompany(initialData.company ?? '');
      setOpportunity(initialData.opportunity ?? '');
      setInteraction(initialData.interaction ?? '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('low');
      setStatus('open');
      setDueDate('');
      setAssignedToId('');
      setCompany('');
      setOpportunity('');
      setInteraction('');
    }
  }, [initialData]);

  React.useEffect(() => {
    if (!error && onClearError) onClearError();
  }, [onClose, onClearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || assignedToId === '' || isNaN(Number(assignedToId))) return;

    const selectedUser = users.find(u => u.id === Number(assignedToId)) || null;

    await onSubmit({
      title,
      description,
      priority,
      status,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      assigned_to_id: Number(assignedToId),
      company: customerId,
      opportunity: opportunity === '' ? undefined : Number(opportunity),
      interaction: interaction === '' ? undefined : Number(interaction),
    }, selectedUser);
    // Do NOT close or reset fields here; let parent handle it only on success
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-md relative transition-all duration-300 animate-modalIn max-h-[90vh] flex flex-col"
        >
          <div className="p-8 pb-4 flex-shrink-0">
            <h2 className="text-xl font-bold mb-4 text-green-600">Add Task</h2>
          </div>
          {error && <FormMessage type="error">{error}</FormMessage>}
          <div className="px-8 pb-8 overflow-y-auto flex-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={1}
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as 'low' | 'medium' | 'high')
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as 'open' | 'in_progress' | 'closed',
                    )
                  }
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                {usersLoading ? (
                  <div className="text-gray-400 text-sm py-2">Loading users...</div>
                ) : usersError ? (
                  <div className="text-red-500 text-sm py-2">{usersError}</div>
                ) : (
                  <select
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={assignedToId}
                    onChange={e => setAssignedToId(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  >
                    <option value="">Select a user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.first_name || user.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {/* Remove the editable Company input to prevent wrong association */}
              {/*
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={company}
                  onChange={(e) => setCompany(e.target.value === '' ? '' : Number(e.target.value))}
                  min={1}
                />
              </div>
              */}
              <div hidden>
                <label className="block text-sm font-medium mb-1">Opportunity</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={opportunity}
                  onChange={(e) => setOpportunity(e.target.value === '' ? '' : Number(e.target.value))}
                  min={1}
                />
              </div>
              <div hidden>
                <label className="block text-sm font-medium mb-1">Interaction</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={interaction}
                  onChange={(e) => setInteraction(e.target.value === '' ? '' : Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>
          </div>
          <div className="p-8 pt-4 flex-shrink-0">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTaskModal;
