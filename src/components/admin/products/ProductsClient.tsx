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
import ProductTable from './ProductTable';
import ProductModal from './ProductModal';
import ProductWizardModal, { ProductRow } from './ProductWizardModal';
import { fetchProducts, createProduct, updateProduct } from 'apis/products.api';
import { deleteProduct } from 'apis/products.api';
import DeleteConfirmationModal from 'components/fields/DeleteConfirmationModal';

const columnHelper = createColumnHelper<ProductRow>();

export default function ProductsClient() {
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

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        setData(products);
        setError(null);
      } catch (err) {
        setError('Failed to load products.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Dedicated handler for delete button click
  const handleDeleteButtonClick = (product: ProductRow) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const handleDeleteProduct = async (product: ProductRow) => {
    if (!product?.id) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(product.id);
      setData(prev => prev.filter(p => p.id !== product.id));
      setError(null);
    } catch (err) {
      setError('Failed to delete product.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: () => <p className="hidden">ID</p>,
      cell: (info) => <p className="hidden">{info.getValue()}</p>,
    }),
    columnHelper.accessor('company_id', {
      header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">Company ID</p>,
      cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
    }),
    columnHelper.accessor('category', {
      header: () => <p className="hidden text-sm font-bold text-gray-600 dark:text-white">Category</p>,
      cell: (info) => <p className="hiddentext-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
    }),
    columnHelper.accessor('volume_offered', {
      header: () => <p className="hidden md:hidden lg:hidden  text-sm font-bold text-gray-600 dark:text-white">Volume Offered</p>,
      cell: (info) => <p className="hidden md:hidden lg:hidden  text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
    }),
    columnHelper.accessor('delivery_terms', {
      header: () => <p className="hidden text-sm font-bold text-gray-600 dark:text-white">Delivery Terms</p>,
      cell: (info) => <p className="hidden text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
    }),
    columnHelper.accessor('packaging', {
      header: () => <p className="hidden text-sm font-bold text-gray-600 dark:text-white">Packaging</p>,
      cell: (info) => <p className="hidden text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
    }),
    columnHelper.accessor('payment_terms', {
      header: () => <p className="hidden text-sm font-bold text-gray-600 dark:text-white">Payment Terms</p>,
      cell: (info) => <p className="hidden text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
    }),
    columnHelper.accessor('target_price', {
      header: () => <p className="hidden">Target Price</p>,
      cell: (info) => <p className="hidden">{info.getValue()}</p>,
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
            className="px-3 py-1 bg-green-800 text-white rounded hover:bg-green-700 transition text-sm font-medium"
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
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition text-sm font-medium"
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
  const handleAddProduct = async (product: ProductRow) => {
    try {
      const newProduct = await createProduct(product);
      setData(prev => [...prev, newProduct]);
      setAddModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create product. Please try again.');
    }
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
  };
  const handleEditProduct = async (product: ProductRow) => {
    if (!editProduct?.id) return;
    try {
      const updatedProduct = await updateProduct(editProduct.id, product);
      setData(prev => prev.map(p => p.id === editProduct.id ? updatedProduct : p));
      setEditModalOpen(false);
      setEditProduct(null);
      setError(null);
    } catch (err) {
      setError('Failed to update product. Please try again.');
    }
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Card extra="w-full pb-10 p-8 h-full mt-8">
        <header className="relative space flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="text-xl font-bold  dark:text-white">
            Products
          </div>
          <div className="flex flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <button
              onClick={handleOpenAddModal}
              className="min-h-[32px] min-w-[32px] px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white font-medium rounded md:px-4 md:py-2 md:text-sm md:rounded-lg"
            >
              <span className="md:inline hidden">+ Add Product</span>
              <span className="md:hidden inline">+</span>
            </button>
            <button
              onClick={/* TODO: implement export handler */() => {}}
              className="min-h-[32px] min-w-[32px] px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded md:px-4 md:py-2 md:text-sm md:rounded-lg"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading products...</p>
          </div>
        )}
        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {!loading && !error && (
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
        )}
      </Card>
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onClose={handleCloseModal}
      />
      <ProductWizardModal
        open={addModalOpen}
        mode="add"
        initialData={{
          id: undefined,
          company_id: 0,
          category: '',
          price_list_expiry: '',
          volume_offered: '',
          delivery_terms: '',
          packaging: '',
          payment_terms: '',
          product_specifications: '',
          target_price: 0,
        }}
        onClose={handleCloseAddModal}
        onSubmit={async (product) => {
          try {
            const payload = {
              company_id: product.company_id,
              category: product.category,
              price_list_expiry: product.price_list_expiry || null,
              volume_offered: product.volume_offered,
              delivery_terms: product.delivery_terms,
              packaging: product.packaging,
              payment_terms: product.payment_terms,
              product_specifications: product.product_specifications,
              target_price: product.target_price,
            };
            const newProduct = await createProduct(payload);
            setData(prev => [...prev, newProduct]);
            setAddModalOpen(false);
            setError(null);
          } catch (err) {
            setError('Failed to create product. Please try again.');
          }
        }}
      />
      <ProductWizardModal
        open={editModalOpen}
        mode="edit"
        initialData={editProduct || {
          id: undefined,
          company_id: 0,
          category: '',
          price_list_expiry: '',
          volume_offered: '',
          delivery_terms: '',
          packaging: '',
          payment_terms: '',
          product_specifications: '',
          target_price: 0,
        }}
        onClose={handleCloseEditModal}
        onSubmit={async (product) => {
          if (!editProduct?.id) return;
          try {
            const payload = {
              company_id: product.company_id,
              category: product.category,
              price_list_expiry: product.price_list_expiry || null,
              volume_offered: product.volume_offered,
              delivery_terms: product.delivery_terms,
              packaging: product.packaging,
              payment_terms: product.payment_terms,
              product_specifications: product.product_specifications,
              target_price: product.target_price,
            };
            const updatedProduct = await updateProduct(editProduct.id, payload);
            setData(prev => prev.map(p => p.id === editProduct.id ? updatedProduct : p));
            setEditModalOpen(false);
            setEditProduct(null);
            setError(null);
          } catch (err) {
            setError('Failed to update product. Please try again.');
          }
        }}
      />
      {/* DeleteConfirmationModal should only be shown when deleting, not in detail modal context */}
      {modalOpen && false && (
        <DeleteConfirmationModal
          open={modalOpen}
          onCancel={handleCloseModal}
          onConfirm={() => handleDeleteProduct(selectedProduct!)}
          loading={deleteLoading}
          title="Delete Product"
          description={`Are you sure you want to delete product "${selectedProduct?.category}"? This action cannot be undone.`}
        />
      )}
    </>
  );
} 