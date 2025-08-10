import React from 'react';
import { useRouter } from 'next/navigation';

interface CustomerModalProps {
  customer: any;
  open: boolean;
  onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, open, onClose }) => {
  if (!open || !customer) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-md relative transition-all duration-300 animate-modalIn max-h-[90vh] flex flex-col">
          <div className="p-8 pb-4 flex-shrink-0">
            <button
              className="absolute top-3 right-6 text-gray-400 hover:text-red-500 text-4xl font-bold"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-600">
              Customer Details
            </h2>
          </div>
          <div className="px-8 pb-8 overflow-y-auto flex-1">
            <div className="space-y-4 text-base">
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">ID:</span>
                <span className="break-all overflow-hidden">{customer.id}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Name:</span>
                <span className="break-all overflow-hidden">{customer.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Website:</span>
                <span className="break-all overflow-hidden">{customer.website}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Country:</span>
                <span className="break-all overflow-hidden">{customer.country}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Industry Category:</span>
                <span className="break-all overflow-hidden">{customer.industry_category}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Activity Level:</span>
                <span className="break-all overflow-hidden">{customer.activity_level}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Acquired Via:</span>
                <span className="break-all overflow-hidden">{customer.acquired_via}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Lead Score:</span>
                <span className="break-all overflow-hidden">{customer.lead_score}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
                <span className="font-semibold">Notes:</span>
                <span className="break-all overflow-hidden whitespace-pre-wrap">{customer.notes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerModal; 