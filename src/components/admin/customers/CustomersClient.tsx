'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from 'components/card';
import CardMenu2 from 'components/card/CardMenu2';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import CustomerTable from 'components/admin/customers/CustomerTable';
import CustomerModal from 'components/admin/customers/CustomerModal';
import CustomerWizardModal, { CustomerRow } from 'components/admin/customers/CustomerWizardModal';
import { getCustomers, createCustomer, updateCustomer } from 'utils/api';
import FormMessage from 'components/fields/FormMessage';
import { getErrorMessage } from 'utils/getErrorMessage';
import Pagination from 'components/common/Pagination';

const columnHelper = createColumnHelper<CustomerRow>();

const mockData: CustomerRow[] = [
  {
    id: 1,
    name: 'Acme Corp',
    website: 'acme.com',
    country: 'a',
    industry_category: 1,
    activity_level: 'active',
    acquired_via: 'Website',
    lead_score: 95,
    notes: 'Top client',
  },
  {
    id: 2,
    name: 'Beta LLC',
    website: 'beta-llc.com',
    country: 'b',
    industry_category: 2,
    activity_level: 'passive',
    acquired_via: 'Referral',
    lead_score: 80,
    notes: 'Potential upsell',
  },
  {
    id: 3,
    name: 'Gamma Inc',
    website: 'gamma.com',
    country: 'c',
    industry_category: 3,
    activity_level: 'active',
    acquired_via: 'Cold Call',
    lead_score: 60,
    notes: 'Needs follow-up',
  },
];

