import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tourAPI, bookingAPI } from "@/lib/api";
import type { Tour } from "@/types";
import { MapPin, Calendar, Users, ArrowLeft, Loader2 } from "lucide-react";

export function BookingForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const todayYMD = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    number_of_people: 1,
    booking_date: todayYMD,
  });

  // --- Format Price ---
  const formatPrice = (price?: number) => {
    if (!price || isNaN(price)) return "Không có giá";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // --- Safe Date Formatting ---
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Không có dữ liệu";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- Fetch Tour ---
  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;

      try {
        const data = await tourAPI.getTourById(Number(id));
        console.log("✅ Tour loaded:", data);
        setTour(data);
      } catch (error) {
        console.error("❌ Failed to fetch tour:", error);
        setError("Không thể tải thông tin tour");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  // --- Handle Input Change ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log(`✏️ Input changed: ${name} = ${value}`);

    setFormData((prev) => ({
      ...prev,
      [name]: name === "number_of_people" ? Math.max(1, Number(value)) : value,
    }));
  };

  // --- Calculate Total Price ---
  const calculateTotal = () => {
    if (!tour?.price) return 0;
    return tour.price * formData.number_of_people;
  };

  // --- Handle Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    console.log("🚀 SUBMIT BOOKING");

    try {
      // Get user from localStorage
      const userStr = localStorage.getItem("user");
      console.log("📦 LocalStorage user:", userStr);

      if (!userStr) {
        console.warn("⚠️ User not logged in → redirect to login");
        navigate("/login", { state: { from: `/booking/${id}` } });
        return;
      }

      const user = JSON.parse(userStr);
      console.log("👤 Parsed user:", user);

      // Check for user ID (support both 'id' and '_id')
      let userId = user.id || user._id;
      console.log("🆔 Raw User ID:", userId);

      if (!userId) {
        setError(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
        setSubmitting(false);
        return;
      }

      // Convert MongoDB ObjectId string to integer
      // If userId is a string (MongoDB ObjectId), create a hash
      if (typeof userId === "string" && userId.length > 10) {
        // Simple hash function to convert string to integer
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
          const char = userId.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        userId = Math.abs(hash);
        console.log("⚠️ Converted MongoDB ObjectId to integer:", userId);
      } else {
        userId = Number(userId);
      }

      // Validate booking_date
      if (!formData.booking_date) {
        setError("Vui lòng chọn ngày khởi hành");
        setSubmitting(false);
        return;
      }

      // Validate participants
      if (formData.number_of_people < 1) {
        setError("Số lượng người tham gia phải ít nhất là 1");
        setSubmitting(false);
        return;
      }

      if (
        tour?.max_participants &&
        formData.number_of_people > tour.max_participants
      ) {
        setError(
          `Số lượng người tham gia không được vượt quá ${tour.max_participants}`
        );
        setSubmitting(false);
        return;
      }

      // Create booking payload matching backend DTO
      const bookingData = {
        user_id: userId, // Already converted to number
        tour_id: Number(id),
        booking_date: formData.booking_date, // Format: "yyyy-MM-dd"
        status: "PENDING" as const, // Must be PENDING, CONFIRMED, or CANCELLED
        number_of_people: Number(formData.number_of_people),
        total_price: Number(calculateTotal()),
      };

      console.log("📤 Booking payload:", bookingData);

      const response = await bookingAPI.createBooking(bookingData);

      console.log("✅ Booking response:", response);

      alert("Đặt tour thành công! Đang chuyển đến trang thanh toán...");
      const orderId = response.id;

      navigate("/payments", {
        state: {
          orderId,
          amount: bookingData.total_price,
          description: `Thanh toán tour ${tour?.title}`,
        },
      });
    } catch (err: any) {
      console.error("❌ Booking error:", err);
      console.error("🔍 Error response:", err.response?.data);
      console.error("🔍 Error status:", err.response?.status);

      // Extract error message from backend
      let errorMessage = "Có lỗi xảy ra khi đặt tour. Vui lòng thử lại.";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Loading UI ---
  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  // --- Not Found ---
  if (!tour) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-muted-foreground">Không tìm thấy tour</p>
          <Button asChild variant="outline">
            <Link to="/tours">Quay lại danh sách tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back */}
        <Button asChild variant="ghost" className="mb-6">
          <Link to={`/tours/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tour Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tour.image && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg">{tour.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tour.description}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{tour.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">{tour.duration} ngày</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    Tối đa {tour.max_participants ?? "Không xác định"} người
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Giá mỗi người:
                  </span>
                  <span className="font-semibold">
                    {formatPrice(tour.price)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ngày khởi hành</p>
                <p className="text-sm font-medium">
                  {formatDate(tour.start_date)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ngày kết thúc</p>
                <p className="text-sm font-medium">
                  {formatDate(tour.end_date)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đặt tour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="number_of_people">
                    Số lượng người tham gia *
                  </Label>
                  <Input
                    id="number_of_people"
                    name="number_of_people"
                    type="number"
                    min="1"
                    max={tour.max_participants || undefined}
                    value={formData.number_of_people}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Tối đa {tour.max_participants ?? "không giới hạn"} người
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking_date">Ngày khởi hành *</Label>
                  <Input
                    id="booking_date"
                    name="booking_date"
                    type="date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    min={todayYMD}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Chọn ngày bạn muốn bắt đầu tour
                  </p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Giá mỗi người:
                    </span>
                    <span className="text-sm">{formatPrice(tour.price)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Số người:
                    </span>
                    <span className="text-sm">{formData.number_of_people}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận đặt tour"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Bằng cách đặt tour, bạn đồng ý với các điều khoản và điều kiện
                  của chúng tôi
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
