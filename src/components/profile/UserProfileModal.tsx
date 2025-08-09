'use client';
import React from 'react';
import { User } from 'contexts/AuthContext';

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onClose, user }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.70)' }}
      onClick={onClose}
    >
      <div
        className="bg-white  dark:bg-navy-800 rounded-xl shadow-lg p-8 w-full max-w-md relative transition-all duration-300 animate-modalIn"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute text-3xl  top-3 right-6 text-gray-400 hover:text-red-500 dark:hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-500 w-16 h-16 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user?.first_name ? user.first_name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : '?'}
          </div>
          <h2 className="text-2xl font-bold mb-2 text-navy-700 dark:text-white">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.first_name || user?.username || user?.email?.split('@')[0] || 'User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-1">{user?.email}</p>
          {/* Add more user info here if needed */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal; 