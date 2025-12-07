import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Tours } from "@/pages/Tours";
import { TourDetail } from "@/pages/TourDetail";
import { Contact } from "@/pages/Contact";
import { AdminPage } from "@/pages/admin/AdminPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/tours/:id" element={<TourDetail />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
