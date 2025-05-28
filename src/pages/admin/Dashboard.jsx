import React from 'react';
import Filter from '../../components/admin/Dashboard/Filter';
import CommonStats from '../../components/admin/Dashboard/CommonStats';
import statisticService from '../../services/statistic.service';
import { ToVietnamCurrencyFormat } from '../../utils/ToVietnamCurrencyFormat';
import { CircularProgress } from '@mui/material';
import { MdAttachMoney } from 'react-icons/md';
import { FaUserDoctor, FaClipboardCheck } from 'react-icons/fa6';
import RevenueChart from '../../components/admin/Dashboard/RevenueChart';
import TopStatsSection from '../../components/admin/Dashboard/TopStatsSection';

const Dashboard = () => {
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);

  const [loading, setLoading] = React.useState(true);

  const [timeFilter, setTimeFilter] = React.useState('by-year');
  const [selectedTime, setSelectedTime] = React.useState(currentYear);

  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [totalDoctors, setTotalDoctors] = React.useState(0);
  const [totalCompleteBookings, setTotalCompleteBookings] = React.useState(0);

  const [revenueData, setRevenueData] = React.useState([]);

  const [topDoctors, setTopDoctors] = React.useState([]);
  const [topPatients, setTopPatients] = React.useState([]);
  const [doctors, setDoctors] = React.useState([]);

  const commonStats = React.useMemo(
    () => [
      {
        title: 'Tổng doanh thu',
        value: ToVietnamCurrencyFormat(totalRevenue) || 'N/A',
        icon: <MdAttachMoney size={'2.5rem'} />,
      },
      {
        title: 'Tổng số bác sĩ',
        value: totalDoctors || 'N/A',
        icon: <FaUserDoctor size={'2.5rem'} />,
      },
      {
        title: 'Lượt khám đã hoàn thành',
        value: totalCompleteBookings,
        icon: <FaClipboardCheck size={'2.5rem'} />,
      },
    ],
    [totalRevenue, totalDoctors, totalCompleteBookings]
  );

  // Revenue
  const getRevenue = React.useCallback(async () => {
    const year = timeFilter === 'by-year' ? selectedTime : null;
    const month = timeFilter === 'by-month' ? selectedTime : null;

    const revenue = await statisticService.getRevenueStatistics({
      year,
      month,
    });
    setRevenueData(revenue || []);

    const total = revenue?.reduce((acc, item) => acc + item.revenue, 0) || 0;
    setTotalRevenue(total);
  }, [timeFilter, selectedTime]);

  // Total Doctors
  const getTotalDoctors = React.useCallback(async () => {
    const totalDoctors = await statisticService.getAllDoctors();
    setTotalDoctors(totalDoctors?.total || 0);
  }, []);

  // Completed Bookings
  const getTotalCompleteBookings = React.useCallback(async () => {
    const year = timeFilter === 'by-year' ? selectedTime : null;
    const month = timeFilter === 'by-month' ? selectedTime : null;

    const totalBookings = await statisticService.getTotalCompleteBookings({
      year,
      month,
    });

    setTotalCompleteBookings(totalBookings?.total || 0);
  }, [timeFilter, selectedTime]);

  // Doctor Revenue
  const getDoctorRevenue = React.useCallback(async () => {
    const year = timeFilter === 'by-year' ? selectedTime : null;
    const month = timeFilter === 'by-month' ? selectedTime : null;

    const response = await statisticService.getDoctorRevenueStatistics({
      year,
      month,
      top3: 'true',
    });

    const response2 = await statisticService.getDoctorRevenueStatistics({
      year,
      month,
    });

    if (
      !Array.isArray(response) ||
      response.length === 0 ||
      !response.some((p) => p?.revenue > 0 && p?.totalCompleteBookings > 0)
    ) {
      setTopDoctors([]);

      if (
        !Array.isArray(response2) ||
        response2.length === 0 ||
        !response2.some((p) => p?.revenue > 0 && p?.totalCompleteBookings > 0)
      ) {
        setDoctors([]);
        return;
      }

      return;
    }

    setTopDoctors(response);
    setDoctors(response2);
  }, [timeFilter, selectedTime]);

  // Top Patients
  const getTopPatients = React.useCallback(async () => {
    const year = timeFilter === 'by-year' ? selectedTime : null;
    const month = timeFilter === 'by-month' ? selectedTime : null;

    const response = await statisticService.getTopVipPatients({
      year,
      month,
    });

    if (
      !Array.isArray(response) ||
      response.length === 0 ||
      !response.some((p) => p?.totalAmount > 0)
    ) {
      setTopPatients([]);
      return;
    }

    setTopPatients(response);
  }, [timeFilter, selectedTime]);

  React.useEffect(() => {
    setLoading(true);

    Promise.all([
      getRevenue(),
      getTotalDoctors(),
      getTotalCompleteBookings(),
      getDoctorRevenue(),
      getTopPatients(),
    ])
      .then(() => setLoading(false))
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      });
  }, [
    getRevenue,
    getTotalDoctors,
    getTotalCompleteBookings,
    getDoctorRevenue,
    getTopPatients,
  ]);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-5xl font-bold text-center mb-12 text-blue-600'>
        Chào mừng đến với trang quản lý
      </h1>
      <Filter
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
      {loading ? (
        <div className='flex justify-center items-center py-24'>
          <CircularProgress color='info' size={'5rem'} />
        </div>
      ) : (
        <div className='bg-white p-6 px-4 rounded-lg shadow-md flex flex-col gap-6'>
          <CommonStats stats={commonStats} />
          <RevenueChart data={revenueData} timeFilter={timeFilter} />
          <TopStatsSection
            patients={topPatients}
            topDoctors={topDoctors}
            doctors={doctors}
          />
        </div>
      )}
      <div className='text-center text-sm text-gray-600 mt-16'>
        &copy; 2025 ThuCuc Hospital. All rights reserved.
      </div>
    </div>
  );
};

export default Dashboard;
