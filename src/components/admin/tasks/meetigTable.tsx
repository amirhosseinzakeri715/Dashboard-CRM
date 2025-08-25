import clsx from "clsx"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  createColumnHelper
} from "@tanstack/react-table"
import React, { useState, useMemo } from "react"
import { IUser } from "types/user";

export default function MeetingsTable({meetings}) {
  // const PAGE_SIZE = 3;
  // const [currentPage, setCurrentPage] = useState(1);
  // const paginatedMeetings = useMemo(() => {
  //   const startIndex = (currentPage - 1) * PAGE_SIZE;
  //   return meetings?.slice(startIndex, startIndex + PAGE_SIZE);
  // }, [currentPage]);
  // const totalPages = useMemo(() => Math.ceil(meetings?.length / PAGE_SIZE) || 1, []);
  // const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  // const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const columnHelper= createColumnHelper();
  const columns= [
    columnHelper.accessor("report", {
      header: "Description",
      cell: (info) => `${info.getValue()}`,
      meta: { className: "table-cell text-start" }
    }),
    columnHelper.accessor("attendees", {
      header: "MEMBERS",
      cell: (info) => `${info.getValue().map((member: IUser) => member.full_name)}`,
      meta: { className: "table-cell text-start" }
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => {
        const dateString = info.getValue() as string;
        if (!dateString) return "No date";
        const [date] = dateString.split("T");
        return date.split("-").reverse().join("-");
      },
      meta: { className: "table-cell text-start" }
    }),
    columnHelper.accessor("attachment", {
      header: "Action",
      cell: () => (
        <div className="flex justify-center">
          <button
            type="button"
            className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Manage
          </button>
        </div>
      ),
      meta: { className: "table-cell text-center" }
    }),
  ]

  const table= useReactTable({
    columns,
    data: meetings || [],
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <section className="space-y-8 relative min-h-[400px]">
      <h2 className="text-xl font-bold text-navy-700 dark:text-white">Meetings</h2>
      <table className="w-full">
        <thead className="border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={clsx(
                    (header.column.columnDef.meta as any)?.className,
                    "text-sm font-bold text-gray-600 dark:text-white pb-2 dark:border-white/30"
                  )}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) =>(
            <tr
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={ clsx("py-6 text-sm font-bold text-navy-700 dark:text-white") }
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
            ))}
        </tbody>
      </table>
      {/* Pagination controls absolutely at the bottom */}
      {/* <ol className="flex justify-center text-xs font-medium space-x-1 mt-4 absolute left-1/2 -translate-x-1/2 bottom-4 z-10">
        <li onClick={handlePrevPage} className="cursor-pointer">
          <a className="inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded">{'<'}</a>
        </li>
        {currentPage-2 >= 1 ? (
          <>
            <li onClick={() => setCurrentPage(currentPage-2)} className="cursor-pointer">
              <a className="block w-8 h-8 text-center border border-gray-100 rounded leading-8">{currentPage-2}</a>
            </li>
            <li onClick={() => setCurrentPage(currentPage-1)} className="block w-8 h-8 text-center border-gray-100 rounded cursor-pointer leading-8">{currentPage-1}</li>
          </>
        ) : currentPage-2 === 0 ? (
          <li onClick={() => setCurrentPage(currentPage-1)} className="block w-8 h-8 text-center border-gray-100 rounded leading-8 cursor-pointer">{currentPage-1}</li>
        ) : ""}
        <li onClick={() => setCurrentPage(currentPage)} className="cursor-pointer">
          <a className="block w-8 h-8 text-center border text-white bg-blue-600 border-blue-600 rounded leading-8">{currentPage}</a>
        </li>
        {totalPages-currentPage === 1 ? (
          <li onClick={() => setCurrentPage(currentPage+1)} className="cursor-pointer">
            <a className="block w-8 h-8 text-center border border-gray-100 rounded leading-8">{currentPage+1}</a>
          </li>
        ) : totalPages-currentPage >= 2 ? (
          <>
            <li onClick={() => setCurrentPage(currentPage+1)} className="cursor-pointer">
              <a className="block w-8 h-8 text-center border border-gray-100 rounded leading-8">{currentPage+1}</a>
            </li>
            <li onClick={() => setCurrentPage(currentPage+2)} className="cursor-pointer">
              <a className="block w-8 h-8 text-center border border-gray-100 rounded leading-8">{currentPage+2}</a>
            </li>
          </>
        ) : ""}
        <li onClick={handleNextPage} className="cursor-pointer">
          <a className="inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded">{'>'}</a>
        </li>
      </ol> */}
    </section>
  )
}