"use client"

import CustomersClient from 'components/admin/customers/CustomersClient';
import ProductsClient from 'components/admin/products/ProductsClient';
import InteractionsClient from 'components/admin/interactions/InteractionsClient';
import PieChartCard from 'components/admin/customers/PieCharCard';
import DailyTraffic from 'components/admin/customers/DailyTraffic';
import TotalInteractions from 'components/admin/customers/TotalInteractions';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from 'apis/companies.api';
import { exportCompanies } from 'apis/export.api';

export default function CustomersPage() {
  const { data } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
    refetchOnWindowFocus: false
  })
  const companies = useQuery({
    queryKey: ["export"],
    queryFn: exportCompanies,
    refetchOnWindowFocus: false
  })

  const handleDownloadCSV = () => {
    if (!companies.data) return;
    const blob = new Blob([companies.data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies.csv';
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 p-2 sm:p-3 md:p-6">
      <div className='flex justify-end'>
        <button
          onClick={handleDownloadCSV}
          disabled={!companies.data}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-md shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 md:px-5 md:py-2 md:rounded-lg"
        >
          Export
        </button>
      </div>
      <section className='grid grid-cols-1 gap-y-3 md:grid-cols-4 md:gap-x-5'>
        <div className='md:col-span-2'>
          <TotalInteractions />
        </div>
        <div>
          <DailyTraffic data={data}/>
        </div>
        <div>
          <PieChartCard data={data}/>
        </div>
      </section>
      <CustomersClient />
      {/* <ProductsClient />
      <InteractionsClient /> */}
    </div>
  )
}