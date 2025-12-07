import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TourCard } from "@/components/tour/tour-card";
import { tourAPI } from "@/lib/api";
import type { Tour } from "@/types";
import banner1 from "@/assets/banner/banner1.jpg";
import banner2 from "@/assets/banner/banner2.png";
import banner3 from "@/assets/banner/banner3.jpg";
import banner4 from "@/assets/banner/banner4.jpg";

export function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [domesticTours, setDomesticTours] = useState<Tour[]>([]);
  const [internationalTours, setInternationalTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  const banners = [banner1, banner2, banner3, banner4];

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourAPI.getAllTours();
        setTours(data.slice(0, 6));

        // Temporary: Split tours into domestic and international
        // TODO: Update when API has location type field
        const allTours = data;
        const midPoint = Math.ceil(allTours.length / 2);
        setDomesticTours(allTours.slice(0, midPoint).slice(0, 6));
        setInternationalTours(allTours.slice(midPoint).slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Auto play carousel
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div>
      {/* Banner Carousel */}
      <section className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-[500px] md:h-[600px]">
                  <img
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Featured Tours */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 uppercase">Tours nổi bật</h2>
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
                <TourCard key={tour.id_tour} tour={tour} />
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

      {/* Domestic Tours */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 uppercase">
              Tour trong nước
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : domesticTours.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có tour trong nước
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domesticTours.map((tour) => (
                <TourCard key={tour.id_tour} tour={tour} />
              ))}
            </div>
          )}

          {domesticTours.length > 0 && (
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/tours">Xem tất cả tour trong nước</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* International Tours */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 uppercase">
              Tour nước ngoài
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : internationalTours.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có tour nước ngoài
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internationalTours.map((tour) => (
                <TourCard key={tour.id_tour} tour={tour} />
              ))}
            </div>
          )}

          {internationalTours.length > 0 && (
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/tours">Xem tất cả tour nước ngoài</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
