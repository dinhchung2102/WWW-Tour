import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tourAPI } from "@/lib/api";
import type { Tour } from "@/types";
import { MapPin, Calendar, Users, ArrowLeft, Tag, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateDiscountedPrice, formatPrice } from "@/lib/utils";

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

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
        setTour(data);
      } catch (error) {
        console.error("Failed to fetch tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  // --- Handle Booking ---
  const handleBookTour = () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        navigate("/login", { state: { from: `/tours/${id}` } });
        return;
      }

      navigate(`/booking/${id}`);
    } catch (e) {
      console.error("Booking error:", e);
    }
  };

  // --- Loading UI ---
  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto text-center">Đang tải...</div>
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
          <Link to="/tours">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {tour.image ? (
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{tour.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-lg">{tour.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Địa điểm</p>
                    <p className="font-medium">{tour.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-medium">{tour.duration} ngày</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số người tối đa
                    </p>
                    <p className="font-medium">
                      {tour.max_participants ?? "Không xác định"} người
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Giá tour</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(calculateDiscountedPrice(tour.price, tour.promotion))}
                    </p>
                    {tour.promotion && calculateDiscountedPrice(tour.price, tour.promotion) < tour.price && (
                      <span className="text-lg line-through text-muted-foreground">
                        {formatPrice(tour.price)}
                      </span>
                    )}
                  </div>
                  {tour.promotion && calculateDiscountedPrice(tour.price, tour.promotion) < tour.price && (
                    <Badge variant="secondary" className="mt-1 flex items-center gap-1 w-fit">
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

              {/* Promotion Info */}
              {tour.promotion && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary mb-1">
                        {tour.promotion.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {tour.promotion.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {tour.promotion.discountPercent && (
                          <Badge variant="outline">
                            <Percent className="h-3 w-3 mr-1" />
                            Giảm {tour.promotion.discountPercent}%
                          </Badge>
                        )}
                        {tour.promotion.discountAmount && (
                          <Badge variant="outline">
                            Giảm {formatPrice(tour.promotion.discountAmount)}
                          </Badge>
                        )}
                        <Badge variant="outline">
                          Mã: {tour.promotion.code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                <p className="font-medium">{formatDate(tour.start_date)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                <p className="font-medium">{formatDate(tour.end_date)}</p>
              </div>

              {/* Book Button */}
              <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto" onClick={handleBookTour}>
                  Đặt tour ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
