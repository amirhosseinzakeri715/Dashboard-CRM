import React from 'react';

const MeetingDetailModal = ({ meeting, onClose }) => {
  if (!meeting) return null;
  return (
    <section className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg transition-all duration-300 animate-modalIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-600">Meeting Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl font-bold" aria-label="Close">&times;</button>
        </div>
        <div className="space-y-4 text-base">
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Title:</span>
            <span>{meeting.title || meeting.report}</span>
          </div>
          {/* Attendees below the title */}
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Attendees:</span>
            <span>
              {Array.isArray(meeting.attendees) && meeting.attendees.length > 0
                ? meeting.attendees.map(u => u.full_name || u.email).join(', ')
                : 'None'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Note:</span>
            <span>{meeting.description || meeting.note || meeting.report}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
            <span className="font-semibold">Date:</span>
            <span>{meeting.date ? new Date(meeting.date).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingDetailModal; 