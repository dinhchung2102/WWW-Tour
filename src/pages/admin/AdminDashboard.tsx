import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tourAPI, bookingAPI } from "@/lib/api";
import type { Tour, Booking } from "@/types";
import { Package, Users, Calendar, TrendingUp } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tours, bookings] = await Promise.all([
          tourAPI.getAllTours(),
          bookingAPI.getAllBookings(),
        ]);

        const pendingBookings = bookings.filter(
          (b) => b.status === "PENDING"
        ).length;
        const totalRevenue = bookings
          .filter((b) => b.status === "CONFIRMED")
          .reduce((sum, b) => sum + b.total_price, 0);

        setStats({
          totalTours: tours.length,
          totalBookings: bookings.length,
          pendingBookings,
          totalRevenue,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan về hệ thống quản lý tour
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Tour</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTours}</div>
            <p className="text-xs text-muted-foreground">Tour đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng đặt tour</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Tất cả booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Booking đang chờ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Từ booking đã xác nhận</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

