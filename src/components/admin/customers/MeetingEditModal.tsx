import { useState, useEffect } from "react";
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';
import { fetchUsersList } from 'apis/users.api';

interface MeetingEditModalProps {
  close: () => void;
  meeting;
  onSave: (updatedMeeting) => void;
  onDelete?: (meetingId: number) => void;
}

export default function MeetingEditModal({ close, meeting, onSave, onDelete }: MeetingEditModalProps) {
  const [report, setReport] = useState(meeting?.report || '');
  const [date, setDate] = useState(meeting?.date ? meeting.date.slice(0, 16) : '');
  const [assignedToId, setAssignedToId] = useState<number | ''>(
    Array.isArray(meeting?.attendees) && meeting.attendees.length > 0
      ? meeting.attendees[0].id
      : ''
  );
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [meeting]);

  if (!meeting) return null;

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  
  // Check if it's a select element with multiple attribute
  if (e.target instanceof HTMLSelectElement && e.target.multiple) {
    const selectedValues = Array.from(e.target.options)
      .filter(option => option.selected)
      .map(option => Number(option.value));
    
    // setFormData(prev => ({ ...prev, [name]: selectedValues }));
  } else {
    // Handle regular inputs (including single select)
    // setFormData(prev => ({ ...prev, [name]: value }));
  }
};
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave({
        id: meeting.id,
        company: meeting.company,
        date: date ? new Date(date).toISOString() : undefined,
        report,
        user_ids: assignedToId !== '' ? [Number(assignedToId)] : [],
      });
      close();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save meeting.'));
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={close}
      />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center overflow-auto p-4">
        <div className="bg-white dark:bg-navy-800 rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md relative transition-all duration-300 animate-modalIn max-h-[90vh] flex flex-col md:p-6 p-4">
          <button
            className="absolute top-3 right-6 text-gray-400 hover:text-red-500 text-4xl font-bold"
            onClick={close}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-green-600">Edit Meeting</h2>
          </div>
          {error && <FormMessage type="error">{error}</FormMessage>}
          <form onSubmit={handleSave} className="space-y-4 text-base overflow-y-auto flex-1">
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Report</label>
              <input
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={report}
                onChange={e => setReport(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Date</label>
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">Attendee</label>
              {usersLoading ? (
                <div className="text-gray-400 text-sm py-2">Loading users...</div>
              ) : usersError ? (
                <div className="text-red-500 text-sm py-2">{usersError}</div>
              ) : (
                <select
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex flex-col gap-2 mt-6 md:flex-row md:justify-end md:gap-2">
              <button type="button" onClick={close} className="w-full md:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button type="submit" className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 