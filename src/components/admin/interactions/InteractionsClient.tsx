'use client';

import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import InteractionTable from './InteractionTable';
import InteractionWizardModal, {
  InteractionRow,
} from './InteractionWizardModal';
import {
  fetchInteractions,
  createInteraction,
  deleteInteraction,
} from 'apis/interactions.api';
import { updateInteraction } from 'apis/interactions.api';
import { MdViewList, MdViewModule } from 'react-icons/md';
import InteractionCards from './InteractionCards';
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';

const columnHelper = createColumnHelper<InteractionRow>();

// Create a simple InteractionModal for viewing details
const InteractionModal = ({
  interaction,
  open,
  onClose,
}: {
  interaction: InteractionRow | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!open || !interaction) return null;
  const colorMap: Record<string, string> = {
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
  };
  const textMap: Record<string, string> = {
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
  };
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
            <h2 className="text-2xl font-bold mb-4 ">
              Interaction Details
            </h2>
          </div>
          <div className="space-y-4 text-base px-8 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">ID:</span>
              <span className="break-all overflow-hidden">
                {interaction.id}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Company ID:</span>
              <span className="break-all overflow-hidden">
                {interaction.company_id}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Contact ID:</span>
              <span className="break-all overflow-hidden">
                {interaction.contact_id || '-'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Type:</span>
              <span className="break-all overflow-hidden">
                {interaction.type}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Status:</span>
              <span
                className={`text-xs font-semibold capitalize ${
                  interaction.status === 'green'
                    ? 'text-green-700'
                    : interaction.status === 'yellow'
                    ? 'text-yellow-700'
                    : interaction.status === 'red'
                    ? 'text-red-700'
                    : 'text-gray-700'
                }`}
              >
                {interaction.status}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Summary:</span>
              <span className="break-all overflow-hidden whitespace-pre-wrap">
                {interaction.summary}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function InteractionsClient() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<InteractionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] =
    useState<InteractionRow | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editInteraction, setEditInteraction] = useState<InteractionRow | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const interactions = await fetchInteractions();
        setData(interactions);
        setError(null);
      } catch (err) {
        setError('Failed to load interactions.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const columns = [
    columnHelper.accessor('company_id', {
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Company ID
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('contact_id', {
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Contact ID
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue() || '-'}
        </p>
      ),
    }),
    columnHelper.accessor('type', {
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Type</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('status', {
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Status
        </p>
      ),
      cell: (info) => {
        const value = info.getValue();
        const colorMap: Record<string, string> = {
          green: 'bg-green-100 text-green-800',
          yellow: 'bg-yellow-100 text-yellow-800',
          red: 'bg-red-100 text-red-800',
        };
        return (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              colorMap[value] || 'bg-gray-100 text-gray-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                value === 'green'
                  ? 'bg-green-500'
                  : value === 'yellow'
                  ? 'bg-yellow-400'
                  : value === 'red'
                  ? 'bg-red-500'
                  : 'bg-gray-400'
              }`}
            ></span>
            {value}
          </span>
        );
      },
    }),
    columnHelper.accessor('summary', {
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Summary
        </p>
      ),
      cell: (info) => (
        <p className="text-sm text-navy-700 dark:text-white truncate max-w-[200px]">
          {info.getValue()}
        </p>
      ),
    }),
    {
      id: 'actions',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white text-center">
          ACTIONS
        </p>
      ),
      cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
            title="Edit Interaction"
            onClick={(e) => {
              e.stopPropagation();
              setEditInteraction(row.original);
              setEditModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
            title="Delete Interaction"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row.original.id);
              setDeleteError(null);
            }}
          >
            Delete
          </button>
        </div>
      ),
      size: 120,
      minSize: 100,
      maxSize: 140,
      enableSorting: false,
      enableResizing: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);
  const handleAddInteraction = async (interaction: InteractionRow) => {
    try {
      const { contacts, documents, ...apiPayload } = interaction;
      const payload = {
        ...apiPayload,
        company_id: interaction.company_id,
        ...(interaction.contact_id ? { contact_id: interaction.contact_id } : {}),
        type: interaction.type,
        status: interaction.status,
        summary: interaction.summary,
        documents: Array.isArray(documents) ? documents : [],
      };
      const newInteraction = await createInteraction(payload);
      setData((prev) => [...prev, newInteraction]);
      setAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create interaction. Please try again.');
    }
  };

  const handleEditInteraction = async (updated: InteractionRow) => {
    if (!editInteraction?.id) return;
    try {
      const { contacts, documents, ...apiPayload } = updated;
      const payload = {
        ...apiPayload,
        company_id: updated.company_id,
        ...(updated.contact_id ? { contact_id: updated.contact_id } : {}),
        type: updated.type,
        status: updated.status,
        summary: updated.summary,
        documents: Array.isArray(documents) ? documents : [],
      };
      const newInteraction = await updateInteraction(
        editInteraction.id,
        payload,
      );
      setData((prev) =>
        prev.map((i) => (i.id === editInteraction.id ? newInteraction : i)),
      );
      setEditModalOpen(false);
      setEditInteraction(null);
      setFeedback('Interaction updated successfully.');
    } catch (err) {
      setFeedback('Failed to update interaction.');
    }
  };

  return (
    <Card extra="w-full pb-10 p-8 h-full mt-8">
      {error && (
        <FormMessage type="error">{error}</FormMessage>
      )}
      <header className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-xl font-bold  dark:text-white">
          Interactions
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Table View"
          >
            <MdViewList className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Card View"
          >
            <MdViewModule className="h-5 w-5" />
          </button>
          <button
            onClick={handleOpenAddModal}
            className=" md:px-2 md:py-1  bg-green-600 hover:bg-green-700 text-white md:font-medium rounded md:px-4 md:py-2 md:text-sm md:rounded-lg "
          >
            <span className="hidden md:inline ">+ Add Interaction</span>
            <span className="md:hidden inline">+</span>
          </button>
          <button
            onClick={/* TODO: implement export handler */() => {}}
            className=" px-2 py-1 text-xs bg-green-600 hover:bg-blue-700 text-white font-medium rounded md:px-4 md:py-2 md:text-sm md:rounded-lg"
          >
            <span className="md:inline hidden">Export</span>
            <span className="md:hidden inline">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4' /></svg>
            </span>
          </button>
        </div>
      </header>
      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Loading interactions...
          </p>
        </div>
      )}
      {!loading && !error && (
        viewMode === 'table' ? (
          <InteractionTable
            table={table}
            onView={(interaction) => {
              setSelectedInteraction(interaction);
              setViewModalOpen(true);
            }}
          />
        ) : (
          <InteractionCards
            interactions={data}
            onEdit={interaction => {
              setEditInteraction(interaction);
              setEditModalOpen(true);
            }}
            onView={interaction => {
              setSelectedInteraction(interaction);
              setViewModalOpen(true);
            }}
          />
        )
      )}
      <InteractionWizardModal
        open={addModalOpen}
        mode="add"
        initialData={{
          id: undefined,
          company_id: 0,
          contact_id: undefined,
          type: '',
          status: 'green',
          summary: '',
          contacts: [],
          documents: [],
        }}
        onClose={handleCloseAddModal}
        onSubmit={handleAddInteraction}
      />
      <InteractionModal
        interaction={selectedInteraction}
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedInteraction(null);
        }}
      />
      <InteractionWizardModal
        open={editModalOpen}
        mode="edit"
        initialData={
          editInteraction || {
            id: undefined,
            company_id: 0,
            contact_id: undefined,
            type: '',
            status: 'green',
            summary: '',
            contacts: [],
            documents: [],
          }
        }
        onClose={() => {
          setEditModalOpen(false);
          setEditInteraction(null);
        }}
        onSubmit={handleEditInteraction}
      />
      {feedback && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-navy-800 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-lg shadow-lg text-center text-sm font-semibold text-gray-800 dark:text-white animate-fadeIn">
          {feedback}
          <button
            className="ml-4 text-blue-600 hover:underline"
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </Card>
  );
}
function setDeleteId(id: any) {
  throw new Error('Function not implemented.');
}

function setDeleteError(arg0: null) {
  throw new Error('Function not implemented.');
}

