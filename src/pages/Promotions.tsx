import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { promotionAPI, promotionSubscriberAPI } from "@/lib/api";
import type { Promotion } from "@/types";
import { Calendar, Tag, Percent, DollarSign, Mail } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";

export function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeName, setSubscribeName] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await promotionAPI.getActivePromotions();
        setPromotions(Array.isArray(data) ? data : []);
      } catch (error) {
        showErrorToast(error, "Không thể tải danh sách khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);

    try {
      await promotionSubscriberAPI.subscribe({
        email: subscribeEmail,
        name: subscribeName || null,
      });
      setSubscribeOpen(false);
      setSubscribeEmail("");
      setSubscribeName("");
      showSuccessToast("Đăng ký nhận khuyến mãi thành công!");
    } catch (error) {
      showErrorToast(error, "Đăng ký thất bại");
    } finally {
      setSubscribing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    return now >= startDate && now <= endDate && promotion.active;
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">Khuyến mãi đặc biệt</h1>
          <p className="text-lg text-muted-foreground">
            Những ưu đãi hấp dẫn dành cho bạn
          </p>
          <Button onClick={() => setSubscribeOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Đăng ký nhận thông báo khuyến mãi
          </Button>
        </div>

        {/* Promotions Grid */}
        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">
              Hiện tại chưa có khuyến mãi nào
            </p>
            <Button onClick={() => setSubscribeOpen(true)} variant="outline">
              Đăng ký nhận thông báo khi có khuyến mãi mới
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <Card
                key={promotion.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {promotion.image && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={promotion.image}
                      alt={promotion.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {promotion.title}
                      </h3>
                      {isPromotionActive(promotion) && (
                        <Badge className="bg-green-500">Đang áp dụng</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {promotion.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    {promotion.discountPercent > 0 && (
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-primary" />
                        <span className="text-lg font-bold text-primary">
                          Giảm {promotion.discountPercent}%
                        </span>
                      </div>
                    )}
                    {promotion.discountAmount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          Giảm {formatPrice(promotion.discountAmount)}
                        </span>
                      </div>
                    )}
                    {promotion.code && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {promotion.code}
                        </code>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(promotion.startDate)} -{" "}
                        {formatDate(promotion.endDate)}
                      </span>
                    </div>
                    {promotion.minOrderAmount && (
                      <p className="text-xs">
                        Áp dụng cho đơn hàng từ{" "}
                        {formatPrice(promotion.minOrderAmount)}
                      </p>
                    )}
                    {promotion.maxDiscountAmount && (
                      <p className="text-xs">
                        Giảm tối đa {formatPrice(promotion.maxDiscountAmount)}
                      </p>
                    )}
                    {promotion.usageLimit && (
                      <p className="text-xs">
                        Còn lại: {promotion.usageLimit - promotion.usedCount}{" "}
                        lượt
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Subscribe Dialog */}
        <Dialog open={subscribeOpen} onOpenChange={setSubscribeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đăng ký nhận thông báo khuyến mãi</DialogTitle>
              <DialogDescription>
                Nhập email để nhận thông báo về các khuyến mãi mới nhất
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subscribe-email">Email *</Label>
                <Input
                  id="subscribe-email"
                  type="email"
                  placeholder="your@email.com"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscribe-name">Tên (tùy chọn)</Label>
                <Input
                  id="subscribe-name"
                  placeholder="Tên của bạn"
                  value={subscribeName}
                  onChange={(e) => setSubscribeName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSubscribeOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={subscribing}>
                  {subscribing ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
