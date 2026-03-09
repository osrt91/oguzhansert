import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Project, Lang } from "../../lib/types";

const emptyProject = (lang: Lang, order: number): Project => ({
  id: "",
  lang,
  title: "",
  category: "",
  tools: "",
  image_url: "/images/placeholder.webp",
  link: "#",
  sort_order: order,
});

const ProjectsPage = () => {
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("projects").select("*").eq("lang", activeLang).order("sort_order").then(({ data }) => {
      setProjects(data?.length ? data : [emptyProject(activeLang, 1)]);
    });
  }, [activeLang]);

  const updateProject = (index: number, updates: Partial<Project>) => {
    setProjects(projects.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const addProject = () => {
    setProjects([...projects, emptyProject(activeLang, projects.length + 1)]);
  };

  const removeProject = async (index: number) => {
    const project = projects[index];
    if (project.id) {
      await supabase.from("projects").delete().eq("id", project.id);
    }
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    for (const project of projects) {
      const payload = { ...project, lang: activeLang };
      if (project.id) {
        await supabase.from("projects").update(payload).eq("id", project.id);
      } else {
        const { id: _, ...rest } = payload;
        await supabase.from("projects").insert(rest);
      }
    }

    setMessage({ type: "success", text: "Projeler kaydedildi!" });
    setSaving(false);
  };

  return (
    <div>
      <h1>Projeler</h1>
      <p className="admin-subtitle">Work bölümündeki proje kartları</p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button className={`admin-btn ${activeLang === "tr" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("tr")}>Türkçe</button>
        <button className={`admin-btn ${activeLang === "en" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("en")}>English</button>
      </div>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      {projects.map((project, index) => (
        <div className="admin-card" key={index}>
          <div className="admin-card-header">
            <h3>{project.title || `Proje ${index + 1}`}</h3>
            <button className="admin-btn admin-btn-danger" onClick={() => removeProject(index)}>Sil</button>
          </div>
          <div className="admin-grid">
            <div className="admin-field">
              <label>Proje Adı</label>
              <input value={project.title} onChange={(e) => updateProject(index, { title: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Kategori</label>
              <input value={project.category} onChange={(e) => updateProject(index, { category: e.target.value })} />
            </div>
          </div>
          <div className="admin-field">
            <label>Araçlar & Teknolojiler</label>
            <input value={project.tools} onChange={(e) => updateProject(index, { tools: e.target.value })} placeholder="React, TypeScript, Node.js" />
          </div>
          <div className="admin-grid">
            <div className="admin-field">
              <label>Görsel URL</label>
              <input value={project.image_url} onChange={(e) => updateProject(index, { image_url: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Proje Linki</label>
              <input value={project.link} onChange={(e) => updateProject(index, { link: e.target.value })} />
            </div>
          </div>
        </div>
      ))}

      <div className="admin-actions">
        <button className="admin-btn admin-btn-secondary" onClick={addProject}>+ Yeni Proje Ekle</button>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default ProjectsPage;
