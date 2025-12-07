import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tourAPI } from "@/lib/api";
import type { Tour } from "@/types";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";

export function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Không tìm thấy tour</p>
            <Button asChild variant="outline">
              <Link to="/tours">Quay lại danh sách tours</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/tours">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Tour Image */}
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

          {/* Tour Info */}
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
                    <p className="font-medium">{tour.max_participants} người</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá tour</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(tour.price)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                <p className="font-medium">{formatDate(tour.start_date)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                <p className="font-medium">{formatDate(tour.end_date)}</p>
              </div>

              <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto">
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

