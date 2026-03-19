"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderKanban,
  FileText,
  Image,
  Calendar,
  Search,
  ArrowRightLeft,
  Settings,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profil", label: "Profil", icon: User },
  { href: "/admin/yetenekler", label: "Yetenekler", icon: Sparkles },
  { href: "/admin/is-deneyimi", label: "İş Deneyimi", icon: Briefcase },
  { href: "/admin/egitim", label: "Eğitim", icon: GraduationCap },
  { href: "/admin/projeler", label: "Projeler", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/galeri", label: "Galeri", icon: Image },
  { href: "/admin/etkinlikler", label: "Etkinlikler", icon: Calendar },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/yonlendirmeler", label: "Yönlendirmeler", icon: ArrowRightLeft },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      toast.success("Çıkış yapıldı.");
      router.push("/admin/login");
    } catch {
      toast.error("Çıkış yapılırken hata oluştu.");
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo / Title */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="text-lg font-semibold text-foreground">
            Admin Panel
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </aside>
  );
}
