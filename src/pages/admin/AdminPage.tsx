import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { AdminDashboard } from "./AdminDashboard";
import { AdminTours } from "./AdminTours";
import { AdminBookings } from "./AdminBookings";
import { AdminCustomers } from "./AdminCustomers";
import { AdminAbout } from "./AdminAbout";
import { AdminContacts } from "./AdminContacts";

export function AdminPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="tours" element={<AdminTours />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="contacts" element={<AdminContacts />} />
      </Routes>
    </AdminLayout>
  );
}

