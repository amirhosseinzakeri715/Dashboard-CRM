'use client';

import React, { useState, useMemo } from 'react';
import Card from 'components/card';
import PieChart from 'components/charts/PieChart';
import LineChart from 'components/charts/LineChart';
import Widget from 'components/widget/Widget'; // Import Widget

import TaskManagerTable from 'components/admin/task-manager/TaskManagerTable';
import TaskManagerCards from 'components/admin/task-manager/TaskManagerCards';
import TaskCard from 'components/admin/task-manager/TaskCard';
import { useAuth } from 'contexts/AuthContext';
import { getTasks } from 'apis/tasks.api';
import { useQuery } from '@tanstack/react-query';
import { MdTaskAlt, MdTrendingUp, MdPieChart, MdViewList, MdViewModule, MdOutlinePendingActions } from 'react-icons/md';

const TaskManagerPage = () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const { user } = useAuth();
  
  // Fetch tasks  API  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    refetchOnWindowFocus: false
  });

  // Chart data 
  const chartData = useMemo(() => {
    if (!tasks) return { 
      pieData: [0, 0, 0], 
      lineData: { created: Array(30).fill(0), completed: Array(30).fill(0) },
    };
    
    // Match your actual statuses
    const openTasks = tasks.filter(task => task.status === 'open').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const closedTasks = tasks.filter(task => task.status === 'closed').length;
    
    // Calculate line chart for the last 30 days
    const dailyCreated = Array(30).fill(0);
    const dailyCompleted = Array(30).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      const createdDate = new Date(task.created_at);
      createdDate.setHours(0, 0, 0, 0);
      const diffTimeCreated = today.getTime() - createdDate.getTime();
      const diffDaysCreated = Math.floor(diffTimeCreated / (1000 * 60 * 60 * 24));
      if (diffDaysCreated >= 0 && diffDaysCreated < 30) {
        dailyCreated[29 - diffDaysCreated]++;
      }

      if (task.status === 'closed' && task.updated_at) {
        const updatedDate = new Date(task.updated_at);
        updatedDate.setHours(0, 0, 0, 0);
        const diffTimeUpdated = today.getTime() - updatedDate.getTime();
        const diffDaysUpdated = Math.floor(diffTimeUpdated / (1000 * 60 * 60 * 24));
        if (diffDaysUpdated >= 0 && diffDaysUpdated < 30) {
          dailyCompleted[29 - diffDaysUpdated]++;
        }
      }
    });
    
    return {
      pieData: [openTasks, inProgressTasks, closedTasks],
      lineData: { created: dailyCreated, completed: dailyCompleted },
    };
  }, [tasks]);

  const lineChartData = [
    {
      name: 'Tasks Completed',
      data: chartData.lineData.completed,
    },
    {
      name: 'Tasks Created',
      data: chartData.lineData.created,
    },
  ];

  const pieChartOptions = {
    labels: ['Open', 'In Progress', 'Closed'],
    colors: ['#4f46e5', '#f97316', '#16a34a'],
    chart: {
      type: 'pie',
      height: 100,
      width: 100,
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ['#4f46e5', '#f97316', '#16a34a'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
    },
  };

  const lineChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      type: 'line',
      height: 100, // Minimal height
      width: 100,
    },
    legend: {
      show: false, // Hide legend for minimal look
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
      theme: 'dark',
    },
    xaxis: {
      categories: Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      show: false, // Hide x-axis labels
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false, // Hide y-axis labels
      labels: {
        show: false,
      }
    },
    grid: {
      show: false, // Hide grid
    },
    colors: ['#16a34a', '#4f46e5'], // Green for completed, Indigo for created
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2, // Thinner line
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
  };

  return (
    <div className="mt-3">
      {user && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
            Welcome back, {user.first_name || user.username || 'User'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your personal task overview and progress
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2">
        <div className="col-span-1 lg:col-span-1 2xl:col-span-1">
          <Card extra="!flex-row flex-grow items-center rounded-[20px] p-4">
            <div className="ml-[18px] flex h-[90px] w-auto flex-col justify-center">
              <p className="font-dm text-sm font-medium text-gray-600">Task Status</p>
              <p className="text-[34px] font-bold text-navy-700 dark:text-white">
                {isLoading ? '...' : (tasks || []).length}
              </p>
            </div>
            <div className="h-[120px] w-[120px] mx-auto flex items-center justify-center">
              <PieChart chartData={chartData.pieData} chartOptions={pieChartOptions} />
            </div>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-1 2xl:col-span-1">
          <Card extra="!flex-row flex-grow items-center rounded-[20px] p-4">
            <div className="ml-[18px] flex h-[90px] w-auto flex-col justify-center">
              <p className="font-dm text-sm font-medium text-gray-600">Monthly Progress</p>
              <p className="text-[34px] font-bold text-navy-700 dark:text-white">
                <span className="text-green-500">
                  {isLoading ? '...' : chartData.lineData.completed[chartData.lineData.completed.length - 1]}
                </span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-indigo-500">
                  {isLoading ? '...' : chartData.lineData.created[chartData.lineData.created.length - 1]}
                </span>
              </p>
            </div>
            <div className="h-[120px] w-[120px] mx-auto flex items-center justify-center">
              <LineChart chartData={lineChartData} chartOptions={lineChartOptions} />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 mt-5">
        <Card extra="w-full p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-100 dark:bg-white/5">
                <MdTaskAlt className="h-6 w-6 text-indigo-500 dark:text-white" />
              </div>
              <h4 className="ml-4 text-xl font-bold text-navy-700 dark:text-white">
                My Tasks
              </h4>
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
            </div>
          </div>
          {viewMode === 'table' ? (
            <TaskManagerTable />
          ) : (
            <TaskManagerCards />
          )}
        </Card>
      </div>
    </div>
  );
};

export default TaskManagerPage; 