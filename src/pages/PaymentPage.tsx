import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ navigate("/payments", {state: {...}})
  const { orderId, amount, description } = location.state || {};

  const [loading, setLoading] = useState(false);

  if (!orderId || !amount) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Thiếu thông tin thanh toán</p>
      </div>
    );
  }

  const handlePayment = async (paymentMethod: "MOMO" | "VNPAY" | "COD") => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments`,
        {
          orderId,
          amount,
          paymentMethod,
          customerEmail: "customer@example.com",
          description,
          returnUrl: `${import.meta.env.VITE_FRONTEND_URL}/payment/result`,
        }
      );

      const data = response.data;
      console.log("PAYMENT RESPONSE:", data);

      if (data.paymentUrl) {
        // Redirect to payment gateway (VNPay/Momo)
        // Gateway will redirect back to /payment/result after payment
        window.location.href = data.paymentUrl;
      } else {
        // COD payment - navigate to PaymentResultPage with success
        navigate("/payment/result", {
          state: {
            success: true,
            message: "Thanh toán COD thành công!",
            orderId: orderId.toString(),
            amount: amount,
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Không thể tạo thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Thanh toán đơn hàng</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p>
              <strong>Mã đơn hàng:</strong> {orderId}
            </p>
            <p>
              <strong>Số tiền:</strong> {amount.toLocaleString("vi-VN")} VND
            </p>

            <div className="space-y-3">
              <Button
                className="w-full"
                disabled={loading}
                onClick={() => handlePayment("VNPAY")}
              >
                Thanh toán qua VNPay
              </Button>

              <Button
                className="w-full"
                disabled={loading}
                onClick={() => handlePayment("MOMO")}
                variant="secondary"
              >
                Thanh toán qua Momo
              </Button>

              <Button
                className="w-full"
                disabled={loading}
                onClick={() => handlePayment("COD")}
                variant="outline"
              >
                Thanh toán khi nhận tour (COD)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
