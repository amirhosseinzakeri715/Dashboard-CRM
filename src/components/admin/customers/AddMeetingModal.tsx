import React, { useState, useEffect } from 'react';
import { fetchUsersList } from 'apis/users.api';

interface AddMeetingModalProps {
  onClose: () => void;
  onSubmit: (meeting: {
    report: string;
    date: string;
    company: number;
    user_ids: number[];
  }) => void;
  customerId: number;
}

const AddMeetingModal: React.FC<AddMeetingModalProps> = ({
  onClose,
  onSubmit,
  customerId,
}) => {
  const [report, setReport] = useState('');
  const [date, setDate] = useState('');
  const [assignedToId, setAssignedToId] = useState<number | ''>('');
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
      .catch(() => {
        setUsersError('Failed to load users');
        setUsers([]);
      })
      .finally(() => setUsersLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report.trim() || !date.trim() || assignedToId === '' || isNaN(Number(assignedToId))) return;
    onSubmit({
      report,
      date,
      company: customerId,
      user_ids: [Number(assignedToId)],
    });
    setReport('');
    setDate('');
    setAssignedToId('');
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
            <h2 className="text-xl font-bold mb-4 text-green-600">Schedule Meeting</h2>
          </div>
          <div className="px-8 pb-8 overflow-y-auto flex-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report</label>
                <input
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={report}
                  onChange={e => setReport(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Attendee</label>
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

export default AddMeetingModal;
