import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { infoAPI } from "@/lib/api";
import type { Info } from "@/types";

export function About() {
  const [infos, setInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfos = async () => {
      try {
        // Get ordered info (excluding contact info)
        const data = await infoAPI.getOrderedInfo();
        // Filter out contact info
        const aboutInfos = data.filter((info) => !info.isContactInfo);
        setInfos(aboutInfos);
      } catch (error) {
        console.error("Failed to fetch about info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfos();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Về chúng tôi</h1>
            <p className="text-lg text-muted-foreground">
              TourDuLich - Đồng hành cùng bạn khám phá vẻ đẹp Việt Nam
            </p>
          </div>

          {/* Dynamic Info Sections */}
          {infos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Chưa có thông tin giới thiệu
              </CardContent>
            </Card>
          ) : (
            infos.map((info) => (
              <Card key={info.id}>
                {info.image && (
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <img
                      src={info.image}
                      alt={info.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
