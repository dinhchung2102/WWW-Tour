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
import { motion } from "framer-motion";
import introVideo from "@/assets/videos/Download.mp4";

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
          className="w-full h-auto"
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full overflow-hidden group">
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

      {/* News Section – Tin tức du lịch */}
      <section className="py-10 md:py-14 bg-muted/40 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Tin tức du lịch mới nhất
            </h2>
            <div className="w-24 h-1 bg-primary/70 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Top 10 điểm đến hot nhất 2025 bạn không thể bỏ lỡ",
                img: "/image/BinhDinh.jpg",
                link: "https://mia.vn/cam-nang-du-lich/dia-diem-du-lich-viet-nam-16165",
              },
              {
                title: "Kinh nghiệm săn vé máy bay giá rẻ đi Châu Á",
                img: "/image/DaLat_3.jpg",
                link: "https://www.bestprice.vn/blog/san-ve-may-bay-2/cach-san-ve-may-bay-gia-re_19-1440.html",
              },
              {
                title: "5 tips tránh lừa đảo khi đặt tour online",
                img: "/image/DaNang.png",
                link: "https://www.luavietours.com/tin-tuc/cac-thu-doan-lua-dao-khi-dat-tour-du-lich-online/",
              },
            ].map((news, index) => (
              <a
                key={index}
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={news.img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                    {news.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Nhấn để xem chi tiết bài viết…
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-primary/5 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
            Khám phá thêm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
              <h3 className="font-bold text-lg mb-3">Video giới thiệu</h3>
              <div className="aspect-video rounded-lg overflow-hidden shadow">
                <video
                  src={introVideo}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Ưu đãi & khuyến mãi */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 230 }}
              className="bg-gradient-to-br from-pink-500/10 via-red-500/10 to-orange-500/10 
              p-6 rounded-2xl shadow-md hover:shadow-xl 
              backdrop-blur-sm border border-white/30 cursor-pointer
              relative overflow-hidden group"
            >
              {/* Hiệu ứng ánh sáng chạy */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  animate-[shine_2s_linear_infinite] pointer-events-none"
              />

              <h3 className="font-bold text-xl mb-3 text-red-600 flex items-center gap-2">
                🔥 Ưu đãi hot
              </h3>

              <ul className="text-left space-y-2 text-gray-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✨</span>
                  Giảm <b>30%</b> tour Thái Lan 5N4Đ – Chỉ tháng này!
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">💎</span>
                  Combo Singapore 4N3Đ tặng vé Universal Studios
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">🌈</span>
                  Tour Đà Lạt 2N1Đ chỉ <b>1.290.000đ</b>
                </li>
              </ul>
            </motion.div>

            {/* Lý do chọn chúng tôi */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 230 }}
              className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10
              p-6 rounded-2xl shadow-md hover:shadow-xl 
              backdrop-blur-sm border border-white/30 cursor-pointer
              relative overflow-hidden group"
            >
              {/* Hiệu ứng ánh sáng chạy */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  animate-[shine_2s_linear_infinite] pointer-events-none"
              />

              <h3 className="font-bold text-xl mb-3 text-blue-600 flex items-center gap-2">
                ⭐ Vì sao chọn chúng tôi?
              </h3>

              <ul className="text-left space-y-2 text-gray-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">💼</span>
                  Hơn <b>10 năm</b> kinh nghiệm
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">🌍</span>
                  100,000+ khách hàng hài lòng
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">📞</span>
                  Chăm sóc khách hàng <b>24/7</b>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">💰</span>
                  Giá cả minh bạch, không phát sinh
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
