function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-500 text-white py-8 mt-10 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/public/logo.jpg"
            alt="BookingCare Logo"
            className="h-12 w-12 object-contain rounded-full bg-white border-2 border-white shadow"
          />
          <span className="text-2xl font-extrabold tracking-tight drop-shadow">
            BookingCare
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col md:flex-row gap-4 text-sm text-blue-100">
          <a href="/" className="hover:text-white transition">
            Trang chủ
          </a>
          <a href="/about" className="hover:text-white transition">
            Giới thiệu
          </a>
          <a href="/contact" className="hover:text-white transition">
            Liên hệ
          </a>
          <a href="/terms" className="hover:text-white transition">
            Điều khoản
          </a>
        </div>

        {/* Contact & Social */}
        <div className="flex flex-col items-center md:items-end gap-2 text-sm">
          <div>
            <span className="font-semibold">Hotline:</span>{' '}
            <a href="tel:19001234" className="hover:underline">
              1900 1234
            </a>
          </div>
          <div>
            <span className="font-semibold">Email:</span>{' '}
            <a href="mailto:support@bookingcare.vn" className="hover:underline">
              support@bookingcare.vn
            </a>
          </div>
          <div className="flex gap-3 mt-1">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5 fill-blue-200 hover:fill-white transition"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
              </svg>
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zalo"
            >
              <svg
                className="w-5 h-5 fill-blue-200 hover:fill-white transition"
                viewBox="0 0 32 32"
              >
                <circle cx="16" cy="16" r="16" />
                <text
                  x="16"
                  y="21"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fff"
                  fontFamily="Arial"
                >
                  Zalo
                </text>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-blue-300 mt-6 pt-4 text-center text-xs text-blue-100 opacity-80">
        &copy; 2025 BookingCare. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
