import SidebarDoctor from '../components/SidebarDoctor';

const DoctorLayout = ({ children }) => {
  return (
    <div className="flex">
      <SidebarDoctor />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DoctorLayout;
