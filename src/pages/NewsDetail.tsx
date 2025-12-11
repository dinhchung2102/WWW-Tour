import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { newsAPI } from "@/lib/api";
import type { News } from "@/types";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import { showErrorToast } from "@/lib/error-handler";

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;

      try {
        const data = await newsAPI.getNewsById(Number(id));
        setNews(data);
      } catch (error) {
        showErrorToast(error, "Không thể tải tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (!news) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Không tìm thấy tin tức</p>
            <Button asChild variant="outline">
              <Link to="/news">Quay lại danh sách tin tức</Link>
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
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>

        <article className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            {news.featured && (
              <Badge className="bg-primary">Nổi bật</Badge>
            )}
            <h1 className="text-4xl font-bold">{news.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(news.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {news.views} lượt xem
              </div>
              {news.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {news.author}
                </div>
              )}
              {news.categoryName && (
                <Badge variant="outline">{news.categoryName}</Badge>
              )}
            </div>
          </div>

          {/* Image */}
          {news.image && (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Summary */}
          {news.summary && (
            <Card>
              <CardContent className="p-6">
                <p className="text-lg text-muted-foreground italic">
                  {news.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          <Card>
            <CardContent className="p-6">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}

