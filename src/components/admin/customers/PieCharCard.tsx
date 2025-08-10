import PieChart from 'components/charts/PieChart';
import Card from 'components/card';

const pieChartOptions = {
  labels: ['Active', 'Passive'],
  colors: ['#22c55e', '#ef4444'],
  chart: {
    width: '50px',
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
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ['#22c55e', '#ef4444'],
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
  },
}

const PieChartCard = ({data}) => {
  if(!data) return
  const openTasks = data.filter(task => task.activity_level === 'active').length;
  const inProgressTasks = data.filter(task => task.activity_level === 'passive').length;

  const pieChartData = [openTasks, inProgressTasks];
  
  return (
    <Card extra="rounded-[20px] p-3">
      <h4 className="text-lg font-bold text-navy-700 dark:text-white mt-2">
            Customers
          </h4>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        <PieChart chartOptions={pieChartOptions} chartData={pieChartData} />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">Active</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
            {(pieChartData[0]/(pieChartData[0]+ pieChartData[1]))* 100}%
          </p>
        </div>

        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">Passive</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {(pieChartData[1]/(pieChartData[0]+ pieChartData[1]))* 100}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
