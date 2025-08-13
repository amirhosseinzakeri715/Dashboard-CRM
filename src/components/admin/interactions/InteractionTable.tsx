import React from 'react';
import clsx from 'clsx';
import { flexRender, Table } from '@tanstack/react-table';

interface InteractionTableProps {
  table: Table<any>;
  onView: (interaction: any) => void;
}

const statusColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

const InteractionTable: React.FC<InteractionTableProps> = ({ table, onView }) => {
  const rows = table.getRowModel().rows;
  const rowCount = 4;
  const emptyRows = rowCount - rows.length > 0 ? rowCount - rows.length : 0;

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-max w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="!border-px !border-gray-400">
              {headerGroup.headers.map((header, idx) => {
                const isIdCol = idx === 0;
                const isActionsCol = idx === headerGroup.headers.length - 1;
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className={clsx(
                      "cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30",
                      (header.column.columnDef.meta as any)?.className,
                      !isIdCol && !isActionsCol ? "hidden md:table-cell" : ""
                    )}
                  >
                    <div className="items-center justify-between text-xs text-gray-200">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: '', desc: '' }[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-blue-50 cursor-pointer transition"
              style={{ height: '56px' }}
              onClick={() => onView(row.original)}
            >
              {row.getVisibleCells().map((cell, idx) => {
                const isIdCol = idx === 0;
                const isActionsCol = idx === row.getVisibleCells().length - 1;
                return (
                  <td
                    key={cell.id}
                    className={clsx(
                      "py-6 pr-6",
                      (cell.column.columnDef.meta as any)?.className,
                      !isIdCol && !isActionsCol ? "hidden md:table-cell" : ""
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Pad with empty rows for stable height */}
          {Array.from({ length: emptyRows }).map((_, idx) => (
            <tr key={`empty-${idx}`} style={{ height: '56px' }}>
              {table.getAllColumns().map((col) => (
                <td key={col.id} className="py-6 pr-6">&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InteractionTable; 