import React, { useState, useEffect } from 'react';
import FormMessage from 'components/fields/FormMessage';

export type CustomerRow = {
  id?: number;
  name: string;
  website: string;
  country: string;
  industry_category: number;
  activity_level: string;
  acquired_via: string;
  lead_score: number;
  notes: string;
};

interface CustomerWizardModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData: CustomerRow;
  onClose: () => void;
  onSubmit: (customer: CustomerRow) => void;
  error?: string | null;
  onClearError?: () => void;
}

const emptyCustomer: CustomerRow = {
  id: undefined,
  name: '',
  website: '',
  country: '',
  industry_category: 1,
  activity_level: '',
  acquired_via: '',
  lead_score: 0,
  notes: '',
};

const CustomerWizardModal: React.FC<CustomerWizardModalProps> = ({ open, mode, initialData, onClose, onSubmit, error, onClearError }) => {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState('');
  const [customer, setCustomer] = useState<CustomerRow>(initialData || emptyCustomer);

  useEffect(() => {
    if (open) {
      // Only reset if opening for the first time (not on error)
      setStep(1);
      setStepError('');
      setCustomer(initialData || emptyCustomer);
    }
    // Do NOT reset on error
    // eslint-disable-next-line
  }, [open]);

  // Clear error when modal closes
  useEffect(() => {
    if (!open && onClearError) onClearError();
  }, [open, onClearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setStepError('');
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: name === 'lead_score' || name === 'industry_category' ? Number(value) : value,
    }));
  };

  const handleNext = () => {
    // Step 1 validation
    if (step === 1) {
      if (!customer.name || !customer.website) {
        setStepError('Please fill in all required fields.');
        return;
      }
      // Basic URL format validation
      const urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if (!urlPattern.test(customer.website)) {
        setStepError('Please enter a valid website URL (e.g., example.com).');
        return;
      }
    }

    if (
      (step === 2 && (!customer.country || !customer.industry_category)) ||
      (step === 3 && (!customer.activity_level || !customer.acquired_via))
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
    if (!customer.name || !customer.website) {
      setStepError('Please fill in all required fields.');
      return;
    }
    onSubmit(customer);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.7)' }}
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
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              {mode === 'add' ? 'Add Customer' : 'Edit Customer'}
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
          <div className="px-8 pb-8 overflow-y-auto flex-1">
            <form className="space-y-4 text-gray-600 dark:text-white" onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="name">Name *</label>
                    <input type="text" id="name" name="name" value={customer.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="website">Website</label>
                    <input type="text" id="website" name="website" value={customer.website} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="country">Country *</label>
                    <select id="country" name="country" value={customer.country} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
                      <option value="">Select Country</option>
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="industry_category">Industry Category *</label>
                    <input type="number" id="industry_category" name="industry_category" min="1" max="16" value={customer.industry_category} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="activity_level">Activity Level *</label>
                    <select id="activity_level" name="activity_level" value={customer.activity_level} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
                      <option value="">Select Activity Level</option>
                      <option value="active">Active</option>
                      <option value="passive">Passive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="acquired_via">Acquired Via *</label>
                    <input type="text" id="acquired_via" name="acquired_via" value={customer.acquired_via} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="lead_score">Lead Score *</label>
                    <input type="number" id="lead_score" name="lead_score" min="0" max="100" value={customer.lead_score} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" value={customer.notes} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-navy-700 rounded max-h-40 overflow-y-auto break-words whitespace-pre-wrap">
                    <div className="font-semibold mb-2 text-green-700 dark:text-green-300">Review</div>
                    <div className="text-xs">
                      <div><b>ID:</b> {customer.id || 'New'}</div>
                      <div><b>Name:</b> {customer.name}</div>
                      <div><b>Website:</b> {customer.website}</div>
                      <div><b>Country:</b> {customer.country}</div>
                      <div><b>Industry Category:</b> {customer.industry_category}</div>
                      <div><b>Activity Level:</b> {customer.activity_level}</div>
                      <div><b>Acquired Via:</b> {customer.acquired_via}</div>
                      <div><b>Lead Score:</b> {customer.lead_score}</div>
                      <div><b>Notes:</b> {customer.notes}</div>
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-2 mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-gray-800 dark:text-white font-semibold py-2 rounded-lg shadow transition duration-200"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    className={`flex-1 font-semibold py-2 rounded-lg shadow transition duration-200 ${
                      (step === 1 && (!customer.name || !customer.website)) ||
                      (step === 2 && (!customer.country || !customer.industry_category)) ||
                      (step === 3 && (!customer.activity_level || !customer.acquired_via))
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
                {step === 4 && (
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow transition duration-200"
                  >
                    {mode === 'add' ? 'Add Customer' : 'Save'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerWizardModal; 