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
import { Badge } from "@/components/ui/badge";
import { contactAPI } from "@/lib/api";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";
import type { Contact } from "@/types";
import { Trash2, Eye } from "lucide-react";

export function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactAPI.getAllContacts();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (contact: Contact) => {
    try {
      await contactAPI.updateContact({
        ...contact,
        active: !contact.active,
      });
      await fetchContacts();
      showSuccessToast("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Failed to update contact:", error);
      showErrorToast(error, "Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;

    try {
      await contactAPI.deleteContact(selectedContact.id);
      await fetchContacts();
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
      showSuccessToast("Xóa liên hệ thành công");
    } catch (error) {
      console.error("Failed to delete contact:", error);
      showErrorToast(error, "Có lỗi xảy ra khi xóa");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
        <h1 className="text-3xl font-bold">Quản lý Liên hệ</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin liên hệ từ khách hàng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Liên hệ ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có liên hệ nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[120px]">Số điện thoại</TableHead>
                  <TableHead>Tin nhắn</TableHead>
                  <TableHead className="w-[100px]">Trạng thái</TableHead>
                  <TableHead className="w-[150px]">Ngày gửi</TableHead>
                  <TableHead className="w-[150px] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      #{contact.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {contact.fullName}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {contact.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={contact.active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleActive(contact)}
                      >
                        {contact.active ? "Mới" : "Đã xử lý"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(contact.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact);
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết Liên hệ</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Họ tên</p>
                <p className="font-medium">{selectedContact.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{selectedContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tin nhắn</p>
                <p className="font-medium whitespace-pre-line">
                  {selectedContact.description}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <Badge
                  variant={selectedContact.active ? "default" : "secondary"}
                >
                  {selectedContact.active ? "Mới" : "Đã xử lý"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày gửi</p>
                <p className="font-medium">
                  {formatDate(selectedContact.createdAt)}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedContact) {
                      handleToggleActive(selectedContact);
                    }
                    setIsViewDialogOpen(false);
                  }}
                >
                  {selectedContact.active
                    ? "Đánh dấu đã xử lý"
                    : "Đánh dấu mới"}
                </Button>
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa liên hệ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa liên hệ từ "{selectedContact?.fullName}"?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedContact(null)}>
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

