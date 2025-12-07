import { type ReactNode } from "react";
import { AppBar } from "./AppBar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 TourDuLich. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Chính sách
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Điều khoản
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
