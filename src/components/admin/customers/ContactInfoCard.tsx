import React from 'react';

export default function ContactInfoCard({ contact, onClick, onEdit, onDelete }: {
  contact: any,
  onClick: () => void,
  onEdit: () => void,
  onDelete: () => void,
}) {
  return (
    <div
      className="bg-white dark:bg-navy-800 rounded-2xl shadow p-5 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition relative group border border-gray-100 dark:border-navy-700"
      onClick={onClick}
    >
      <div className="flex items-center justify-between min-w-0">
        <div className="text-lg font-bold text-navy-700 dark:text-white truncate min-w-0">{contact.full_name}</div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            className="p-1 text-xs text-green-600 hover:text-green-800"
            onClick={e => { e.stopPropagation(); onEdit(); }}
            title="Edit"
          >
            ✎
          </button>
          <button
            className="p-1 text-xs text-red-600 hover:text-red-800"
            onClick={e => { e.stopPropagation(); onDelete(); }}
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 min-w-0">{contact.position}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300 truncate min-w-0">{contact.company_email}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300 truncate min-w-0">{contact.phone_mobile}</div>
    </div>
  );
} 