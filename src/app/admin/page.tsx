import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
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
} from "lucide-react";

interface StatCard {
  label: string;
  count: number;
  href: string;
  icon: React.ElementType;
}

async function getStats(): Promise<StatCard[]> {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdmin();

  const tables = [
    { table: "profile", label: "Profil", href: "/admin/profil", icon: User },
    { table: "skills", label: "Yetenekler", href: "/admin/yetenekler", icon: Sparkles },
    { table: "work_experience", label: "İş Deneyimi", href: "/admin/is-deneyimi", icon: Briefcase },
    { table: "education", label: "Eğitim", href: "/admin/egitim", icon: GraduationCap },
    { table: "projects", label: "Projeler", href: "/admin/projeler", icon: FolderKanban },
    { table: "blog_posts", label: "Blog Yazıları", href: "/admin/blog", icon: FileText },
    { table: "gallery_images", label: "Galeri", href: "/admin/galeri", icon: Image },
    { table: "hackathons", label: "Etkinlikler", href: "/admin/etkinlikler", icon: Calendar },
    { table: "seo_metadata", label: "SEO", href: "/admin/seo", icon: Search },
    { table: "redirects", label: "Yönlendirmeler", href: "/admin/yonlendirmeler", icon: ArrowRightLeft },
    { table: "site_settings", label: "Site Ayarları", href: "/admin/ayarlar", icon: Settings },
  ];

  const results = await Promise.all(
    tables.map(async ({ table, label, href, icon }) => {
      try {
        const { count } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        return { label, count: count || 0, href, icon };
      } catch {
        return { label, count: 0, href, icon };
      }
    })
  );

  return results;
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) redirect("/admin/login");

  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Yonetim paneline hos geldiniz. Asagidaki kartlardan modullere erisebilirsiniz.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
