import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tourAPI } from "@/lib/api";
import type { Tour } from "@/types";
import { MapPin, Calendar, Users, ArrowLeft, Star, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore, useLoginModalStore } from "@/store/authStore";
import { calculateDiscountedPrice, formatPrice } from "@/lib/utils";

// Kiểu dữ liệu review
interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setOpen: setLoginOpen, setRedirectAfterLogin } = useLoginModalStore();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null); // lọc review theo sao

  // Calculate final price with promotion
  const finalPrice = tour
    ? calculateDiscountedPrice(tour.price, tour.promotion)
    : 0;
  const hasPromotion = tour?.promotion && finalPrice < tour.price;

  // --- Format Date ---
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không có dữ liệu";
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "Ngày không hợp lệ"
      : d.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  // -------- FETCH MAIN TOUR --------
  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;
      try {
        const data = await tourAPI.getTourById(Number(id));
        setTour(data);
      } catch (error) {
        console.error("Failed to fetch tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  // -------- FETCH RELATED TOURS (Random 4) --------
  useEffect(() => {
    const fetchRelatedTours = async () => {
      if (!tour) return;
      try {
        const allTours = await tourAPI.getAllTours();
        // Lọc các tour khác location và không phải tour hiện tại
        const related = allTours.filter(
          (t) =>
            (t.id_tour || t.id) !== (tour.id_tour || tour.id) &&
            t.location === tour.location
        );
        // Random 4 tour
        const shuffled = related.sort(() => 0.5 - Math.random());
        setRelatedTours(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related tours:", error);
      }
    };
    fetchRelatedTours();
  }, [tour]);

  // -------- FETCH REVIEWS --------
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewLoading(true);

      const mockReviews: Review[] = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          avatar: "https://i.pravatar.cc/100?img=1",
          rating: 5,
          comment: "Chuyến đi tuyệt vời! Hướng dẫn viên rất nhiệt tình.",
          date: "2024-11-12",
        },
        {
          id: 2,
          name: "Trần Thị B",
          avatar: "https://i.pravatar.cc/100?img=5",
          rating: 4,
          comment: "Địa điểm đẹp, dịch vụ tốt nhưng hơi đông.",
          date: "2024-11-20",
        },
        {
          id: 3,
          name: "Lê Quốc C",
          avatar: "https://i.pravatar.cc/100?img=3",
          rating: 5,
          comment: "Giá hợp lý, trải nghiệm tuyệt vời!",
          date: "2024-12-01",
        },
        {
          id: 4,
          name: "Phạm Thị D",
          avatar: "https://i.pravatar.cc/100?img=8",
          rating: 3,
          comment: "Ổn nhưng dịch vụ cần cải thiện.",
          date: "2024-12-05",
        },
      ];

      setTimeout(() => {
        setReviews(mockReviews);
        setReviewLoading(false);
      }, 900);
    };

    fetchReviews();
  }, []);

  // -------- Booking Handler --------
  const handleBookTour = () => {
    // Validate id exists
    if (!id) {
      console.error("Tour ID is missing");
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Open login modal and set redirect path after login
      setRedirectAfterLogin(`/booking/${id}`);
      setLoginOpen(true);
      return;
    }

    // Navigate to booking form
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="loader">Đang tải...</div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="py-12 text-center">
        <p>Không tìm thấy tour.</p>
        <Button asChild>
          <Link to="/tours">Quay lại</Link>
        </Button>
      </div>
    );
  }

  // Lọc review theo sao
  const filteredReviews = selectedRating
    ? reviews.filter((r) => r.rating === selectedRating)
    : reviews;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        {/* BACK BUTTON */}
        <Button asChild variant="ghost">
          <Link to="/tours">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Link>
        </Button>

        {/* IMAGE */}
        <motion.div
          className="aspect-video rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* INFO CARD */}
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle className="text-3xl">{tour.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{tour.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Địa điểm</p>
                  <p className="font-semibold">{tour.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian</p>
                  <p className="font-semibold">{tour.duration} ngày</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Số người tối đa
                  </p>
                  <p className="font-semibold">{tour.max_participants}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giá tour</p>
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(finalPrice)}
                  </p>
                  {hasPromotion && (
                    <span className="text-lg line-through text-muted-foreground">
                      {formatPrice(tour.price)}
                    </span>
                  )}
                </div>
                {hasPromotion && tour.promotion && (
                  <Badge
                    variant="secondary"
                    className="mt-1 flex items-center gap-1 w-fit"
                  >
                    <Tag className="h-3 w-3" />
                    {tour.promotion.code}
                    {tour.promotion.discountPercent && (
                      <span className="ml-1">
                        -{tour.promotion.discountPercent}%
                      </span>
                    )}
                  </Badge>
                )}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
              <p className="font-medium">{formatDate(tour.start_date)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
              <p className="font-medium">{formatDate(tour.end_date)}</p>
            </div>

            <Button size="lg" className="mt-4" onClick={handleBookTour}>
              Đặt tour ngay
            </Button>
          </CardContent>
        </Card>

        {/* ------------------ REVIEWS ------------------ */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>

          {/* FILTER BY STAR */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">
              Lọc theo sao:
            </span>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border transition 
          ${
            selectedRating === star
              ? "bg-gradient-to-r from-yellow-400 to-yellow-300 border-yellow-400 text-white"
              : "bg-gray-100 border-gray-300 hover:bg-yellow-50"
          }`}
                onClick={() =>
                  setSelectedRating(selectedRating === star ? null : star)
                }
              >
                {star}{" "}
                <Star
                  size={16}
                  fill={selectedRating === star ? "#fff" : "#facc15"}
                />
              </button>
            ))}
          </div>

          {reviewLoading ? (
            <p className="text-center text-muted-foreground mt-4">
              Đang tải đánh giá...
            </p>
          ) : filteredReviews.length === 0 ? (
            <p className="text-muted-foreground mt-2">
              Không có đánh giá phù hợp
            </p>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((r) => (
                <motion.div
                  key={r.id}
                  className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-white shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400">
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">{r.name}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={16} fill="#facc15" />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(r.date)}
                    </p>

                    <p className="mt-2 text-gray-700">{r.comment}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Optional: Review Statistics */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="font-semibold mb-2">Thống kê đánh giá</h3>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percent = reviews.length
                ? (count / reviews.length) * 100
                : 0;
              return (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="w-8 text-sm">
                    {star} <Star size={12} fill="#facc15" />
                  </span>
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------ RELATED TOURS ------------------ */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">Gợi ý dành cho bạn</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {relatedTours.map((t) => (
              <motion.div
                key={t.id_tour || t.id}
                className="rounded-lg overflow-hidden shadow hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
              >
                <Link to={`/tours/${t.id_tour || t.id}`}>
                  <img src={t.image} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{t.title}</p>
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill="#facc15" />
                        ))}
                      </div>
                    </div>
                    <p className="text-primary font-bold mt-1">
                      {formatPrice(t.price)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
