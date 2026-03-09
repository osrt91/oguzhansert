import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const DashboardPage = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    career: 0,
    techStack: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      const [projects, career, techStack] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("career_entries").select("id", { count: "exact", head: true }),
        supabase.from("tech_stack").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        projects: projects.count || 0,
        career: career.count || 0,
        techStack: techStack.count || 0,
      });
    }
    fetchCounts();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="admin-subtitle">oguzhansert.dev yönetim paneline hoş geldiniz.</p>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Projeler</h3>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#c2a4ff" }}>{counts.projects}</p>
        </div>
        <div className="admin-card">
          <h3>Kariyer Girişleri</h3>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#c2a4ff" }}>{counts.career}</p>
        </div>
        <div className="admin-card">
          <h3>Tech Stack</h3>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#c2a4ff" }}>{counts.techStack}</p>
        </div>
        <div className="admin-card">
          <h3>Hızlı İpucu</h3>
          <p style={{ fontSize: "14px", color: "#888" }}>
            Sol menüden her bölümü düzenleyebilirsiniz. Her bölümde TR ve EN içerikleri ayrı ayrı yönetilir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
