import React from 'react';

export default function InteractionCard({ interaction, onEdit, onDelete, onView }: {
  interaction: any,
  onEdit: () => void,
  onDelete: () => void,
  onView: () => void,
}) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition cursor-pointer border border-gray-100 dark:border-navy-700" onClick={onView}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">Company</span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${colorMap[interaction.status] || 'bg-gray-100 text-gray-800'}`}>{interaction.status}</span>
      </div>
      <div className="text-lg font-bold text-navy-700 dark:text-white truncate">{interaction.type}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{interaction.summary}</div>
      <div className="flex gap-2 mt-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
          onClick={e => { e.stopPropagation(); onEdit(); }}
        >Edit</button>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
          onClick={e => { e.stopPropagation(); onDelete(); }}
        >Delete</button>
      </div>
    </div>
  );
} 