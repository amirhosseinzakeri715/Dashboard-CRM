import React from 'react';
import { Meeting } from 'types/meeting';

interface MeetingCardsProps {
  meetings: Meeting[];
  onEdit: (meeting: Meeting) => void;
  onView: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
}

const MeetingCards: React.FC<MeetingCardsProps> = ({ meetings, onEdit, onView, onDelete }) => {
  if (!meetings.length) {
    return <div className="text-gray-400 text-sm py-4">No meetings scheduled</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between min-h-[160px]"
          onClick={e => {
            if ((e.target as Element).closest('.meeting-action-btn')) return;
            onView(meeting);
          }}
        >
          <div>
            <div className="font-semibold text-gray-800 text-lg mb-2 truncate">{meeting.report}</div>
            <div className="text-xs text-gray-500 font-medium mb-1">
              Attendees: {Array.isArray(meeting.attendees) && meeting.attendees.length > 0
                ? meeting.attendees.map(u => u.full_name || u.email).join(', ')
                : 'None'}
            </div>
            <div className="text-xs text-gray-600 mb-1">{meeting.report}</div>
            <div className="text-xs text-gray-500 mb-1">Date: {meeting.date ? new Date(meeting.date).toLocaleDateString() : 'N/A'}</div>
            <div className="text-xs text-gray-500 mb-1">Status: {new Date(meeting.date) > new Date() ? 'Upcoming' : 'Past'}</div>
          </div>
          <div className="flex gap-2 mt-2 justify-center">
            <button
              onClick={() => onEdit(meeting)}
              className="meeting-action-btn bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-xs font-semibold transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(meeting)}
              className="meeting-action-btn bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-xs font-semibold transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingCards; 