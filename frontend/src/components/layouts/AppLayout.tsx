import { useState} from "react";
import { Sidebar } from "../common/Sidebar";
import { TopNavbar } from "../common/TopNavbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:block fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-52">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 md:pl-52 flex flex-col min-w-0">
        <TopNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
