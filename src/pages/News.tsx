import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { newsAPI, newsCategoryAPI } from "@/lib/api";
import type { News, NewsCategory } from "@/types";
import { Search, Calendar, Eye, User } from "lucide-react";
import { showErrorToast } from "@/lib/error-handler";

export function News() {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, categoriesData] = await Promise.all([
          newsAPI.getActiveNews(true),
          newsCategoryAPI.getActiveCategories(true),
        ]);

        const newsArray = Array.isArray(newsData) ? newsData : [];
        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : [];

        setNews(newsData);
        setFilteredNews(newsArray);
        setCategories(categoriesArray);
      } catch (error) {
        showErrorToast(error, "Không thể tải danh sách tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = news;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (item) => item.categoryId === selectedCategory
      );
    }

    setFilteredNews(filtered);
  }, [searchTerm, selectedCategory, news]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
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
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm tin tức..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
            </div>
          )}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : filteredNews.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
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
        )}
      </div>
    </div>
  );
}
