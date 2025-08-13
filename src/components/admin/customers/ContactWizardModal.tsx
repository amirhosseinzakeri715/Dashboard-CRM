import React, { useState, useEffect } from 'react';
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';

export type ContactRow = {
  id?: number;
  company_id: number;
  full_name: string;
  position: string;
  company_email: string;
  personal_email: string;
  phone_office: string;
  phone_mobile: string;
  address: string;
  customer_specific_conditions: string;
};

interface ContactWizardModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData: ContactRow;
  onClose: () => void;
  onSubmit: (contact: ContactRow) => void;
  error?: string | null;
  onClearError?: () => void;
}

const emptyContact: ContactRow = {
  id: undefined,
  company_id: 0,
  full_name: '',
  position: '',
  company_email: '',
  personal_email: '',
  phone_office: '',
  phone_mobile: '',
  address: '',
  customer_specific_conditions: '',
};

const ContactWizardModal: React.FC<ContactWizardModalProps> = ({ open, mode, initialData, onClose, onSubmit, error, onClearError }) => {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState('');
  const [contact, setContact] = useState<ContactRow>(initialData || emptyContact);

  useEffect(() => {
    if (open) {
      setStep(1);
      setStepError('');
      setContact(initialData || emptyContact);
    }
  }, [open, initialData]);

  // Clear error when modal closes
  useEffect(() => {
    if (!open && onClearError) onClearError();
  }, [open, onClearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStepError('');
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (
      (step === 1 && (!contact.full_name || !contact.position)) ||
      (step === 2 && (!contact.company_email || !contact.personal_email)) ||
      (step === 3 && (!contact.phone_office || !contact.phone_mobile || !contact.address))
    ) {
      setStepError('Please fill in all required fields.');
      return;
    }
    setStepError('');
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setStepError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contact.full_name || !contact.position || !contact.company_email || !contact.personal_email || !contact.phone_office || !contact.phone_mobile || !contact.address) {
      setStepError('Please fill in all required fields.');
      return;
    }
    onSubmit(contact);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl w-full max-w-lg relative transition-all duration-300 animate-modalIn max-h-[90vh] flex flex-col">
          <form className="flex flex-col h-full" onSubmit={handleSubmit}>
            <div className="p-8 pb-4 flex-shrink-0">
              <button
                className="absolute top-3 right-6 text-gray-400 hover:text-red-500 text-4xl font-bold"
                onClick={onClose}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-green-600">
                {mode === 'add' ? 'Add Contact' : 'Edit Contact'}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1,2,3,4].map((s) => (
                  <div
                    key={s}
                    className={`w-3 h-3 rounded-full ${step === s ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                ))}
              </div>
              <div className="text-center text-xs text-gray-500 dark:text-gray-300 mb-2">
                Step {step} of 4
              </div>
              {error && <FormMessage type="error">{error}</FormMessage>}
              {stepError && (
                <FormMessage type="error">{stepError}</FormMessage>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="full_name">Full Name *</label>
                    <input type="text" id="full_name" name="full_name" value={contact.full_name} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} maxLength={100} required />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="position">Position *</label>
                    <input type="text" id="position" name="position" value={contact.position} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} maxLength={100} required />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="company_email">Company Email *</label>
                    <input type="email" id="company_email" name="company_email" value={contact.company_email} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} maxLength={254} required />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="personal_email">Personal Email *</label>
                    <input type="email" id="personal_email" name="personal_email" value={contact.personal_email} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} maxLength={254} required />
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="phone_office">Phone Office *</label>
                    <input type="text" id="phone_office" name="phone_office" value={contact.phone_office} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} maxLength={20} required />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="phone_mobile">Phone Mobile *</label>
                    <input type="text" id="phone_mobile" name="phone_mobile" value={contact.phone_mobile} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} maxLength={20} required />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="address">Address *</label>
                    <input type="text" id="address" name="address" value={contact.address} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} required />
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="customer_specific_conditions">Customer Specific Conditions *</label>
                    <textarea id="customer_specific_conditions" name="customer_specific_conditions" value={contact.customer_specific_conditions} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" minLength={1} maxLength={200} required />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-900 rounded-b-2xl">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg font-semibold text-gray-700 dark:text-white">Back</button>
              )}
              {step < 4 && (
                <button type="button" onClick={handleNext} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">Next</button>
              )}
              {step === 4 && (
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">{mode === 'add' ? 'Add Contact' : 'Save Changes'}</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactWizardModal; 