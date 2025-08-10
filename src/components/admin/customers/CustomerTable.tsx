import React from 'react';
import clsx from 'clsx';
import { flexRender, Table } from '@tanstack/react-table';

interface CustomerTableProps {
  table: Table<any>;
  onManage: (customer: any) => void;
  onView: (customer: any) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ table, onManage, onView }) => {
  const rows = table.getRowModel().rows;
  // Remove rowCount and emptyRows logic

  return (
    <div className="mt-4 w-full">
      {/* Mobile: Card/List view */}
      <div className="flex flex-col gap-2 md:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="bg-white dark:bg-navy-800 rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition border border-gray-100 dark:border-navy-700"
            onClick={() => onView(row.original)}
          >
            <div className="flex justify-between items-center">
              <div className="font-bold text-navy-700 dark:text-white text-base">
                {row.original.name}
              </div>
              <button
                type="button"
                className="w-full min-h-[44px] min-w-[44px] px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-base font-semibold active:scale-95 md:w-auto md:min-h-0 md:min-w-0 md:px-3 md:py-1 md:text-xs md:font-medium"
                title="Manage Customer"
                onClick={e => {
                  e.stopPropagation();
                  onManage(row.original);
                }}
              >
                Manage
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Website:</span> {row.original.website || '-'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Country:</span> {row.original.country || '-'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Industry:</span> {row.original.industry_category || '-'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Lead Score:</span> {row.original.lead_score || '-'}
            </div>
          </div>
        ))}
      </div>
      {/* Desktop: Table view */}
      <table className="hidden md:table min-w-full w-full table-fixed" style={{ tableLayout: 'fixed' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="!border-px !border-gray-400">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  className={clsx(
                    "cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30 text-xs font-semibold min-w-[120px]",
                    (header.column.columnDef.meta as any)?.className
                  )}
                  style={{ minWidth: 120 }}
                >
                  <div className="items-center justify-between text-xs text-gray-200">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: '', desc: '' }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-green-50 cursor-pointer transition"
              style={{ height: '56px' }}
              onClick={() => onView(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={clsx(
                    "min-w-[120px] border-white/0 py-6 text-xs",
                    (cell.column.columnDef.meta as any)?.className
                  )}
                  style={{ minWidth: 120 }}
                >
                  {cell.column.id === 'actions' ? (
                    <button
                      type="button"
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
                      title="Manage Customer"
                      onClick={e => {
                        e.stopPropagation();
                        onManage(row.original);
                      }}
                    >
                      Manage
                    </button>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable; 