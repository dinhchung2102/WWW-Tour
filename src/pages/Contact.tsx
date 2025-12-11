import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { infoAPI, contactAPI } from "@/lib/api";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";
import type { Info } from "@/types";
import { Mail, Phone, MapPin } from "lucide-react";
import banner1 from "@/assets/banner/banner1.jpg";
import banner2 from "@/assets/banner/banner2.png";
import banner3 from "@/assets/banner/banner3.jpg";
import banner4 from "@/assets/banner/banner4.jpg";

export function Contact() {
  const [contactInfos, setContactInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  const banners = [banner1, banner2, banner3, banner4];

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await infoAPI.getContactInfo(true);
        setContactInfos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.createContact({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
      });
      setSubmitted(true);
      setFormData({ fullName: "", email: "", phone: "", description: "" });
      showSuccessToast(
        "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể."
      );
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit contact:", error);
      showErrorToast(error, "Có lỗi xảy ra khi gửi thông tin liên hệ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
                <div className="relative w-full aspect-[16/5] overflow-hidden group">
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
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Liên hệ với chúng tôi</h1>
              <p className="text-lg text-muted-foreground">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info from API */}
              <div className="space-y-6">
                {contactInfos.length > 0 ? (
                  contactInfos.map((info) => (
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
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Thông tin liên hệ</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Mail className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">
                              ntdinh25@gmail.com
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Phone className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Điện thoại</p>
                            <p className="text-sm text-muted-foreground">
                              0353081256
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <MapPin className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-medium">Địa chỉ</p>
                            <p className="text-sm text-muted-foreground">
                              536 Nguyễn Oanh, Quận Gò Vấp, TP. Hồ Chí Minh
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Giờ làm việc</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Thứ 2 - Thứ 6
                          </span>
                          <span className="font-medium">8:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thứ 7</span>
                          <span className="font-medium">8:00 - 12:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Chủ nhật
                          </span>
                          <span className="font-medium">Nghỉ</span>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Gửi tin nhắn</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Tin nhắn</Label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {submitted && (
                      <p className="text-sm text-primary">
                        Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có
                        thể.
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
