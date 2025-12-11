import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { promotionSubscriberAPI } from "@/lib/api";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";
import type { PromotionSubscriber } from "@/types";
import { Trash2, Mail, User } from "lucide-react";

export function AdminPromotionSubscribers() {
  const [subscribers, setSubscribers] = useState<PromotionSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<PromotionSubscriber | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await promotionSubscriberAPI.getAllSubscribers();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (error) {
      showErrorToast(error, "Không thể tải danh sách người đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubscriber) return;

    try {
      await promotionSubscriberAPI.deleteSubscriber(selectedSubscriber.id);
      await fetchSubscribers();
      setIsDeleteDialogOpen(false);
      setSelectedSubscriber(null);
      showSuccessToast("Xóa người đăng ký thành công");
    } catch (error) {
      showErrorToast(error, "Có lỗi xảy ra khi xóa người đăng ký");
    }
  };

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
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Người đăng ký</h1>
        <p className="text-muted-foreground">
          Quản lý danh sách người đăng ký nhận thông báo khuyến mãi
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Người đăng ký ({subscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có người đăng ký nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead className="w-[120px]">Trạng thái</TableHead>
                  <TableHead className="w-[180px]">Ngày đăng ký</TableHead>
                  <TableHead className="w-[180px]">Ngày hủy đăng ký</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{subscriber.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {subscriber.name ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{subscriber.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {subscriber.active ? (
                        <Badge className="bg-green-500">Hoạt động</Badge>
                      ) : (
                        <Badge variant="destructive">Đã hủy</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(subscriber.subscribedAt)}</TableCell>
                    <TableCell>
                      {subscriber.unsubscribedAt
                        ? formatDate(subscriber.unsubscribedAt)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubscriber(subscriber);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người đăng ký "
              {selectedSubscriber?.email}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
