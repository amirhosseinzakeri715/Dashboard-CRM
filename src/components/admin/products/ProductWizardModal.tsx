import React, { useState, useEffect } from 'react';
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';
import { getContacts } from 'apis/contacts.api';
import { ContactRow } from '../customers/ContactWizardModal';

export type ProductRow = {
  id?: number;
  company_id: number;
  contact_id?: number;
  category: string;
  price_list_expiry?: string;
  volume_offered: string;
  delivery_terms: string;
  packaging: string;
  payment_terms: string;
  product_specifications: string;
  target_price: number;
  contacts?: ContactRow[];
};

interface ProductWizardModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialData: ProductRow;
  onClose: () => void;
  onSubmit: (product: ProductRow) => void;
  error?: string | null;
  onClearError?: () => void;
}

const emptyProduct: ProductRow = {
  id: undefined,
  company_id: 0,
  contact_id: undefined,
  category: '',
  price_list_expiry: '',
  volume_offered: '',
  delivery_terms: '',
  packaging: '',
  payment_terms: '',
  product_specifications: '',
  target_price: 0,
  contacts: [],
};

const ProductWizardModal: React.FC<ProductWizardModalProps> = ({ open, mode, initialData, onClose, onSubmit, error, onClearError }) => {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState('');
  const [product, setProduct] = useState<ProductRow>(initialData || emptyProduct);
  const [contactsLoading, setContactsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setStepError('');
      setProduct(initialData || emptyProduct);
    }
  }, [open, initialData]);

  // Clear error when modal closes
  useEffect(() => {
    if (!open && onClearError) onClearError();
  }, [open, onClearError]);

  // Fetch contacts when company_id changes
  useEffect(() => {
    if (!open) return;
    const companyId = product.company_id;
    if (companyId) {
      setContactsLoading(true);
      getContacts(companyId)
        .then((contacts: ContactRow[]) => {
          setProduct(prev => ({
            ...prev,
            contacts,
            contact_id: contacts.some(c => c.id === prev.contact_id) ? prev.contact_id : undefined,
          }));
        })
        .finally(() => setContactsLoading(false));
    } else {
      setProduct(prev => ({ ...prev, contacts: [], contact_id: undefined }));
    }
  }, [open, product.company_id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setStepError('');
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'company_id' || name === 'target_price' ? Number(value) : value,
    }));
  };

  const handleNext = () => {
    if (
      (step === 1 && (!product.company_id || !product.category)) ||
      (step === 2 && (!product.volume_offered || !product.delivery_terms || !product.packaging)) ||
      (step === 3 && (!product.payment_terms || !product.product_specifications))
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
    if (!product.company_id || !product.category) {
      setStepError('Please fill in all required fields.');
      return;
    }
    onSubmit(product);
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
                {mode === 'add' ? 'Add Product' : 'Edit Product'}
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
                  {/* Company ID is hidden, but still present in the form state */}
                  <input type="hidden" id="company_id" name="company_id" value={product.company_id} />
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="contact_id">Contact</label>
                    <select id="contact_id" name="contact_id" value={product.contact_id ?? ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400">
                      <option value="">Select a contact</option>
                      {(product.contacts || []).map((contact) => (
                        <option key={contact.id} value={contact.id}>{contact.full_name}</option>
                      ))}
                    </select>
                    {contactsLoading && <div className="text-xs text-gray-400 mt-1">Loading contacts...</div>}
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="category">Category *</label>
                    <input type="text" id="category" name="category" value={product.category} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="volume_offered">Volume Offered *</label>
                    <input type="text" id="volume_offered" name="volume_offered" value={product.volume_offered} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="delivery_terms">Delivery Terms *</label>
                    <input type="text" id="delivery_terms" name="delivery_terms" value={product.delivery_terms} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="packaging">Packaging *</label>
                    <input type="text" id="packaging" name="packaging" value={product.packaging} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="payment_terms">Payment Terms *</label>
                    <input type="text" id="payment_terms" name="payment_terms" value={product.payment_terms} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="product_specifications">Product Specifications *</label>
                    <textarea id="product_specifications" name="product_specifications" value={product.product_specifications} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="target_price">Target Price *</label>
                    <input type="number" id="target_price" name="target_price" value={product.target_price} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="price_list_expiry">Price List Expiry</label>
                    <input type="datetime-local" id="price_list_expiry" name="price_list_expiry" value={product.price_list_expiry || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
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
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">{mode === 'add' ? 'Add Product' : 'Save Changes'}</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductWizardModal; 