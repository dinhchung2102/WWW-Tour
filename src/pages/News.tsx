import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { newsAPI, newsCategoryAPI } from "@/lib/api";
import type { News, NewsCategory, PageResponse } from "@/types";
import {
  Search,
  Calendar,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { showErrorToast } from "@/lib/error-handler";
import banner1 from "@/assets/banner/banner1.jpg";
import banner2 from "@/assets/banner/banner2.png";
import banner3 from "@/assets/banner/banner3.jpg";
import banner4 from "@/assets/banner/banner4.jpg";

export function News() {
  const [newsData, setNewsData] = useState<PageResponse<News> | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [pageSize] = useState(12);
  const [api, setApi] = useState<CarouselApi>();

  const banners = [banner1, banner2, banner3, banner4];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await newsCategoryAPI.getActiveCategories(true);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Search news
  const searchNews = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.searchNews({
        keyword: searchTerm.trim() || undefined,
        categoryId: selectedCategory || undefined,
        active: true,
        page: 0,
        size: pageSize,
      });
      setNewsData(response);
    } catch (error) {
      showErrorToast(error, "Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  // Load data when page changes
  const loadPage = async (page: number) => {
    setLoading(true);
    try {
      const response = await newsAPI.searchNews({
        keyword: searchTerm.trim() || undefined,
        categoryId: selectedCategory || undefined,
        active: true,
        page: page,
        size: pageSize,
      });
      setNewsData(response);
    } catch (error) {
      showErrorToast(error, "Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    searchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    // Trigger search with cleared filters
    setTimeout(() => {
      searchNews();
    }, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-hidden">
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

      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl font-bold">Tin tức du lịch</h1>
            <p className="text-lg text-muted-foreground">
              Cập nhật những thông tin mới nhất về du lịch
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm tin tức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchNews();
                    }
                  }}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <>
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tất cả
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </>
              )}

              <Button onClick={searchNews} disabled={loading}>
                <Search className="h-4 w-4" />
                Tìm kiếm
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                <Trash2 className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : !newsData || newsData.content.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== null
                  ? "Không tìm thấy tin tức nào phù hợp"
                  : "Chưa có tin tức nào"}
              </p>
              {(searchTerm || selectedCategory !== null) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.content.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/news/${item.id}`}>
                      {item.image && (
                        <div className="aspect-video bg-muted overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-4 space-y-3">
                        {item.featured && (
                          <Badge className="bg-primary">Nổi bật</Badge>
                        )}
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views}
                          </div>
                          {item.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.author}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {newsData && newsData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPage(newsData.page - 1)}
                    disabled={newsData.first || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, newsData.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (newsData.totalPages <= 5) {
                          pageNum = i;
                        } else if (newsData.page < 3) {
                          pageNum = i;
                        } else if (newsData.page > newsData.totalPages - 4) {
                          pageNum = newsData.totalPages - 5 + i;
                        } else {
                          pageNum = newsData.page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              newsData.page === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => loadPage(pageNum)}
                            disabled={loading}
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPage(newsData.page + 1)}
                    disabled={newsData.last || loading}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              {newsData && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Hiển thị {newsData.content.length} / {newsData.totalElements}{" "}
                  tin tức
                  {newsData.totalPages > 1 &&
                    ` - Trang ${newsData.page + 1} / ${newsData.totalPages}`}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
