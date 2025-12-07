import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function About() {
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

          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle>Sứ mệnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Chúng tôi cam kết mang đến những trải nghiệm du lịch tuyệt vời
                nhất cho khách hàng, với dịch vụ chuyên nghiệp, giá cả hợp lý và
                sự tận tâm trong từng chuyến đi.
              </p>
              <p className="text-muted-foreground">
                Với đội ngũ hướng dẫn viên giàu kinh nghiệm và kiến thức sâu
                rộng về văn hóa, lịch sử Việt Nam, chúng tôi tự hào là đối tác
                đáng tin cậy cho mọi chuyến du lịch của bạn.
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chất lượng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Đảm bảo chất lượng dịch vụ cao nhất trong mọi tour, từ khâu
                  lên kế hoạch đến thực hiện chuyến đi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uy tín</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Xây dựng niềm tin với khách hàng thông qua sự minh bạch, trung
                  thực và cam kết thực hiện đúng những gì đã hứa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đổi mới</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Không ngừng cải thiện và đổi mới dịch vụ, tạo ra những trải
                  nghiệm độc đáo và đáng nhớ cho khách hàng.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tận tâm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chăm sóc khách hàng tận tình, lắng nghe và đáp ứng mọi nhu cầu
                  để đảm bảo sự hài lòng tuyệt đối.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Us */}
          <Card>
            <CardHeader>
              <CardTitle>Tại sao chọn chúng tôi?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Đội ngũ chuyên nghiệp</h3>
                <p className="text-muted-foreground">
                  Hướng dẫn viên được đào tạo bài bản, có kiến thức sâu rộng về
                  địa phương và kỹ năng giao tiếp tốt.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Lịch trình linh hoạt</h3>
                <p className="text-muted-foreground">
                  Nhiều tour với thời gian và địa điểm đa dạng, phù hợp với mọi
                  nhu cầu và sở thích của khách hàng.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Giá cả minh bạch</h3>
                <p className="text-muted-foreground">
                  Không có phí ẩn, giá cả rõ ràng và cạnh tranh, đảm bảo bạn
                  nhận được giá trị tốt nhất.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Hỗ trợ 24/7</h3>
                <p className="text-muted-foreground">
                  Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc
                  và hỗ trợ bạn trong suốt chuyến đi.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
