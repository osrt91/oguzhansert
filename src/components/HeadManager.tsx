import { useEffect } from "react";
import { useLang } from "../context/LanguageProvider";
import { useSeo } from "../context/SeoProvider";

const HeadManager = () => {
  const { lang } = useLang();
  const { seo } = useSeo();

  useEffect(() => {
    const description = lang === "tr" ? seo.site_description_tr : seo.site_description_en;
    const title = lang === "tr"
      ? "Oguzhan Sert - Gelistirici & Urun Yapimcisi"
      : "Oguzhan Sert - Creative Developer & Product Builder";

    document.title = title;
    document.documentElement.lang = lang;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:locale", lang === "tr" ? "tr_TR" : "en_US");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    if (seo.og_image_url) {
      setMeta("property", "og:image", seo.og_image_url);
      setMeta("name", "twitter:image", seo.og_image_url);
    }
  }, [lang, seo]);

  useEffect(() => {
    if (!seo.ga_measurement_id) return;
    if (document.querySelector(`script[src*="googletagmanager"]`)) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${seo.ga_measurement_id}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement("script");
    inlineScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${seo.ga_measurement_id}');
    `;
    document.head.appendChild(inlineScript);
  }, [seo.ga_measurement_id]);

  useEffect(() => {
    if (!seo.meta_pixel_id) return;
    if (document.querySelector(`script[data-pixel]`)) return;

    const script = document.createElement("script");
    script.setAttribute("data-pixel", "true");
    script.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${seo.meta_pixel_id}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, [seo.meta_pixel_id]);

  return null;
};

export default HeadManager;
