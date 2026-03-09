import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { supabase } from "../lib/supabase";
import type { SeoConfig } from "../lib/types";

const defaultSeo: SeoConfig = {
  id: "",
  ga_measurement_id: "",
  meta_pixel_id: "",
  site_description_tr: "Oguzhan Sert - Full-stack web uygulamalari, otomasyon ve teknik sistemler uzerine uzmanlasmis urun odakli gelistirici.",
  site_description_en: "Portfolio of Oguzhan Sert — a product-minded developer specializing in full-stack web applications, automation, and technical systems.",
  og_image_url: "https://oguzhansert.dev/images/og-image.png",
};

interface SeoContextType {
  seo: SeoConfig;
}

const SeoContext = createContext<SeoContextType>({ seo: defaultSeo });

export const SeoProvider = ({ children }: PropsWithChildren) => {
  const [seo, setSeo] = useState<SeoConfig>(defaultSeo);

  useEffect(() => {
    supabase.from("seo_config").select("*").single().then(({ data }) => {
      if (data) setSeo(data);
    });
  }, []);

  return (
    <SeoContext.Provider value={{ seo }}>
      {children}
    </SeoContext.Provider>
  );
};

export const useSeo = () => useContext(SeoContext);
