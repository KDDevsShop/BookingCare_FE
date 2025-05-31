import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  ListOrderedIcon,
  CalendarRange,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    path: '/dashboard',
  },
  {
    label: 'Quản lý bác sĩ',
    icon: <Users size={18} />,
    path: '/admin/doctors',
  },
  {
    label: 'Quản lý chuyên khoa',
    icon: <Package size={18} />,
    path: '/admin/specialties',
  },
  {
    label: 'Quản lý  FAQs',
    icon: <Package size={18} />,
    path: '/admin/faqs',
  },
  {
    label: 'Quản lý bệnh nhân',
    icon: <Users size={18} />,
    path: '/admin/patients',
  },
  {
    label: 'Quản lý lịch khám',
    icon: <ListOrderedIcon size={18} />,
    path: '/admin/bookings',
  },
  {
    label: 'Quản lý lịch làm',
    icon: <CalendarRange size={18} />,
    path: `/admin/work-schedule`,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigrate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('account');
    navigrate('/');
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
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
      <div className="mt-auto p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
