import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { supabase } from "../lib/supabase";
import { useLang } from "./LanguageProvider";
import type {
  SiteConfig,
  HeroContent,
  AboutContent,
  WhatIdoCard,
  CareerEntry,
  Project,
  TechStackItem,
} from "../lib/types";
import { defaultContent } from "../data/defaultContent";

interface ContentContextType {
  siteConfig: SiteConfig;
  hero: HeroContent;
  about: AboutContent;
  whatIdo: WhatIdoCard[];
  career: CareerEntry[];
  projects: Project[];
  techStack: TechStackItem[];
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: PropsWithChildren) => {
  const { lang } = useLang();
  const [content, setContent] = useState<ContentContextType>({
    ...defaultContent(lang),
    loading: true,
  });

  useEffect(() => {
    async function fetchContent() {
      try {
        const [
          { data: siteConfig },
          { data: hero },
          { data: about },
          { data: whatIdo },
          { data: career },
          { data: projects },
          { data: techStack },
        ] = await Promise.all([
          supabase.from("site_config").select("*").single(),
          supabase.from("hero_content").select("*").eq("lang", lang).single(),
          supabase.from("about_content").select("*").eq("lang", lang).single(),
          supabase.from("whatido_cards").select("*").eq("lang", lang).order("sort_order"),
          supabase.from("career_entries").select("*").eq("lang", lang).order("sort_order"),
          supabase.from("projects").select("*").eq("lang", lang).order("sort_order"),
          supabase.from("tech_stack").select("*").order("sort_order"),
        ]);

        const defaults = defaultContent(lang);

        setContent({
          siteConfig: siteConfig || defaults.siteConfig,
          hero: hero || defaults.hero,
          about: about || defaults.about,
          whatIdo: whatIdo?.length ? whatIdo : defaults.whatIdo,
          career: career?.length ? career : defaults.career,
          projects: projects?.length ? projects : defaults.projects,
          techStack: techStack?.length ? techStack : defaults.techStack,
          loading: false,
        });
      } catch {
        setContent({ ...defaultContent(lang), loading: false });
      }
    }

    fetchContent();
  }, [lang]);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within ContentProvider");
  return context;
};
