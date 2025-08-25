import React from 'react';

interface ProductModalProps {
  product: any;
  open: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, open, onClose }) => {
  if (!open || !product) return null;
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
              Product Details
            </h2>
          </div>
          <div className="space-y-4 text-base px-8 pb-8 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">ID:</span>
              <span className="break-all overflow-hidden">{product.id}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Company ID:</span>
              <span className="break-all overflow-hidden">{product.company_id}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Category:</span>
              <span className="break-all overflow-hidden">{product.category}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Volume Offered:</span>
              <span className="break-all overflow-hidden">{product.volume_offered}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Delivery Terms:</span>
              <span className="break-all overflow-hidden">{product.delivery_terms}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Packaging:</span>
              <span className="break-all overflow-hidden">{product.packaging}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Payment Terms:</span>
              <span className="break-all overflow-hidden">{product.payment_terms}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Product Specifications:</span>
              <span className="break-all overflow-hidden whitespace-pre-wrap">{product.product_specifications}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Target Price:</span>
              <span className="break-all overflow-hidden">{product.target_price}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Price List:</span>
              <span className="break-all overflow-hidden">{product.price_list}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 items-start">
              <span className="font-semibold">Price List Expiry:</span>
              <span className="break-all overflow-hidden">{product.price_list_expiry}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal; 