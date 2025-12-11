import { type ReactNode, useState, useEffect } from "react";
import { AppBar } from "./AppBar";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok, FaFacebookMessenger, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-lg bg-white/95 backdrop-blur-sm">
        <AppBar />
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-200 mt-16">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Liên hệ */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-bold text-xl mb-6 text-white relative inline-block">
                Liên hệ
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 hover:text-blue-400 transition-colors">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-blue-500" />
                  <p>536 Nguyễn Oanh, Quận Gò Vấp, TP. Hồ Chí Minh, Việt Nam</p>
                </div>
                
                <div className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                  <FaPhone className="flex-shrink-0 text-green-500" />
                  <div>
                    <p>(+84 28) 3822 8898</p>
                    <p>(+84 28) 3829 9142</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                  <FaEnvelope className="flex-shrink-0 text-red-500" />
                  <p>ntdinh25@gmail.com</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4">
                <p className="text-xs text-gray-400 mb-3">Kết nối với chúng tôi</p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-full hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                    <FaFacebookF className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-pink-600 to-purple-600 rounded-full hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300">
                    <FaInstagram className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-full hover:scale-110 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300">
                    <FaWhatsapp className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black rounded-full hover:scale-110 hover:shadow-lg hover:shadow-gray-500/50 transition-all duration-300">
                    <FaTiktok className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                    <FaFacebookMessenger className="text-white" />
                  </a>
                </div>
              </div>

              {/* Hotline Button */}
              <button className="mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 group">
                <FaPhone className="group-hover:rotate-12 transition-transform" />
                <div className="text-left">
                  <p className="font-bold text-lg">1800 646 888</p>
                  <p className="text-xs opacity-90">8:00 - 23:00 hàng ngày</p>
                </div>
              </button>
            </div>

            {/* Thông tin */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <h3 className="font-bold text-xl mb-6 text-white relative inline-block">
                Thông tin
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Khảo sát tỷ lệ đạt visa</a></li>
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Tạp chí du lịch</a></li>
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Tin tức</a></li>
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Sitemap</a></li>
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Trợ giúp</a></li>
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Chính sách riêng tư</a></li>
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Thỏa thuận sử dụng</a></li>
                <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">→ Bảo vệ dữ liệu cá nhân</a></li>
              </ul>
            </div>

            {/* Chứng nhận */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <h3 className="font-bold text-xl mb-6 text-white relative inline-block">
                Chứng nhận
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <img src="/image/Giay.jpg" alt="Bộ Công Thương" className="w-full h-auto rounded-lg" />
                </div>
                <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <img src="/image/ch.jpg" alt="DMCA Protected" className="w-full h-auto rounded-lg" />
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <h3 className="font-bold text-xl mb-6 text-white relative inline-block">
                Đăng ký nhận tin
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              <p className="text-sm text-gray-300">
                Nhận thông tin khuyến mãi và tour mới nhất
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 font-semibold">
                  Đăng ký
                </button>
              </div>
              
              <div className="pt-6 space-y-2 text-xs text-gray-400">
                <p>✓ Uy tín 10+ năm kinh nghiệm</p>
                <p>✓ Đảm bảo chất lượng dịch vụ</p>
                <p>✓ Hỗ trợ 24/7</p>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>© 2024 Tour Travel. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-blue-400 transition-colors">Điều khoản dịch vụ</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Chính sách bảo mật</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-50 group"
          title="Về đầu trang"
        >
          <FaArrowUp className="text-xl group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  );
}