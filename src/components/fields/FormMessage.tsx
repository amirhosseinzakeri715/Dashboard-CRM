import React from 'react';

interface FormMessageProps {
  type?: 'error' | 'success' | 'info';
  children: React.ReactNode;
  className?: string;
}

const colorMap = {
  error: 'bg-red-100 text-red-700 border border-red-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
};

export const FormMessage: React.FC<FormMessageProps> = ({ type = 'error', children, className = '' }) => (
  <div
    className={`w-full rounded px-4 py-2 text-sm my-2 ${colorMap[type]} ${className}`.trim()}
    role={type === 'error' ? 'alert' : undefined}
  >
    {children}
  </div>
);

export default FormMessage; 