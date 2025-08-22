import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";

const lineChartDataTotalSpent = [
  {
    name: 'email',
    data: [50, 64, 48, 66, 49, 68],
    color: '#22c55e',
  },
  {
    name: 'call',
    data: [40, 52, 36, 36, 60, 48],
    color: '#ef4444',
  },
  {
    name: 'massage',
    data: [30, 40, 24, 46, 20, 46],
    color: '#3b82f6',
  },
];

const lineChartOptionsTotalSpent = {
  legend: {
    show: false,
  },

  theme: {
    mode: 'light',
  },
  chart: {
    type: 'line',

    toolbar: {
      show: false,
    },
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },

  tooltip: {
    style: {
      fontSize: '12px',
      fontFamily: undefined,
      backgroundColor: '#000000',
    },
    theme: 'dark',
    x: {
      format: 'dd/MM/yy HH:mm',
    },
  },
  grid: {
    show: false,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: '#A3AED0',
        fontSize: '12px',
        fontWeight: '500',
      },
    },
    type: 'text',
    range: undefined,
    categories: ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'],
  },

  yaxis: {
    show: false,
  },
}

const TotalInteractions = () => {
  return (
    <Card extra="!p-[20px] text-center h-full">

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div>
          <p className="text-sm text-gray-600 text-nowrap mt-2 mb-1">Total Interactions</p>
          <p className="text-3xl font-bold text-start text-navy-700 dark:text-white mb-3">
            1.378
          </p>
          <span className="flex gap-x-2 items-center ml-3">
            <div className="size-2 bg-green-500 rounded-full"></div>
            email
          </span>
          <span className="flex gap-x-2 items-center ml-3">
            <div className="size-2 bg-red-500 rounded-full"></div>
            call
          </span>
          <span className="flex gap-x-2 items-center ml-3">
            <div className="size-2 bg-blue-500 rounded-full"></div>
            massage
          </span>
        </div>
        <div className="h-full w-full">
          <LineChart
            chartOptions={lineChartOptionsTotalSpent}
            chartData={lineChartDataTotalSpent}
          />
        </div>
      </div>
    </Card>
  );
};

export default TotalInteractions;
