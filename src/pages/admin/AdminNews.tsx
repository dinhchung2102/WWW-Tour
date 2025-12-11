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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { newsAPI, newsCategoryAPI } from "@/lib/api";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";
import type { News, NewsDTO, NewsCategory, PageResponse } from "@/types";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  XCircle,
} from "lucide-react";

export function AdminNews() {
  const [newsData, setNewsData] = useState<PageResponse<News> | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsDTO>({
    title: "",
    content: "",
    summary: "",
    image: "",
    slug: "",
    categoryId: 0,
    author: "",
    active: true,
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const fetchCategories = async () => {
    try {
      const categoriesData = await newsCategoryAPI.getAllCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.searchNews({
        keyword: searchKeyword.trim() || undefined,
        categoryId: selectedCategoryId,
        active: activeFilter,
        page: currentPage,
        size: pageSize,
      });
      setNewsData(response);
    } catch (error) {
      showErrorToast(error, "Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load page when pagination changes
  const loadPage = async (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      const response = await newsAPI.searchNews({
        keyword: searchKeyword.trim() || undefined,
        categoryId: selectedCategoryId,
        active: activeFilter,
        page: page,
        size: pageSize,
      });
      setNewsData(response);
    } catch (error) {
      showErrorToast(error, "Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  // Handle search button
  const handleSearch = () => {
    setCurrentPage(0);
    fetchData();
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchKeyword("");
    setSelectedCategoryId(undefined);
    setActiveFilter(undefined);
    setCurrentPage(0);
    // Trigger search with cleared filters
    setTimeout(() => {
      fetchData();
    }, 0);
  };

  const handleOpenDialog = (newsItem?: News) => {
    if (newsItem) {
      setSelectedNews(newsItem);
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        summary: newsItem.summary,
        image: newsItem.image || "",
        slug: newsItem.slug,
        categoryId: newsItem.categoryId,
        author: newsItem.author,
        active: newsItem.active,
        featured: newsItem.featured,
      });
      setImagePreview(newsItem.image || null);
    } else {
      setSelectedNews(null);
      setFormData({
        title: "",
        content: "",
        summary: "",
        image: "",
        slug: "",
        categoryId: 0,
        author: "",
        active: true,
        featured: false,
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedNews(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showErrorToast(
          new Error("Vui lòng chọn file ảnh"),
          "File không hợp lệ"
        );
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast(
          new Error("Kích thước file không được vượt quá 5MB"),
          "File quá lớn"
        );
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(false);

    try {
      if (selectedNews) {
        // Update news
        let imageUrl = formData.image;

        // If new file is selected, upload it first
        if (selectedFile) {
          setIsUploading(true);
          imageUrl = await newsAPI.uploadImage(selectedFile);
          setIsUploading(false);
        }

        await newsAPI.updateNews({
          ...selectedNews,
          ...formData,
          image: imageUrl || "",
        });
        showSuccessToast("Cập nhật tin tức thành công");
      } else {
        // Create news
        if (selectedFile) {
          // Create with image upload
          setIsUploading(true);
          await newsAPI.createNewsWithImage(formData, selectedFile);
          setIsUploading(false);
          showSuccessToast("Tạo tin tức thành công");
        } else {
          // Create without image
          await newsAPI.createNews(formData);
          showSuccessToast("Tạo tin tức thành công");
        }
      }

      handleCloseDialog();
      await fetchData();
    } catch (error) {
      setIsUploading(false);
      showErrorToast(error, "Có lỗi xảy ra khi lưu tin tức");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNews) return;

    try {
      await newsAPI.deleteNews(selectedNews.id);
      setIsDeleteDialogOpen(false);
      setSelectedNews(null);
      showSuccessToast("Xóa tin tức thành công");
      await fetchData();
    } catch (error) {
      showErrorToast(error, "Có lỗi xảy ra khi xóa tin tức");
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Tin tức</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách tin tức du lịch
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tin tức mới
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm và Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategoryId?.toString() || "all"}
              onValueChange={(value) => {
                setSelectedCategoryId(
                  value === "all" ? undefined : Number(value)
                );
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                activeFilter === undefined ? "all" : activeFilter.toString()
              }
              onValueChange={(value) => {
                setActiveFilter(value === "all" ? undefined : value === "true");
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách Tin tức
            {newsData && ` (${newsData.totalElements})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : !newsData || newsData.content.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy tin tức nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Ảnh</TableHead>
                    <TableHead className="w-[300px]">Tiêu đề</TableHead>
                    <TableHead className="w-[120px]">Danh mục</TableHead>
                    <TableHead className="w-[120px]">Tác giả</TableHead>
                    <TableHead className="w-[80px]">Lượt xem</TableHead>
                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                    <TableHead className="w-[120px] text-right">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsData.content.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedNews(item);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <TableCell
                        onClick={(e) => e.stopPropagation()}
                        className="w-[80px]"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
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
                      <TableCell className="w-[300px]">
                        <div className="font-medium line-clamp-1 max-w-[280px]">
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2 max-w-[280px]">
                          {item.summary}
                        </div>
                      </TableCell>
                      <TableCell className="w-[120px]">
                        {item.categoryName || "N/A"}
                      </TableCell>
                      <TableCell className="w-[120px]">{item.author}</TableCell>
                      <TableCell className="w-[80px]">{item.views}</TableCell>
                      <TableCell className="w-[120px]">
                        <div className="flex flex-col gap-1">
                          {item.active ? (
                            <Badge className="bg-green-500">Hoạt động</Badge>
                          ) : (
                            <Badge variant="destructive">Không hoạt động</Badge>
                          )}
                          {item.featured && (
                            <Badge className="bg-primary">Nổi bật</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-right w-[120px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedNews(item);
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

              {/* Pagination */}
              {newsData && newsData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {newsData.content.length} /{" "}
                    {newsData.totalElements} tin tức
                    {newsData.totalPages > 1 &&
                      ` - Trang ${newsData.page + 1} / ${newsData.totalPages}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPage(newsData.page - 1)}
                      disabled={newsData.first || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, newsData.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (newsData.totalPages <= 5) {
                            pageNum = i;
                          } else if (newsData.page < 3) {
                            pageNum = i;
                          } else if (newsData.page > newsData.totalPages - 4) {
                            pageNum = newsData.totalPages - 5 + i;
                          } else {
                            pageNum = newsData.page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                newsData.page === pageNum
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => loadPage(pageNum)}
                              disabled={loading}
                            >
                              {pageNum + 1}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPage(newsData.page + 1)}
                      disabled={newsData.last || loading}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedNews ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Tóm tắt *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Ảnh</Label>
              <div className="space-y-3">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
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

                {/* File Upload */}
                <div className="flex items-center gap-2">
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image-file"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("image-file")?.click();
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {selectedFile ? "Đổi ảnh" : "Chọn ảnh"}
                    </Button>
                  </Label>
                  {selectedFile && (
                    <span className="text-sm text-muted-foreground">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Danh mục *</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      categoryId: Number(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Tác giả *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="featured">Nổi bật</Label>
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
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isUploading
                  ? "Đang upload ảnh..."
                  : isSubmitting
                  ? "Đang lưu..."
                  : selectedNews
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
              {selectedNews?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-6">
              {/* Image */}
              {selectedNews.image && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedNews.image}
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(selectedNews.createdAt).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{selectedNews.views} lượt xem</span>
                </div>
                {selectedNews.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{selectedNews.author}</span>
                  </div>
                )}
                {selectedNews.categoryName && (
                  <Badge variant="outline">{selectedNews.categoryName}</Badge>
                )}
                <div className="flex gap-2">
                  {selectedNews.active ? (
                    <Badge className="bg-green-500">Hoạt động</Badge>
                  ) : (
                    <Badge variant="destructive">Không hoạt động</Badge>
                  )}
                  {selectedNews.featured && (
                    <Badge className="bg-primary">Nổi bật</Badge>
                  )}
                </div>
              </div>

              {/* Summary */}
              {selectedNews.summary && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-lg italic text-muted-foreground">
                    {selectedNews.summary}
                  </p>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleOpenDialog(selectedNews);
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
              Bạn có chắc chắn muốn xóa tin tức "{selectedNews?.title}"? Hành
              động này không thể hoàn tác.
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
