import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { AdminSidebar } from "./sidebar";

export const metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  // Allow login page without auth
  // Layout applies to all /admin/* routes, but login page handles its own redirect
  if (!token) {
    // We can't check pathname here easily in a layout,
    // so the middleware will handle redirecting non-login pages
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {token && <AdminSidebar />}
      <main className={`flex-1 ${token ? "ml-64" : ""}`}>
        <div className="p-6">{children}</div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
