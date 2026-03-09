import { useLang } from "../context/LanguageProvider";

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <button
      className="lang-switcher"
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      data-cursor="disable"
      aria-label="Switch language"
    >
      {lang === "tr" ? "EN" : "TR"}
    </button>
  );
};

export default LanguageSwitcher;
