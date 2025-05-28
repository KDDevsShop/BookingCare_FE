import React from "react";

const AdminDashboard = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Admin Dashboard
      </h1>
      <p className="text-lg text-gray-700 text-center">
        Welcome, Admin! Here you can manage doctors, specialties, and view
        statistics.
      </p>
    </div>
  );
};

export default AdminDashboard;
