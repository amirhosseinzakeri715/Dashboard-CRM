import React from 'react';

interface ContactDetailModalProps {
  contact: any;
  open: boolean;
  onClose: () => void;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ contact, open, onClose }) => {
  if (!open || !contact) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-lg relative transition-all duration-300 animate-modalIn max-h-[90vh] flex flex-col">
          <div className="p-8 pb-4 flex-shrink-0">
            <button
              className="absolute top-3 right-6 text-gray-400 hover:text-red-500 text-4xl font-bold"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 ">
              Contact Details
            </h2>
          </div>
          <div className="space-y-4 text-base px-8 pb-8 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">ID:</span>
              <span className="break-all overflow-hidden">{contact.id}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Full Name:</span>
              <span className="break-all overflow-hidden">{contact.full_name}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Position:</span>
              <span className="break-all overflow-hidden">{contact.position}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Company Email:</span>
              <span className="break-all overflow-hidden">{contact.company_email}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Personal Email:</span>
              <span className="break-all overflow-hidden">{contact.personal_email}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Phone (Office):</span>
              <span className="break-all overflow-hidden">{contact.phone_office}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Phone (Mobile):</span>
              <span className="break-all overflow-hidden">{contact.phone_mobile}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Address:</span>
              <span className="break-all overflow-hidden whitespace-pre-wrap">{contact.address}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start">
              <span className="font-semibold">Customer Specific Conditions:</span>
              <span className="break-all overflow-hidden whitespace-pre-wrap">{contact.customer_specific_conditions}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDetailModal; 