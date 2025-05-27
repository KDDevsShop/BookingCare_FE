import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='flex-1 p-6 bg-gray-50 min-h-screen overflow-auto'>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
