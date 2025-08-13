import React, { useEffect, useState } from 'react';
import Card from 'components/card';
import {
  fetchOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  Opportunity,
} from 'apis/opportunities.api';
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';
import DeleteConfirmationModal from 'components/fields/DeleteConfirmationModal';

const stageOptions = [
  'lead',
  'qualified',
  'negotiation',
  'won',
  'lost',
];

function OpportunityModal({ open, onClose, onSubmit, initialData, error, onClearError }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Opportunity, 'id'>) => void;
  initialData?: Partial<Opportunity>;
  error?: string | null;
  onClearError?: () => void;
}) {
  const [stage, setStage] = useState('lead');
  const [expectedValue, setExpectedValue] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [probability, setProbability] = useState('');
  const [showAnim, setShowAnim] = useState(false);

  useEffect(() => {
    if (initialData) {
      setStage(initialData.stage || 'lead');
      setExpectedValue(initialData.expected_value?.toString() || '');
      setExpectedCloseDate(initialData.expected_close_date || '');
      setProbability(initialData.probability || '');
    }
  }, [initialData, open]);

  useEffect(() => {
    if (open) {
      setShowAnim(false);
      // Trigger animation after mount
      const timer = setTimeout(() => setShowAnim(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShowAnim(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open && onClearError) onClearError();
  }, [open, onClearError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expectedValue || !probability) return;
    onSubmit({
      company_id: initialData?.company_id!,
      stage: stage as Opportunity['stage'],
      expected_value: Number(expectedValue),
      expected_close_date: expectedCloseDate || null,
      probability,
    });
  };

  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center overflow-auto p-4">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md relative transition-all duration-300 animate-modalIn max-h-[90vh] flex flex-col md:p-8 p-4">
          <button
            className="absolute top-3 right-6 text-gray-400 hover:text-red-500 text-4xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
          <h2 className="text-lg md:text-xl font-bold mb-4">{initialData?.id ? 'Edit' : 'Add'} Opportunity</h2>
          {error && <FormMessage type="error">{error}</FormMessage>}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-xs md:text-sm font-semibold mb-1">Stage</label>
              <select className="w-full border rounded p-2 text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" value={stage} onChange={e => setStage(e.target.value)}>
                {stageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold mb-1">Expected Value</label>
              <input type="number" className="w-full border rounded p-2 text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" value={expectedValue} onChange={e => setExpectedValue(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold mb-1">Expected Close Date</label>
              <input type="date" className="w-full border rounded p-2 text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" value={expectedCloseDate?.slice(0,10) || ''} onChange={e => setExpectedCloseDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-semibold mb-1">Probability</label>
              <input type="number" step="0.01" className="w-full border rounded p-2 text-xs md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" value={probability} onChange={e => setProbability(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2 mt-4 md:flex-row md:justify-end md:gap-2">
              <button type="button" className="w-full md:w-auto px-4 py-2 text-xs md:text-base bg-gray-300 rounded" onClick={onClose}>Cancel</button>
              <button type="submit" className="w-full md:w-auto px-4 py-2 text-xs md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function OpportunityDetailModal({ open, onClose, opportunity }: {
  open: boolean;
  onClose: () => void;
  opportunity?: Opportunity | null;
}) {
  if (!open || !opportunity) return null;
  return (
    <div
      style={{ background: 'rgba(0,0,0,0.8)' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-[600px] w-full relative animate-modalIn">
        <button className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Opportunity Details</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Stage</label>
            <select className="w-full border rounded p-2 bg-gray-50" value={opportunity.stage} disabled>
              {stageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Expected Value</label>
            <input type="number" className="w-full border rounded p-2 bg-gray-50" value={opportunity.expected_value} disabled />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Expected Close Date</label>
            <input type="date" className="w-full border rounded p-2 bg-gray-50" value={opportunity.expected_close_date ? opportunity.expected_close_date.slice(0,10) : ''} disabled />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Probability</label>
            <input type="number" step="0.01" className="w-full border rounded p-2 bg-gray-50" value={opportunity.probability} disabled />
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OpportunitiesSection({ companyId, click }: { companyId: number, click }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Opportunity | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchOpportunities(Number(companyId));
        // Filter opportunities by company_id to ensure only this customer's opportunities are shown
        const filteredOpportunities = data.filter(
          (opp) => opp.company_id === Number(companyId)
        );
        setOpportunities(filteredOpportunities);
        setError(null);
      } catch (err) {
        setError('Failed to load opportunities.');
      } finally {
        setLoading(false);
      }
    };
    if (companyId) fetchData();
  }, [companyId]);

  const handleAdd = async (data: Omit<Opportunity, 'id'>) => {
    try {
      const newOpp = await createOpportunity(data);
      setOpportunities(prev => [...prev, newOpp]);
      setModalOpen(false);
      setModalError(null);
    } catch (err: any) {
      setModalError(getErrorMessage(err, 'Failed to add opportunity.'));
    }
  };
  const handleEdit = async (data: Omit<Opportunity, 'id'>) => {
    if (!editData) return;
    try {
      const updated = await updateOpportunity(editData.id, data);
      setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
      setEditData(null);
      setModalOpen(false);
      setModalError(null);
    } catch (err: any) {
      setModalError(getErrorMessage(err, 'Failed to update opportunity.'));
    }
  };
  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteOpportunity(deleteId);
      setOpportunities(prev => prev.filter(o => o.id !== deleteId));
      setDeleteId(null);
      setDeleteError(null);
    } catch (err: any) {
      setDeleteError(getErrorMessage(err, 'Failed to delete opportunity.'));
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold md:text-2xl">Opportunities</h3>
        <span className='space-x-2 flex items-center'>
          <button className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center md:px-4 md:py-2 md:text-sm md:rounded-lg" onClick={click}>
            <span className="hidden md:inline">Export</span>
            <span className="md:hidden"><svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4' /></svg></span>
          </button>
          <button className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center md:px-4 md:py-2 md:text-sm md:rounded-lg" onClick={() => { setEditData(null); setModalOpen(true); }}>
            <span className="hidden md:inline">+ Add</span>
            <span className="md:hidden">+</span>
          </button>
        </span>
      </div>
      {error && <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-center text-sm">{error}</div>}
      {loading ? (
        <div className="text-center py-6 text-gray-400">Loading...</div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-6 text-gray-400">No opportunities found.</div>
      ) : (
        <div className="overflow-x-auto ">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-2 text-left font-semibold">ID</th>
                <th className="hidden md:table-cell py-2 px-2 text-left font-semibold">Stage</th>
                <th className="hidden md:table-cell py-2 px-2 text-left font-semibold">Expected Value</th>
                <th className="py-2 px-2 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map(o => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedOpportunity(o); setDetailModalOpen(true); }}>
                  <td className="py-2 px-2">{o.id}</td>
                  <td className="hidden md:table-cell py-2 px-2 capitalize">{o.stage}</td>
                  <td className="hidden md:table-cell py-2 px-2">{o.expected_value}</td>
                  <td className="py-2 px-2 text-center" onClick={e => e.stopPropagation()}>
                    <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded mr-2 text-xs" onClick={() => { setEditData(o); setModalOpen(true); }}>Edit</button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded text-xs" onClick={() => { setDeleteId(o.id); setDeleteError(null); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <OpportunityModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); setModalError(null); }}
        onSubmit={editData ? handleEdit : handleAdd}
        initialData={editData ? { ...editData, company_id: Number(companyId) } : { company_id: Number(companyId) }}
        error={modalError}
        onClearError={() => setModalError(null)}
      />
      <OpportunityDetailModal
        open={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedOpportunity(null); }}
        opportunity={selectedOpportunity}
      />
      <DeleteConfirmationModal
        open={deleteId !== null}
        onCancel={() => { setDeleteId(null); setDeleteError(null); }}
        onConfirm={handleDelete}
        loading={false}
        error={deleteError}
        title="Delete Opportunity"
        description="Are you sure you want to delete this opportunity? This action cannot be undone."
      />
    </>
  );
} 