export default function CustomersClient() {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [sortConfig, setSortConfig] = useState<{
  key: '' | 'country' | 'lead_score' | 'industry_category';
  direction: 'asc' | 'desc';
}>({ key: '', direction: 'asc' })
  const [data, setData] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerRow | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const customers = await getCustomers();
        setData(customers.map(customer => ({
          ...customer,
          website: customer.website || ''
        })));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError('Failed to load customers. Using mock data.');
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Table columns definition
  const columns = [
    columnHelper.accessor('id', {
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor('name', {
      header: () => (
        <p className=" md:block text-sm font-bold text-gray-600 dark:text-white">NAME</p>
      ),
      cell: (info) => (
        <p className=" md:block text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: ' md:table-cell' },
    }),
    columnHelper.accessor('website', {
      header: () => (
        <p className="hidden md:block text-sm font-bold text-gray-600 dark:text-white">WEBSITE</p>
      ),
      cell: (info) => (
        <p className="hidden md:block text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: ' hidden md:table-cell' },
    }),
    columnHelper.accessor('country', {
      header: () => (
        <p className="hidden md:block text-sm font-bold text-gray-600 dark:text-white">COUNTRY</p>
      ),
      cell: (info) => (
        <p className="hidden md:block text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: 'hidden  md:table-cell' },
    }),
    columnHelper.accessor('industry_category', {
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">INDUSTRY</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: ' table-cell ' },
    }),
    columnHelper.accessor('activity_level', {
      header: () => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-gray-600 dark:text-white">ACTIVITY LEVEL</p>
      ),
      cell: (info) => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: 'hidden sm:hidden md:hidden lg:hidden md:table-cell' },
    }),
    columnHelper.accessor('acquired_via', {
      header: () => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-gray-600 dark:text-white">ACQUIRED VIA</p>
      ),
      cell: (info) => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: 'hidden sm:hidden md:hidden lg:hidden md:table-cell' },
    }),
    columnHelper.accessor('lead_score', {
      header: () => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-gray-600 dark:text-white">LEAD SCORE</p>
      ),
      cell: (info) => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: 'hidden sm:hidden md:hidden lg:hidden md:table-cell' },
    }),
    columnHelper.accessor('notes', {
      header: () => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-gray-600 dark:text-white">NOTES</p>
      ),
      cell: (info) => (
        <p className="hidden sm:hidden md:hidden lg:hidden text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>
      ),
      meta: { className: 'hidden sm:hidden md:hidden lg:hidden md:table-cell' },
    }),
    {
      id: 'actions',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white text-center">ACTIONS</p>
      ),
      cell: ({ row }: any) => (
          <button
            type="button"
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
            title="Manage Customer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/customers/${row.original.id}`);
            }}
          >
            Manage
          </button>
      ),
      size: 100,
      minSize: 80,
      maxSize: 120,
      enableSorting: false,
      enableResizing: false,
    },
  ];

  const sortedData = React.useMemo(() => {
  const sortableData = [...data];
  if (sortConfig.key) {
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  return sortableData;
}, [data, sortConfig])

  // Customers pagination state
  const [customersPage, setCustomersPage] = useState(1);
  const customersPageSize = 10;
  const customersTotalPages = Math.ceil(sortedData.length / customersPageSize);
  const paginatedCustomers = React.useMemo(() => {
    const start = (customersPage - 1) * customersPageSize;
    return sortedData.slice(start, start + customersPageSize);
  }, [sortedData, customersPage, customersPageSize]);

  const table = useReactTable({
    data: paginatedCustomers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });


  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setAddError(null);
  };
  const handleAddCustomer = async (customer: CustomerRow) => {
    try {
      const newCustomer = await createCustomer(customer);
      setData((prev) => [...prev, { ...newCustomer, website: newCustomer.website || '' }]);
      setAddModalOpen(false);
      setAddError(null);
    } catch (err: any) {
      setAddError(getErrorMessage(err, 'Failed to create customer. Please try again.'));
    }
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditCustomer(null);
    setEditError(null);
  };

  // Modal handlers
  const handleViewCustomer = (customer: CustomerRow) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };
  const handleEditCustomer = async (customer: CustomerRow) => {
    if (!editCustomer?.id) return;
    try {
      const updatedCustomer = await updateCustomer(editCustomer.id, customer);
      setData((prev) => prev.map((c) =>
        c.id === editCustomer.id ? { ...updatedCustomer, website: updatedCustomer.website || '' } : c
      ));
      setEditModalOpen(false);
      setEditCustomer(null);
      setEditError(null);
      setError(null);
    } catch (err: any) {
      setEditError(getErrorMessage(err, 'Failed to update customer. Please try again.'));
    }
  };
  // Remove handleResetData and any button or UI related to resetting data to mock data.
  const handleSort = (key: '' | 'country' | 'lead_score' | 'industry_category') => {
  let direction: 'asc' | 'desc' = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
}

  return (
    <>
      {error && (
        <FormMessage type="error">{error}</FormMessage>
      )}
      <Card extra="w-full pb-10 p-8 h-full">
        <header className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Customers
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <CardMenu2 onSort={handleSort} sort={sortConfig}/>
            <button
              onClick={handleOpenAddModal}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              + Add Customer
            </button>
          </div>
        </header>
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading customers...</p>
          </div>
        )}
        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <CustomerTable
              table={table}
              onView={handleViewCustomer}
              onManage={customer => router.push(`/admin/customers/${customer.id}`)}
            />
            {/* Pagination for customers at the bottom of the section */}
            <Pagination
              currentPage={customersPage}
              totalPages={customersTotalPages}
              onPageChange={page => setCustomersPage(page)}
            />
          </>
        )}
      </Card>

      <CustomerModal
        customer={selectedCustomer}
        open={modalOpen}
        onClose={handleCloseModal}
      />

      <CustomerWizardModal
        open={addModalOpen}
        mode="add"
        initialData={{
          id: undefined,
          name: '',
          website: '',
          country: '',
          industry_category: 1,
          activity_level: '',
          acquired_via: '',
          lead_score: 0,
          notes: '',
        }}
        onClose={handleCloseAddModal}
        onSubmit={handleAddCustomer}
        error={addError}
        onClearError={() => setAddError(null)}
      />
      <CustomerWizardModal
        open={editModalOpen}
        mode="edit"
        initialData={editCustomer || {
          id: undefined,
          name: '',
          website: '',
          country: '',
          industry_category: 1,
          activity_level: '',
          acquired_via: '',
          lead_score: 0,
          notes: '',
        }}
        onClose={handleCloseEditModal}
        onSubmit={handleEditCustomer}
        error={editError}
        onClearError={() => setEditError(null)}
      />
    </>
  );
} 