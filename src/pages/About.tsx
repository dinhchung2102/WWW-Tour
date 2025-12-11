import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { infoAPI } from "@/lib/api";
import type { Info } from "@/types";

export function About() {
  const [infos, setInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchInfos = async () => {
      try {
        const data = await infoAPI.getOrderedInfo();
        const dataArray = Array.isArray(data) ? data : [];
        const aboutInfos = dataArray.filter((info) => !info.isContactInfo);
        setInfos(aboutInfos);
      } catch (error) {
        console.error("Failed to fetch about info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfos();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const defaultInfos: Info[] = [
    {
      id: 1,
      title: "Sứ mệnh của chúng tôi",
      description: `TourDuLich ra đời với mục tiêu mang đến trải nghiệm du lịch tuyệt vời nhất tại Việt Nam. 
Chúng tôi đồng hành cùng bạn khám phá những điểm đến nổi bật, từ núi non hùng vĩ đến những bãi biển thơ mộng.`,
      image: "/image/BinhDinh.jpg",
      isContactInfo: false,
      createdAt: "",
      updatedAt: "",
      orderIndex: 0,
    },
    {
      id: 2,
      title: "Tầm nhìn & Lịch sử hình thành",
      description: `Chúng tôi hướng tới trở thành công ty du lịch hàng đầu Việt Nam, nơi khách hàng luôn cảm thấy được chăm sóc chu đáo và trải nghiệm chuyến đi trọn vẹn.
\nTourDuLich được thành lập từ năm 2015, đã tổ chức hàng trăm tour trải nghiệm trên khắp Việt Nam.`,
      image: "/image/DaLat_3.jpg",
      isContactInfo: false,
      createdAt: "",
      updatedAt: "",
      orderIndex: 0,
    },
    {
      id: 3,
      title: "Giá trị cốt lõi & Thành tựu",
      description: `Chất lượng – Uy tín – Sáng tạo: Chúng tôi cam kết mang đến dịch vụ chất lượng, đáng tin cậy và luôn đổi mới.
\nĐã đạt nhiều giải thưởng uy tín trong ngành du lịch Việt Nam và nhận phản hồi tích cực từ hàng nghìn khách hàng.`,
      image: "/image/DaNang.png",
      isContactInfo: false,
      createdAt: "",
      updatedAt: "",
      orderIndex: 0,
    },
  ];

  const displayInfos = infos.length > 0 ? infos : defaultInfos;

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">Về chúng tôi</h1>
            <p className="text-lg text-gray-600">
              TourDuLich - Đồng hành cùng bạn khám phá vẻ đẹp Việt Nam
            </p>
          </div>

          {/* Dynamic Info Sections */}
          {displayInfos.map((info) => (
            <Card
              key={info.id}
              className="hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
            >
              {info.image && (
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                  <img
                    src={info.image}
                    alt={info.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">{info.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {expandedIds.includes(info.id)
                    ? info.description
                    : info.description.length > 250
                    ? info.description.slice(0, 250) + "..."
                    : info.description}
                </p>
                {info.description.length > 250 && (
                  <button
                    onClick={() => toggleExpand(info.id)}
                    className="mt-2 text-blue-500 hover:underline text-sm"
                  >
                    {expandedIds.includes(info.id) ? "Thu gọn" : "Xem chi tiết"}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Extra Section: Team & Contact */}
          <Card className="hover:shadow-xl transition-shadow duration-300 rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Đội ngũ & Liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line mb-4">
                Chúng tôi tự hào có đội ngũ nhân viên chuyên nghiệp, nhiệt huyết với hơn 50 hướng dẫn viên và nhân viên hỗ trợ khắp cả nước.
              </p>
              <p className="text-gray-700">
                Liên hệ với chúng tôi: <span className="text-blue-600">contact@tourdulich.vn</span> | Hotline: <span className="text-blue-600">0909 123 456</span>
              </p>
            </CardContent>
          </Card>
           <Card className="hover:shadow-2xl transition-shadow duration-500 rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-semibold">Thành tựu nổi bật</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Được bình chọn là Top 5 công ty du lịch uy tín tại Việt Nam 2022.</li>
                <li>Hơn 100.000 khách hàng hài lòng trải nghiệm tour trong nước.</li>
                <li>Hợp tác với hơn 50 đối tác khách sạn, resort và dịch vụ hàng đầu.</li>
                <li>Tích hợp công nghệ đặt tour trực tuyến hiện đại, an toàn và tiện lợi.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
