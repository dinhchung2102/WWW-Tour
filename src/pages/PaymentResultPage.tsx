import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { bookingAPI, tourAPI } from "@/lib/api";
import type { Booking, Tour } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    orderId?: string;
    amount?: number;
    transactionId?: string;
  } | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [bookingDetail, setBookingDetail] = useState<Booking | null>(null);
  const [tourDetail, setTourDetail] = useState<Tour | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Check if result is passed from state (e.g., COD payment)
        if (location.state) {
          const stateResult = location.state as {
            success: boolean;
            message: string;
            orderId?: string;
            amount?: number;
          };
          setResult({
            success: stateResult.success,
            message: stateResult.message || "Thanh toán thành công!",
            orderId: stateResult.orderId,
            amount: stateResult.amount,
          });
          setLoading(false);
          return;
        }

        // Get VNPay params from URL
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const vnp_TxnRef = searchParams.get("vnp_TxnRef");
        const vnp_Amount = searchParams.get("vnp_Amount");
        const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");

        console.log("VNPay callback params:", {
          vnp_ResponseCode,
          vnp_TxnRef,
          vnp_Amount,
          vnp_TransactionNo,
        });

        if (!vnp_ResponseCode || !vnp_TxnRef) {
          setResult({
            success: false,
            message: "Thiếu thông tin thanh toán",
          });
          setLoading(false);
          return;
        }

        // Check response code
        if (vnp_ResponseCode === "00") {
          setResult({
            success: true,
            message: "Thanh toán thành công!",
            orderId: vnp_TxnRef,
            amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : undefined,
            transactionId: vnp_TransactionNo || undefined,
          });
        } else {
          const errorMessages: Record<string, string> = {
            "07": "Giao dịch bị nghi ngờ gian lận",
            "09": "Thẻ chưa đăng ký dịch vụ Internet Banking",
            "10": "Xác thực thông tin thẻ không chính xác quá 3 lần",
            "11": "Đã hết hạn chờ thanh toán",
            "12": "Thẻ bị khóa",
            "13": "Sai mật khẩu xác thực giao dịch",
            "24": "Giao dịch bị hủy",
            "51": "Tài khoản không đủ số dư",
            "65": "Tài khoản đã vượt quá hạn mức giao dịch trong ngày",
            "75": "Ngân hàng thanh toán đang bảo trì",
            "79": "Nhập sai mật khẩu quá số lần quy định",
          };

          setResult({
            success: false,
            message: errorMessages[vnp_ResponseCode] || "Thanh toán thất bại",
            orderId: vnp_TxnRef,
          });
        }
      } catch (error) {
        console.error("Error processing payment result:", error);
        setResult({
          success: false,
          message: "Có lỗi xảy ra khi xử lý kết quả thanh toán",
        });
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [searchParams, navigate, location.state]);

  const handleViewDetail = async () => {
    if (!result?.orderId) return;

    setIsDetailDialogOpen(true);
    setLoadingDetail(true);

    try {
      const bookingId = parseInt(result.orderId);
      const booking = await bookingAPI.getBookingById(bookingId);
      setBookingDetail(booking);

      // Fetch tour details
      if (booking.tour_id) {
        try {
          const tour = await tourAPI.getTourById(booking.tour_id);
          setTourDetail(tour);
        } catch (error) {
          console.error("Failed to fetch tour:", error);
        }
      }
    } catch (error) {
      console.error("Failed to fetch booking:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PENDING":
        return "Chờ xử lý";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-600 text-center text-2xl">
            Kết quả thanh toán
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-center">
            {result?.success ? (
              <CheckCircle className="h-20 w-20 text-green-600" />
            ) : (
              <XCircle className="h-20 w-20 text-red-600" />
            )}
          </div>

          <div className="text-center">
            <h3
              className={`text-xl font-bold mb-2 ${
                result?.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {result?.message}
            </h3>
          </div>

          {result?.orderId && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold">{result.orderId}</span>
              </div>

              {result.amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold">
                    {result.amount.toLocaleString("vi-VN")} VND
                  </span>
                </div>
              )}

              {result.transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-semibold text-xs">
                    {result.transactionId}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {result?.success ? (
              <>
                <Button className="w-full" onClick={handleViewDetail}>
                  Xem chi tiết
                </Button>
                <Button
                  className="w-full hidden"
                  variant="outline"
                  onClick={() => navigate("/my-bookings")}
                >
                  Xem đơn đặt tour của tôi
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Về trang chủ
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" onClick={() => navigate(-2)}>
                  Thử lại
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Về trang chủ
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đặt tour</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : bookingDetail ? (
            <div className="space-y-4">
              {/* Booking Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg mb-3">
                  Thông tin đặt tour
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <p className="font-semibold">#{bookingDetail.id}</p>
                  </div>

                  <div>
                    <span className="text-gray-600">Trạng thái:</span>
                    <p className="font-semibold">
                      {getStatusText(bookingDetail.status)}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-600">Ngày đặt:</span>
                    <p className="font-semibold">
                      {formatDate(bookingDetail.booking_date)}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-600">Số người:</span>
                    <p className="font-semibold">
                      {bookingDetail.number_of_people} người
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <p className="font-semibold text-lg text-primary">
                      {formatPrice(bookingDetail.total_price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tour Info */}
              {tourDetail && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-lg mb-3">Thông tin tour</h3>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Tên tour:</span>
                      <p className="font-semibold">{tourDetail.title}</p>
                    </div>

                    <div>
                      <span className="text-gray-600">Địa điểm:</span>
                      <p className="font-semibold">{tourDetail.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-600">Thời gian:</span>
                        <p className="font-semibold">
                          {tourDetail.duration} ngày
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Số người tối đa:</span>
                        <p className="font-semibold">
                          {tourDetail.max_participants} người
                        </p>
                      </div>
                    </div>

                    {tourDetail.description && (
                      <div>
                        <span className="text-gray-600">Mô tả:</span>
                        <p className="mt-1">{tourDetail.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy thông tin đặt tour
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
