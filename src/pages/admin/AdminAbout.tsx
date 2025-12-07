import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { infoAPI } from "@/lib/api";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";
import type { Info, InfoDTO } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";

export function AdminAbout() {
  const [infos, setInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<Info | null>(null);
  const [formData, setFormData] = useState<InfoDTO>({
    title: "",
    description: "",
    image: "",
    isContactInfo: false,
    orderIndex: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInfos();
  }, []);

  const fetchInfos = async () => {
    try {
      const data = await infoAPI.getAllInfo();
      setInfos(data);
    } catch (error) {
      console.error("Failed to fetch infos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (info?: Info) => {
    if (info) {
      setSelectedInfo(info);
      setFormData({
        title: info.title,
        description: info.description,
        image: info.image || "",
        isContactInfo: info.isContactInfo,
        orderIndex: info.orderIndex,
      });
    } else {
      setSelectedInfo(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        isContactInfo: false,
        orderIndex: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedInfo) {
        await infoAPI.updateInfo({
          ...selectedInfo,
          ...formData,
        });
      } else {
        await infoAPI.createInfo(formData);
      }

      await fetchInfos();
      handleCloseDialog();
      showSuccessToast(selectedInfo ? "Cập nhật thông tin thành công" : "Tạo thông tin thành công");
    } catch (error) {
      console.error("Failed to save info:", error);
      showErrorToast(error, "Có lỗi xảy ra khi lưu thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedInfo) return;

    try {
      await infoAPI.deleteInfo(selectedInfo.id);
      await fetchInfos();
      setIsDeleteDialogOpen(false);
      setSelectedInfo(null);
      showSuccessToast("Xóa thông tin thành công");
    } catch (error) {
      console.error("Failed to delete info:", error);
      showErrorToast(error, "Có lỗi xảy ra khi xóa thông tin");
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Thông tin</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin giới thiệu và liên hệ
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm thông tin mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Thông tin ({infos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {infos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có thông tin nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="w-[150px]">Loại</TableHead>
                  <TableHead className="w-[100px]">Thứ tự</TableHead>
                  <TableHead className="w-[150px]">Ngày tạo</TableHead>
                  <TableHead className="w-[120px] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {infos.map((info) => (
                  <TableRow key={info.id}>
                    <TableCell>
                      {info.image ? (
                        <img
                          src={info.image}
                          alt={info.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{info.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {info.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={info.isContactInfo ? "default" : "secondary"}
                      >
                        {info.isContactInfo ? "Liên hệ" : "Giới thiệu"}
                      </Badge>
                    </TableCell>
                    <TableCell>{info.orderIndex}</TableCell>
                    <TableCell>
                      {new Date(info.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(info)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInfo(info);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedInfo ? "Chỉnh sửa Thông tin" : "Thêm Thông tin mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={6}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL ảnh</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Thứ tự hiển thị *</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  min="0"
                  value={formData.orderIndex}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderIndex: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isContactInfo">Loại thông tin</Label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isContactInfo"
                    checked={formData.isContactInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isContactInfo: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isContactInfo" className="cursor-pointer">
                    Là thông tin liên hệ
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang lưu..."
                  : selectedInfo
                  ? "Cập nhật"
                  : "Thêm mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thông tin</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thông tin "{selectedInfo?.title}"? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedInfo(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

