import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tourAPI } from "@/lib/api";
import type { Tour } from "@/types";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";

export function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourAPI.getAllTours();
        setTours(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Khám phá Việt Nam cùng chúng tôi
            </h1>
            <p className="text-lg text-muted-foreground">
              Trải nghiệm những chuyến du lịch tuyệt vời với dịch vụ chuyên
              nghiệp và giá cả hợp lý
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/tours">Xem tất cả tours</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tours nổi bật</h2>
            <p className="text-muted-foreground">
              Những tour được yêu thích nhất
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : tours.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có tour nào
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <Card key={tour.id_tour} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {tour.image ? (
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{tour.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{tour.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{tour.duration} ngày</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Tối đa {tour.max_participants} người</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(tour.price)}
                      </span>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/tours/${tour.id_tour}`}>
                          Chi tiết
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tours.length > 0 && (
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/tours">Xem tất cả tours</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Dịch vụ chuyên nghiệp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Đội ngũ hướng dẫn viên giàu kinh nghiệm và dịch vụ chăm sóc
                  khách hàng tận tâm
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Giá cả hợp lý</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nhiều tour với mức giá phù hợp, đảm bảo chất lượng và trải
                  nghiệm tốt nhất
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Đặt tour dễ dàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quy trình đặt tour đơn giản, thanh toán nhanh chóng và an toàn
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
