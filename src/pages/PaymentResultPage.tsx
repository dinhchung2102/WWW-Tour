import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    orderId?: string;
    amount?: number;
    transactionId?: string;
  } | null>(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
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

          // ✅ Auto redirect sau 3 giây
          setTimeout(() => {
            navigate("/my-bookings");
          }, 3000);
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
  }, [searchParams, navigate]);

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
        <CardHeader className={result?.success ? "bg-green-600" : "bg-red-600"}>
          <CardTitle className="text-white text-center text-2xl">
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
            <h3 className={`text-xl font-bold mb-2 ${
              result?.success ? "text-green-600" : "text-red-600"
            }`}>
              {result?.message}
            </h3>
            {result?.success && (
              <p className="text-sm text-gray-600 mt-2">
                Đang chuyển đến trang đặt tour của bạn...
              </p>
            )}
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
                <Button
                  className="w-full"
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
                <Button
                  className="w-full"
                  onClick={() => navigate(-2)}
                >
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
    </div>
  );
}