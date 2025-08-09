'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';

import tableDataCheck from 'variables/data-tables/tableDataCheck';
import tableDataComplex from 'variables/data-tables/tableDataComplex';

// Lazy-load heavy components
const Widget = dynamic(() => import('components/widget/Widget'), { ssr: false, loading: () => <div className="h-24 bg-gray-100 animate-pulse rounded-2xl" /> });
const WeeklyRevenue = dynamic(() => import('components/admin/default/WeeklyRevenue'), { ssr: false, loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-2xl" /> });
const TotalSpent = dynamic(() => import('components/admin/default/TotalSpent'), { ssr: false, loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-2xl" /> });
const PieChartCard = dynamic(() => import('components/admin/default/PieChartCard'), { ssr: false, loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-2xl" /> });
const CheckTable = dynamic(() => import('components/admin/default/CheckTable'), { ssr: false, loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" /> });
const ComplexTable = dynamic(() => import('components/admin/default/ComplexTable'), { ssr: false, loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" /> });
const DailyTraffic = dynamic(() => import('components/admin/default/DailyTraffic'), { ssr: false, loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-2xl" /> });
const TaskCard = dynamic(() => import('components/admin/default/TaskCard'), { ssr: false, loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" /> });
const MiniCalendar = dynamic(() => import('components/calendar/MiniCalendar'), { ssr: false, loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" /> });

const Dashboard = () => {
  return (
    <div className="p-2 sm:p-3 md:p-6">
      {/* Card widget */}
      <div className="grid grid-cols-1 gap-3 md:gap-5 md:mt-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded-xl md:h-24 md:rounded-2xl" />}> <Widget icon={<MdBarChart className="h-6 w-6 md:h-7 md:w-7" />} title={'Earnings'} subtitle={'$340.5'} /> </Suspense>
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded-xl md:h-24 md:rounded-2xl" />}> <Widget icon={<IoDocuments className="h-5 w-5 md:h-6 md:w-6" />} title={'Spend this month'} subtitle={'$642.39'} /> </Suspense>
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded-xl md:h-24 md:rounded-2xl" />}> <Widget icon={<MdBarChart className="h-6 w-6 md:h-7 md:w-7" />} title={'Sales'} subtitle={'$574.34'} /> </Suspense>
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded-xl md:h-24 md:rounded-2xl" />}> <Widget icon={<MdDashboard className="h-5 w-5 md:h-6 md:w-6" />} title={'Your Balance'} subtitle={'$1,000'} /> </Suspense>
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded-xl md:h-24 md:rounded-2xl" />}> <Widget icon={<MdBarChart className="h-6 w-6 md:h-7 md:w-7" />} title={'New Tasks'} subtitle={'145'} /> </Suspense>
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse rounded-xl md:h-24 md:rounded-2xl" />}> <Widget icon={<IoMdHome className="h-5 w-5 md:h-6 md:w-6" />} title={'Total Projects'} subtitle={'$2433'} /> </Suspense>
      </div>
      {/* Charts */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:mt-5 md:gap-5 md:grid-cols-2">
        <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-xl md:h-80 md:rounded-2xl" />}> <TotalSpent /> </Suspense>
        <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-xl md:h-80 md:rounded-2xl" />}> <WeeklyRevenue /> </Suspense>
      </div>
      {/* Tables & Charts */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:mt-5 md:gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-xl md:h-64 md:rounded-2xl" />}> <CheckTable tableData={tableDataCheck} /> </Suspense>
        {/* Traffic chart & Pie Chart */}
        <div className="grid grid-cols-1 gap-3 rounded-xl md:gap-5 md:rounded-[20px] md:grid-cols-2">
          <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-xl md:h-80 md:rounded-2xl" />}> <DailyTraffic /> </Suspense>
          <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-xl md:h-80 md:rounded-2xl" />}> <PieChartCard /> </Suspense>
        </div>
        {/* Complex Table , Task & Calendar */}
        <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-xl md:h-64 md:rounded-2xl" />}> <ComplexTable tableData={tableDataComplex} /> </Suspense>
        {/* Task chart & Calendar */}
        <div className="grid grid-cols-1 gap-3 rounded-xl md:gap-5 md:rounded-[20px] md:grid-cols-2">
          <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-xl md:h-64 md:rounded-2xl" />}> <TaskCard /> </Suspense>
          <div className="grid grid-cols-1 rounded-xl md:rounded-[20px]">
            <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-xl md:h-64 md:rounded-2xl" />}> <MiniCalendar /> </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
