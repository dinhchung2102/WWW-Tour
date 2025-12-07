import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/authStore";
import { LogIn, LogOut } from "lucide-react";

export function AppBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, fetchProfile } = useAuthStore();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setLoginOpen(false);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.response?.data || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">TourDuLich</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Giới thiệu
            </Link>
            <Link
              to="/tours"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Tours
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Liên hệ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="flex flex-col gap-2">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <LogIn className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đăng nhập</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
