import { type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Newspaper,
  FolderTree,
  Tag,
  Mail,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
    },
    {
      icon: Package,
      label: "Quản lý Tour",
      path: "/admin/tours",
    },
    {
      icon: Calendar,
      label: "Quản lý Booking",
      path: "/admin/bookings",
    },
    {
      icon: Users,
      label: "Quản lý Khách hàng",
      path: "/admin/customers",
    },
    {
      icon: FileText,
      label: "Quản lý Thông tin",
      path: "/admin/about",
    },
    {
      icon: MessageSquare,
      label: "Quản lý Liên hệ",
      path: "/admin/contacts",
    },
    {
      icon: Newspaper,
      label: "Quản lý Tin tức",
      path: "/admin/news",
    },
    {
      icon: FolderTree,
      label: "Quản lý Danh mục Tin tức",
      path: "/admin/news-categories",
    },
    {
      icon: Tag,
      label: "Quản lý Khuyến mãi",
      path: "/admin/promotions",
    },
    {
      icon: Mail,
      label: "Quản lý Người đăng ký",
      path: "/admin/promotion-subscribers",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-r border-slate-700/50">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-slate-700/50 px-6 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">Quản trị hệ thống</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                  )}
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white group-hover:scale-110"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-slate-700/50" />

          {/* External Link */}
          <button
            onClick={() => window.open("/", "_blank")}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
          >
            <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">Xem website</span>
          </button>
        </nav>

        {/* Footer - User Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="mb-3 px-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "AD"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full " onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
