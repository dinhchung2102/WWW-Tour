import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tour } from "@/types";
import { MapPin, Calendar, Clock, Tag } from "lucide-react";
import { calculateDiscountedPrice, formatPrice } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  className?: string;
}

export function TourCard({ tour, className }: TourCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isUpcoming = new Date(tour.start_date) > new Date();
  const availableSlots = tour.max_participants;
  const finalPrice = calculateDiscountedPrice(tour.price, tour.promotion);
  const hasPromotion = tour.promotion && finalPrice < tour.price;

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}
    >
      {/* Image Section */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {tour.image ? (
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <MapPin className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}

        {/* Overlay Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasPromotion && (
            <Badge className="bg-red-500 text-white">
              <Tag className="h-3 w-3 mr-1" />
              {tour.promotion?.code}
            </Badge>
          )}
          {isUpcoming && (
            <Badge className="bg-primary text-primary-foreground">
              Sắp khởi hành
            </Badge>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-background/90 backdrop-blur-sm"
          >
            {availableSlots} chỗ
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {tour.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{tour.location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tour.description}
        </p>

        {/* Tour Details - Time and Date */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
            <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Thời gian</p>
              <p className="font-medium">{tour.duration} ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
            <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
              <Calendar className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Ngày khởi hành</p>
              <p className="font-medium truncate">
                {formatDate(tour.start_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2 border-t gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Giá từ</p>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-bold text-primary">
                {formatPrice(finalPrice)}
              </p>
              {hasPromotion && (
                <span className="text-sm line-through text-muted-foreground">
                  {formatPrice(tour.price)}
                </span>
              )}
            </div>
            {hasPromotion && tour.promotion?.discountPercent && (
              <Badge variant="secondary" className="mt-1 text-xs">
                Giảm {tour.promotion.discountPercent}%
              </Badge>
            )}
          </div>
          <Button asChild className="shrink-0">
            <Link to={`/tours/${tour.id_tour}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
