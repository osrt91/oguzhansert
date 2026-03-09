import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import AdminLogin from "./AdminLogin";
import DashboardPage from "./pages/DashboardPage";
import SiteConfigPage from "./pages/SiteConfigPage";
import HeroPage from "./pages/HeroPage";
import AboutPage from "./pages/AboutPage";
import WhatIdoPage from "./pages/WhatIdoPage";
import CareerPage from "./pages/CareerPage";
import ProjectsPage from "./pages/ProjectsPage";
import TechStackPage from "./pages/TechStackPage";
import SeoPage from "./pages/SeoPage";
import "./admin.css";

const AdminLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/admin");
  };

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!session) return <AdminLogin onLogin={setSession} />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/site-config" className={({ isActive }) => isActive ? "active" : ""}>
          Site Ayarları
        </NavLink>
        <NavLink to="/admin/hero" className={({ isActive }) => isActive ? "active" : ""}>
          Hero
        </NavLink>
        <NavLink to="/admin/about" className={({ isActive }) => isActive ? "active" : ""}>
          Hakkımda
        </NavLink>
        <NavLink to="/admin/whatido" className={({ isActive }) => isActive ? "active" : ""}>
          Ne Yapıyorum
        </NavLink>
        <NavLink to="/admin/career" className={({ isActive }) => isActive ? "active" : ""}>
          Kariyer
        </NavLink>
        <NavLink to="/admin/projects" className={({ isActive }) => isActive ? "active" : ""}>
          Projeler
        </NavLink>
        <NavLink to="/admin/techstack" className={({ isActive }) => isActive ? "active" : ""}>
          Tech Stack
        </NavLink>
        <NavLink to="/admin/seo" className={({ isActive }) => isActive ? "active" : ""}>
          SEO & Analytics
        </NavLink>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="site-config" element={<SiteConfigPage />} />
          <Route path="hero" element={<HeroPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="whatido" element={<WhatIdoPage />} />
          <Route path="career" element={<CareerPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="techstack" element={<TechStackPage />} />
          <Route path="seo" element={<SeoPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
