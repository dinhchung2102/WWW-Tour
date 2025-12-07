import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bookingAPI } from "@/lib/api";
import type { Booking } from "@/types";

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
      const data = await bookingAPI.getAllBookings();
      setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-500">Đã xác nhận</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Booking</h1>
        <p className="text-muted-foreground">
          Quản lý đơn đặt tour của khách hàng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Booking ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có booking nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[100px]">Tour ID</TableHead>
                  <TableHead className="w-[100px]">User ID</TableHead>
                  <TableHead className="w-[120px]">Trạng thái</TableHead>
                  <TableHead className="w-[150px]">Ngày đặt</TableHead>
                  <TableHead className="w-[100px]">Số người</TableHead>
                  <TableHead className="w-[150px]">Tổng tiền</TableHead>
                  <TableHead className="w-[150px]">Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>{booking.tour_id}</TableCell>
                    <TableCell>{booking.user_id}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      {new Date(booking.booking_date).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>{booking.number_of_people} người</TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatPrice(booking.total_price)}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
