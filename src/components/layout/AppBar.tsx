import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore, useLoginModalStore } from "@/store/authStore";
import { authAPI } from "@/lib/api";
import {
  showErrorToast,
  showSuccessToast,
  getErrorMessage,
} from "@/lib/error-handler";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

export function AppBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, fetchProfile } = useAuthStore();
  const {
    open: loginOpen,
    setOpen: setLoginOpen,
    redirectAfterLogin,
    setRedirectAfterLogin,
  } = useLoginModalStore();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Profile update dialog state
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerStep, setRegisterStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  // Initialize profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setLoginOpen(false);
      setEmail("");
      setPassword("");
      showSuccessToast("Đăng nhập thành công");

      // Redirect after login if there's a redirect path
      // Use setTimeout to ensure user state is updated before navigation
      if (redirectAfterLogin) {
        setTimeout(() => {
          navigate(redirectAfterLogin);
          setRedirectAfterLogin(undefined);
        }, 100);
      }
    } catch (err) {
      const message = getErrorMessage(err) || "Đăng nhập thất bại";
      setError(message);
      showErrorToast(err, "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);

    try {
      const message = await authAPI.sendOTP({
        ...registerData,
        role: "CUSTOMER",
      });
      setRegisterStep("otp");
      showSuccessToast(message || "OTP đã được gửi đến email của bạn");
    } catch (err) {
      const message = getErrorMessage(err) || "Gửi OTP thất bại";
      setRegisterError(message);
      showErrorToast(err, "Gửi OTP thất bại");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setOtpLoading(true);

    try {
      await authAPI.verifyOTP(registerData.email, otp);
      handleCloseRegister(false);
      setLoginOpen(true);
      showSuccessToast("Đăng ký thành công! Vui lòng đăng nhập");
    } catch (err) {
      const message = getErrorMessage(err) || "Xác thực OTP thất bại";
      setRegisterError(message);
      showErrorToast(err, "Xác thực OTP thất bại");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleBackToForm = () => {
    setRegisterStep("form");
    setOtp("");
    setRegisterError("");
  };

  const handleCloseRegister = (open: boolean) => {
    setRegisterOpen(open);
    if (!open) {
      // Reset all register states when closing
      setRegisterStep("form");
      setOtp("");
      setRegisterError("");
      setRegisterData({ name: "", email: "", password: "", phone: "" });
    }
  };

  const handleOpenProfile = () => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone,
      });
    }
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setProfileError("");
    setActiveTab("info");
    setProfileOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileLoading(true);

    try {
      await authAPI.updateProfile(profileData);
      await fetchProfile();
      showSuccessToast("Cập nhật thông tin thành công!");
      setProfileOpen(false);
    } catch (err) {
      const message = getErrorMessage(err) || "Cập nhật thông tin thất bại";
      setProfileError(message);
      showErrorToast(err, "Cập nhật thông tin thất bại");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setProfileError("Mật khẩu mới không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setProfileError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setProfileLoading(true);

    try {
      await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      showSuccessToast("Đổi mật khẩu thành công!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfileOpen(false);
    } catch (err) {
      const message = getErrorMessage(err) || "Đổi mật khẩu thất bại";
      setProfileError(message);
      showErrorToast(err, "Đổi mật khẩu thất bại");
    } finally {
      setProfileLoading(false);
    }
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
      <div className="container mx-auto px-4 py-2">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">TourDuLich</span>
          </Link>

          <nav className="hidden md:flex items-center gap-20">
            <Link
              to="/"
              className="font-medium transition-colors hover:text-primary uppercase"
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className="font-medium transition-colors hover:text-primary uppercase"
            >
              Giới thiệu
            </Link>
            <Link
              to="/tours"
              className="font-medium transition-colors hover:text-primary uppercase"
            >
              Tours
            </Link>
            <Link
              to="/news"
              className="font-medium transition-colors hover:text-primary uppercase"
            >
              Tin tức
            </Link>
            <Link
              to="/contact"
              className="font-medium transition-colors hover:text-primary uppercase"
            >
              Liên hệ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
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
                        onClick={handleOpenProfile}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Thông tin cá nhân
                      </Button>
                      {user.role === "ADMIN" && (
                        <Button
                          variant="ghost"
                          className="justify-start"
                          asChild
                        >
                          <Link to="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            Quản lý
                          </Link>
                        </Button>
                      )}
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

                {/* Profile Update Dialog */}
                <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                  <DialogContent className="max-w-md">
                    <DialogTitle>Cập nhật thông tin</DialogTitle>
                    <DialogDescription className="sr-only">
                      Cập nhật thông tin cá nhân hoặc đổi mật khẩu
                    </DialogDescription>

                    <div className="flex gap-2 border-b">
                      <Button
                        variant={activeTab === "info" ? "default" : "ghost"}
                        onClick={() => setActiveTab("info")}
                        className="flex-1"
                      >
                        Thông tin
                      </Button>
                      <Button
                        variant={activeTab === "password" ? "default" : "ghost"}
                        onClick={() => setActiveTab("password")}
                        className="flex-1"
                      >
                        Đổi mật khẩu
                      </Button>
                    </div>

                    {profileError && (
                      <p className="text-sm text-destructive">{profileError}</p>
                    )}

                    {activeTab === "info" ? (
                      <form
                        onSubmit={handleUpdateProfile}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="profile-name">Họ và tên</Label>
                          <Input
                            id="profile-name"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profile-phone">Số điện thoại</Label>
                          <Input
                            id="profile-phone"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={user?.email} disabled />
                          <p className="text-xs text-muted-foreground">
                            Email không thể thay đổi
                          </p>
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={profileLoading}
                        >
                          {profileLoading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                      </form>
                    ) : (
                      <form
                        onSubmit={handleChangePassword}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="old-password">Mật khẩu cũ</Label>
                          <Input
                            id="old-password"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                oldPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Mật khẩu mới</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Xác nhận mật khẩu mới
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                            minLength={6}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={profileLoading}
                        >
                          {profileLoading ? "Đang đổi..." : "Đổi mật khẩu"}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <>
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button>Đăng nhập</Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 w-[400px]">
                    <DialogTitle className="sr-only">
                      Đăng nhập tài khoản
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Nhập email và mật khẩu để đăng nhập
                    </DialogDescription>
                    <Card className="w-full border-0 shadow-none ">
                      <CardHeader>
                        <CardTitle>Đăng nhập tài khoản</CardTitle>
                        <CardDescription>
                          Nhập email và mật khẩu để đăng nhập
                        </CardDescription>
                        <CardAction>
                          <Button
                            variant="link"
                            onClick={(e) => {
                              e.preventDefault();
                              setLoginOpen(false);
                              setRegisterOpen(true);
                            }}
                          >
                            Đăng ký
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleLogin} id="login-form">
                          <div className="flex flex-col gap-6">
                            {error && (
                              <p className="text-sm text-destructive">
                                {error}
                              </p>
                            )}
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <div className="flex items-center">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <a
                                  href="#"
                                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  Quên mật khẩu?
                                </a>
                              </div>
                              <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="flex-col gap-2">
                        <Button
                          type="submit"
                          form="login-form"
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            window.location.href = `${
                              import.meta.env.VITE_API_URL ||
                              "http://localhost:8080"
                            }/customer/auth/login/google`;
                          }}
                        >
                          <svg
                            className="mr-2 h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Đăng nhập với Google
                        </Button>
                      </CardFooter>
                    </Card>
                  </DialogContent>
                </Dialog>

                {/* Register Dialog */}
                <Dialog open={registerOpen} onOpenChange={handleCloseRegister}>
                  <DialogContent className="p-0 sm:max-w-sm">
                    <DialogTitle className="sr-only">
                      Đăng ký tài khoản
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Tạo tài khoản mới để bắt đầu trải nghiệm
                    </DialogDescription>
                    <Card className="w-full border-0 shadow-none">
                      <CardHeader>
                        <CardTitle>
                          {registerStep === "form"
                            ? "Đăng ký tài khoản"
                            : "Xác thực OTP"}
                        </CardTitle>
                        <CardDescription>
                          {registerStep === "form"
                            ? "Tạo tài khoản mới để bắt đầu trải nghiệm"
                            : `Nhập mã OTP đã được gửi đến ${registerData.email}`}
                        </CardDescription>
                        <CardAction>
                          <Button
                            variant="link"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCloseRegister(false);
                              setLoginOpen(true);
                            }}
                          >
                            Đăng nhập
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        {registerStep === "form" ? (
                          <form onSubmit={handleSendOTP} id="register-form">
                            <div className="flex flex-col gap-6">
                              {registerError && (
                                <p className="text-sm text-destructive">
                                  {registerError}
                                </p>
                              )}
                              <div className="grid gap-2">
                                <Label htmlFor="register-name">Họ và tên</Label>
                                <Input
                                  id="register-name"
                                  value={registerData.name}
                                  onChange={(e) =>
                                    setRegisterData({
                                      ...registerData,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                  id="register-email"
                                  type="email"
                                  placeholder="m@example.com"
                                  value={registerData.email}
                                  onChange={(e) =>
                                    setRegisterData({
                                      ...registerData,
                                      email: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="register-phone">
                                  Số điện thoại
                                </Label>
                                <Input
                                  id="register-phone"
                                  type="tel"
                                  value={registerData.phone}
                                  onChange={(e) =>
                                    setRegisterData({
                                      ...registerData,
                                      phone: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="register-password">
                                  Mật khẩu
                                </Label>
                                <Input
                                  id="register-password"
                                  type="password"
                                  value={registerData.password}
                                  onChange={(e) =>
                                    setRegisterData({
                                      ...registerData,
                                      password: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </form>
                        ) : (
                          <form onSubmit={handleVerifyOTP} id="otp-form">
                            <div className="flex flex-col gap-6">
                              {registerError && (
                                <p className="text-sm text-destructive">
                                  {registerError}
                                </p>
                              )}
                              <div className="grid gap-2">
                                <Label htmlFor="otp">Mã OTP</Label>
                                <Input
                                  id="otp"
                                  type="text"
                                  placeholder="Nhập mã OTP 6 số"
                                  value={otp}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    if (value.length <= 6) {
                                      setOtp(value);
                                    }
                                  }}
                                  maxLength={6}
                                  required
                                  className="text-center text-2xl tracking-widest"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Mã OTP đã được gửi đến email của bạn. Vui lòng
                                  kiểm tra hộp thư.
                                </p>
                              </div>
                            </div>
                          </form>
                        )}
                      </CardContent>
                      <CardFooter className="flex-col gap-2">
                        {registerStep === "form" ? (
                          <>
                            <Button
                              type="submit"
                              form="register-form"
                              className="w-full"
                              disabled={registerLoading}
                            >
                              {registerLoading
                                ? "Đang gửi OTP..."
                                : "Gửi mã OTP"}
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                window.location.href = `${
                                  import.meta.env.VITE_API_URL ||
                                  "http://localhost:8080"
                                }/customer/auth/login/google`;
                              }}
                            >
                              <svg
                                className="mr-2 h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  fill="#4285F4"
                                />
                                <path
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                  fill="#34A853"
                                />
                                <path
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                  fill="#FBBC05"
                                />
                                <path
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                  fill="#EA4335"
                                />
                              </svg>
                              Đăng ký với Google
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="submit"
                              form="otp-form"
                              className="w-full"
                              disabled={otpLoading}
                            >
                              {otpLoading ? "Đang xác thực..." : "Xác thực OTP"}
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={handleBackToForm}
                              disabled={otpLoading}
                            >
                              Quay lại
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
