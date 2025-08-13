import React from 'react';
import InteractionCard from './InteractionCard';

export default function InteractionCards({ interactions, onEdit, onView }: {
  interactions: any[],
  onEdit: (interaction: any) => void,
  onView: (interaction: any) => void,
}) {
  if (!interactions.length) {
    return <div className="text-center text-gray-400 py-8">No interactions found.</div>;
  }
  function onDelete(interaction: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {interactions.map(interaction => (
        <InteractionCard
          key={interaction.id}
          interaction={interaction}
          onEdit={() => onEdit(interaction)}
          onDelete={() => onDelete(interaction)}
          onView={() => onView(interaction)}
        />
      ))}
    </div>
  );
} 