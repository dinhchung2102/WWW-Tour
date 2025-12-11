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
import { Textarea } from "@/components/ui/textarea";
import { promotionAPI } from "@/lib/api";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";
import type { Promotion, PromotionDTO } from "@/types";
import { Plus, Edit, Trash2, XCircle } from "lucide-react";

export function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [formData, setFormData] = useState<PromotionDTO>({
    title: "",
    description: "",
    discountPercent: 0,
    discountAmount: null,
    code: "",
    startDate: "",
    endDate: "",
    minOrderAmount: null,
    maxDiscountAmount: null,
    usageLimit: null,
    active: true,
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await promotionAPI.getAllPromotions();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (error) {
      showErrorToast(error, "Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (promotion?: Promotion) => {
    if (promotion) {
      setSelectedPromotion(promotion);
      setFormData({
        title: promotion.title,
        description: promotion.description,
        discountPercent: promotion.discountPercent,
        discountAmount: promotion.discountAmount,
        code: promotion.code,
        startDate: promotion.startDate.split("T")[0],
        endDate: promotion.endDate.split("T")[0],
        minOrderAmount: promotion.minOrderAmount,
        maxDiscountAmount: promotion.maxDiscountAmount,
        usageLimit: promotion.usageLimit,
        active: promotion.active,
        image: promotion.image,
      });
      setImagePreview(promotion.image);
    } else {
      setSelectedPromotion(null);
      setFormData({
        title: "",
        description: "",
        discountPercent: 0,
        discountAmount: null,
        code: "",
        startDate: "",
        endDate: "",
        minOrderAmount: null,
        maxDiscountAmount: null,
        usageLimit: null,
        active: true,
        image: null,
      });
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPromotion(null);
    setImagePreview(null);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const promotionData: PromotionDTO = {
        ...formData,
        image: imagePreview || null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate + "T23:59:59").toISOString(),
      };

      if (selectedPromotion) {
        await promotionAPI.updatePromotion({
          ...selectedPromotion,
          ...promotionData,
        });
        showSuccessToast("Cập nhật khuyến mãi thành công");
      } else {
        await promotionAPI.createPromotion(promotionData);
        showSuccessToast("Tạo khuyến mãi thành công");
      }

      handleCloseDialog();
      await fetchPromotions();
    } catch (error) {
      showErrorToast(error, "Có lỗi xảy ra khi lưu khuyến mãi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;

    try {
      await promotionAPI.deletePromotion(selectedPromotion.id);
      await fetchPromotions();
      setIsDeleteDialogOpen(false);
      setSelectedPromotion(null);
      showSuccessToast("Xóa khuyến mãi thành công");
    } catch (error) {
      showErrorToast(error, "Có lỗi xảy ra khi xóa khuyến mãi");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
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

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Khuyến mãi</h1>
          <p className="text-muted-foreground">
            Quản lý các chương trình khuyến mãi
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khuyến mãi mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Khuyến mãi ({promotions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có khuyến mãi nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ảnh</TableHead>
                  <TableHead className="w-[250px]">Tiêu đề</TableHead>
                  <TableHead className="w-[120px]">Mã</TableHead>
                  <TableHead className="w-[100px]">Giảm giá</TableHead>
                  <TableHead className="w-[150px]">Thời gian</TableHead>
                  <TableHead className="w-[100px]">Sử dụng</TableHead>
                  <TableHead className="w-[100px]">Trạng thái</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow
                    key={promotion.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedPromotion(promotion);
                      setIsDetailDialogOpen(true);
                    }}
                  >
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="w-[80px]"
                    >
                      {promotion.image ? (
                        <img
                          src={promotion.image}
                          alt={promotion.title}
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
                    <TableCell className="w-[250px]">
                      <div className="font-medium line-clamp-1 max-w-[230px]">
                        {promotion.title}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2 max-w-[230px]">
                        {promotion.description}
                      </div>
                    </TableCell>
                    <TableCell className="w-[120px]">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {promotion.code}
                      </code>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {promotion.discountPercent > 0 && (
                        <div className="text-sm font-semibold text-primary">
                          {promotion.discountPercent}%
                        </div>
                      )}
                      {promotion.discountAmount && (
                        <div className="text-xs text-muted-foreground">
                          {formatPrice(promotion.discountAmount)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="w-[150px]">
                      <div className="text-xs">
                        <div>{formatDate(promotion.startDate)}</div>
                        <div className="text-muted-foreground">
                          đến {formatDate(promotion.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {promotion.usageLimit ? (
                        <div className="text-sm">
                          {promotion.usedCount} / {promotion.usageLimit}
                        </div>
                      ) : (
                        <div className="text-sm">{promotion.usedCount}</div>
                      )}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {isPromotionActive(promotion) ? (
                        <Badge className="bg-green-500">Hoạt động</Badge>
                      ) : (
                        <Badge variant="destructive">Không hoạt động</Badge>
                      )}
                    </TableCell>
                    <TableCell
                      className="text-right w-[120px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(promotion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPromotion(promotion);
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPromotion
                ? "Chỉnh sửa khuyến mãi"
                : "Thêm khuyến mãi mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="code">Mã khuyến mãi *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountPercent">
                  Phần trăm giảm giá (%) *
                </Label>
                <Input
                  id="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercent: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountAmount">
                  Số tiền giảm cố định (VND)
                </Label>
                <Input
                  id="discountAmount"
                  type="number"
                  min="0"
                  value={formData.discountAmount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountAmount: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">Số tiền tối thiểu (VND)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrderAmount: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscountAmount">Giảm tối đa (VND)</Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  min="0"
                  value={formData.maxDiscountAmount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscountAmount: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Giới hạn số lần sử dụng</Label>
              <Input
                id="usageLimit"
                type="number"
                min="0"
                value={formData.usageLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL ảnh</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image || ""}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value || null });
                  if (e.target.value) {
                    setImagePreview(e.target.value);
                  } else {
                    setImagePreview(null);
                  }
                }}
              />
              {imagePreview && (
                <div className="relative inline-block mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-auto rounded-lg border object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveImage}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="active">Hoạt động</Label>
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
                  : selectedPromotion
                  ? "Cập nhật"
                  : "Tạo mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedPromotion?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedPromotion && (
            <div className="space-y-6">
              {selectedPromotion.image && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedPromotion.image}
                    alt={selectedPromotion.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mô tả</p>
                  <p className="mt-1">{selectedPromotion.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mã khuyến mãi
                    </p>
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                      {selectedPromotion.code}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Giảm giá</p>
                    <p className="font-semibold">
                      {selectedPromotion.discountPercent > 0 && (
                        <span className="text-primary">
                          {selectedPromotion.discountPercent}%
                        </span>
                      )}
                      {selectedPromotion.discountAmount && (
                        <span className="ml-2">
                          hoặc {formatPrice(selectedPromotion.discountAmount)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ngày bắt đầu
                    </p>
                    <p>{formatDate(selectedPromotion.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ngày kết thúc
                    </p>
                    <p>{formatDate(selectedPromotion.endDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedPromotion.minOrderAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Số tiền tối thiểu
                      </p>
                      <p>{formatPrice(selectedPromotion.minOrderAmount)}</p>
                    </div>
                  )}
                  {selectedPromotion.maxDiscountAmount && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Giảm tối đa
                      </p>
                      <p>{formatPrice(selectedPromotion.maxDiscountAmount)}</p>
                    </div>
                  )}
                </div>

                {selectedPromotion.usageLimit && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số lần sử dụng
                    </p>
                    <p>
                      {selectedPromotion.usedCount} /{" "}
                      {selectedPromotion.usageLimit}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  {isPromotionActive(selectedPromotion) ? (
                    <Badge className="bg-green-500">Hoạt động</Badge>
                  ) : (
                    <Badge variant="destructive">Không hoạt động</Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleOpenDialog(selectedPromotion);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi "{selectedPromotion?.title}"?
              Hành động này không thể hoàn tác.
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
