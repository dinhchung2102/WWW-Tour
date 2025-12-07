import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tourAPI } from "@/lib/api";
import type { Tour } from "@/types";
import { MapPin, Calendar, Users, Search, ArrowRight } from "lucide-react";

export function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourAPI.getAllTours();
        setTours(data);
        setFilteredTours(data);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTours(tours);
    } else {
      const filtered = tours.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTours(filtered);
    }
  }, [searchTerm, tours]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">Danh sách Tours</h1>
          <p className="text-lg text-muted-foreground">
            Khám phá những điểm đến tuyệt vời
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm tour theo tên, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">
              {searchTerm
                ? "Không tìm thấy tour nào phù hợp"
                : "Chưa có tour nào"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
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
                  <p className="text-sm text-muted-foreground line-clamp-3">
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
      </div>
    </div>
  );
}
