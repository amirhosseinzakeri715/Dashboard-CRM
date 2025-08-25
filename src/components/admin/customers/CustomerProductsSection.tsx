import React, { useEffect, useState } from 'react';
import Card from 'components/card';
import ProductTable from '../products/ProductTable';
import ProductModal from '../products/ProductModal';
import ProductWizardModal, { ProductRow } from '../products/ProductWizardModal';
import { fetchProducts, createProduct, updateProduct } from 'apis/products.api';
import { deleteProduct } from 'apis/products.api';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { getErrorMessage } from 'utils/getErrorMessage';
import DeleteConfirmationModal from 'components/fields/DeleteConfirmationModal';
import Pagination from 'components/common/Pagination';

const columnHelper = createColumnHelper<ProductRow>();

export default function CustomerProductsSection({ customerId, click }: { customerId: number, click }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProductError, setDeleteProductError] = useState<string | null>(null);

  // Products pagination state
  const [productsPage, setProductsPage] = useState(1);
  const productsPageSize = 4;
  const productsTotalPages = Math.ceil(data.length / productsPageSize);
  const paginatedProducts = React.useMemo(() => {
    const start = (productsPage - 1) * productsPageSize;
    return data.slice(start, start + productsPageSize);
  }, [data, productsPage, productsPageSize]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        setData(products.filter((p: ProductRow) => p.company_id === Number(customerId)));
        setError(null);
      } catch (err) {
        setError('Failed to load products.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [customerId]);

  // Dedicated handler for delete button click
  const handleDeleteButtonClick = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
    setDeleteProductError(null);
  };
  const handleDeleteProduct = async () => {
    if (!selectedProduct?.id) return;
    setDeleteLoading(true);
    setDeleteProductError(null);
    try {
      await deleteProduct(selectedProduct.id);
      setData(prev => prev.filter(p => p.id !== selectedProduct.id));
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      setDeleteProductError(getErrorMessage(err, 'Failed to delete product.'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    columnHelper.accessor('company_id', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Company ID</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    columnHelper.accessor('category', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Category</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    columnHelper.accessor('volume_offered', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Volume Offered</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    columnHelper.accessor('delivery_terms', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Delivery Terms</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    columnHelper.accessor('packaging', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Packaging</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    columnHelper.accessor('payment_terms', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Payment Terms</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    columnHelper.accessor('target_price', {
      header: () => <p className="hidden md:hidden lg:hidden text-sm font-bold text-gray-600 dark:text-white">Target Price</p>,
      cell: (info) => <p className="hidden md:hidden lg:hidden  text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
      meta: { className: '' },
    }),
    {
      id: 'actions',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white text-center">ACTIONS</p>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
            title="Edit Product"
            onClick={e => {
              e.stopPropagation();
              setEditProduct(row.original);
              setEditModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
            title="Delete Product"
            onClick={e => {
              e.stopPropagation();
              handleDeleteButtonClick(row.original);
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
      meta: { className: '' },
    },
  ];

  const table = useReactTable({
    data: paginatedProducts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card extra="w-full pb-10 p-8 h-full mt-8" style={{ minHeight: '420px' }}>
      <header className="relative space flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-2xl font-bold dark:text-white">
          Products
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <span className='space-x-2'>
            <button
              onClick={click}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Export
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              + Add Product
            </button>
          </span>
        </div>
      </header>
      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading products...</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-center text-sm">{error}</div>
      )}
      {!loading && !error && (
        <>
          <div className="space-y-4 flex-1 overflow-y-auto" style={{ minHeight: '260px' }}>
            <ProductTable
              table={table}
              onView={product => {
                setSelectedProduct(product);
                setModalOpen(true);
              }}
              onManage={product => {
                setEditProduct(product);
                setEditModalOpen(true);
              }}
            />
            {/* Pagination for products at the bottom of the section */}
            <Pagination
              currentPage={productsPage}
              totalPages={productsTotalPages}
              onPageChange={page => setProductsPage(page)}
            />
          </div>
        </>
      )}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <ProductWizardModal
        open={addModalOpen}
        mode="add"
        initialData={{
          id: undefined,
          company_id: Number(customerId),
          category: '',
          price_list_expiry: '',
          volume_offered: '',
          delivery_terms: '',
          packaging: '',
          payment_terms: '',
          product_specifications: '',
          target_price: 0,
        }}
        onClose={() => { setAddModalOpen(false); setAddError(null); }}
        onSubmit={async (product) => {
          try {
            const payload = { ...product, company_id: Number(customerId) };
            const newProduct = await createProduct(payload);
            setData(prev => [...prev, newProduct]);
            setAddModalOpen(false);
            setAddError(null);
          } catch (err: any) {
            setAddError(getErrorMessage(err, 'Failed to create product. Please try again.'));
          }
        }}
        error={addError}
        onClearError={() => setAddError(null)}
      />
      <ProductWizardModal
        open={editModalOpen}
        mode="edit"
        initialData={editProduct || {
          id: undefined,
          company_id: Number(customerId),
          category: '',
          price_list_expiry: '',
          volume_offered: '',
          delivery_terms: '',
          packaging: '',
          payment_terms: '',
          product_specifications: '',
          target_price: 0,
        }}
        onClose={() => { setEditModalOpen(false); setEditError(null); setEditProduct(null); }}
        onSubmit={async (product) => {
          if (!editProduct?.id) return;
          try {
            const payload = { ...product, company_id: Number(customerId) };
            const updatedProduct = await updateProduct(editProduct.id, payload);
            setData(prev => prev.map(p => p.id === editProduct.id ? updatedProduct : p));
            setEditModalOpen(false);
            setEditProduct(null);
            setEditError(null);
          } catch (err: any) {
            setEditError(getErrorMessage(err, 'Failed to update product. Please try again.'));
          }
        }}
        error={editError}
        onClearError={() => setEditError(null)}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onCancel={() => { setDeleteModalOpen(false); setDeleteProductError(null); }}
        onConfirm={handleDeleteProduct}
        loading={deleteLoading}
        error={deleteProductError}
        title="Delete Product"
        description={`Are you sure you want to delete product "${selectedProduct?.category}"? This action cannot be undone.`}
      />
    </Card>
  );
} 