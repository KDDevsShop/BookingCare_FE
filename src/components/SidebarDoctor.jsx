import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  BriefcaseMedical,
  CalendarRange,
} from 'lucide-react';
import DoctorBookingsPage from '../pages/booking/DoctorBookingsPage';

const SidebarDoctor = () => {
  const location = useLocation();
  const navigrate = useNavigate();
  const user = JSON.parse(localStorage.getItem('account')) || {};

  const navItems = [
    {
      label: 'Hồ sơ cá nhân',
      icon: <LayoutDashboard size={18} />,
      path: '/doctor/profile',
    },
    {
      label: 'Quản lý lịch khám',
      icon: <BriefcaseMedical size={18} />,
      path: '/doctor/bookings',
    },
    {
      label: 'Quản lý lịch làm',
      icon: <CalendarRange size={18} />,
      path: `/doctor/work-schedule/${user?.id || '0'}`,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('account');
    navigrate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-indigo-600">Doctor Panel</h2>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
              location.pathname === item.path
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-gray-100 flex justify-center items-center gap-6">
        <img
          src={`${
            user?.userAvatar
              ? `http://localhost:5000${user?.userAvatar}`
              : './DoctorLogin.png'
          }`}
          alt="Avt"
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
        />
        <div>
          <h2 className="text-sm line-clamp-1">{user?.doctor?.doctorName}</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm mx-auto mt-2 text-gray-500 cursor-pointer hover:text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarDoctor;
