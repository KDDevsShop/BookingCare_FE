import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-6 mt-10 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/public/logo.jpg"
            alt="BookingCare Logo"
            className="h-10 w-10 object-contain rounded-full bg-white border-2 border-white shadow"
          />
          <span className="text-lg font-bold tracking-tight">BookingCare</span>
        </div>

        <div className="text-center md:text-right text-sm opacity-80">
          <p>&copy; 2025 BookingCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
