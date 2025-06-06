import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RevenueChart = ({ data, timeFilter }) => {
  // Prepare labels and values
  let labels = [];
  let values = [];

  if (timeFilter === 'by-year') {
    // Data by month
    labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
    values = Array(12).fill(0);
    data.forEach((item) => {
      if (item.month >= 1 && item.month <= 12) {
        values[item.month - 1] = item.revenue;
      }
    });
  } else {
    // Data by day
    const maxDay =
      Array.isArray(data) && Math.max(...data.map((d) => d.day), 31);
    labels = Array?.from({ length: maxDay }, (_, i) => `Ngày ${i + 1}`);
    values = Array(maxDay)?.fill(0);
    data.forEach((item) => {
      if (item.day >= 1 && item.day <= maxDay) {
        values[item.day - 1] = item.revenue;
      }
    });
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: values,
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderRadius: 6,
        maxBarThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => context.parsed.y.toLocaleString('vi-VN') + ' VNĐ',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString('vi-VN'),
        },
      },
    },
  };

  const hasData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.some((item) => item.revenue > 0);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-blue-700">
        Biểu đồ doanh thu
      </h3>
      {hasData > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="text-center text-gray-500 my-24">Không có dữ liệu</div>
      )}
    </div>
  );
};

export default RevenueChart;
