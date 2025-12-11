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
        const allTours = Array.isArray(data) ? data : [];
        setTours(allTours.slice(0, 6));

        // Temporary: Split tours into domestic and international
        // TODO: Update when API has location type field
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
    <div className="overflow-hidden">
      {/* Banner Carousel - Compact Version */}
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
                <div className="relative w-full h-[300px] md:h-[300px] lg:h-[250px] overflow-hidden group">
                  <img
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground" />
          <CarouselNext className="right-2 md:right-4 h-8 w-8 md:h-10 md:w-10 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground" />
        </Carousel>
      </section>

      {/* Featured Tours - Compact */}
      <section className="py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-500">
              Tours nổi bật
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-in fade-in zoom-in-50 duration-700 delay-150" />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground animate-in fade-in duration-500">
              Chưa có tour nào
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {tours.map((tour, index) => (
                <div
                  key={tour.id_tour}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="scale-90 md:scale-95">
                    <TourCard tour={tour} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tours.length > 0 && (
            <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <Button 
                asChild 
                variant="outline" 
                size="default"
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/tours">Xem tất cả tours</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Domestic Tours - Compact */}
      <section className="py-8 md:py-12 bg-muted/30 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-500">
              Tour trong nước
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-in fade-in zoom-in-50 duration-700 delay-150" />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            </div>
          ) : domesticTours.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground animate-in fade-in duration-500">
              Chưa có tour trong nước
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {domesticTours.map((tour, index) => (
                <div
                  key={tour.id_tour}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="scale-90 md:scale-95">
                    <TourCard tour={tour} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {domesticTours.length > 0 && (
            <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <Button 
                asChild 
                variant="outline" 
                size="default"
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/tours">Xem tất cả tour trong nước</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* International Tours - Compact */}
      <section className="py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-500">
              Tour nước ngoài
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-in fade-in zoom-in-50 duration-700 delay-150" />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
            </div>
          ) : internationalTours.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground animate-in fade-in duration-500">
              Chưa có tour nước ngoài
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {internationalTours.map((tour, index) => (
                <div
                  key={tour.id_tour}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="scale-90 md:scale-95">
                    <TourCard tour={tour} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {internationalTours.length > 0 && (
            <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <Button 
                asChild 
                variant="outline" 
                size="default"
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/tours">Xem tất cả tour nước ngoài</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}