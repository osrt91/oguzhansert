import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { useContent } from "../context/ContentProvider";
import { useLang } from "../context/LanguageProvider";
import "./styles/Contact.css";

const Contact = () => {
  const { siteConfig } = useContent();
  const { t } = useLang();

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{t("İletişim", "Contact")}</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>{t("E-posta", "Email")}</h4>
            <p>
              <a href={`mailto:${siteConfig.email}`} data-cursor="disable">
                {siteConfig.email}
              </a>
            </p>
            {siteConfig.phone && (
              <>
                <h4>{t("Telefon", "Phone")}</h4>
                <p>
                  <a href={`tel:${siteConfig.phone}`} data-cursor="disable">
                    {siteConfig.phone}
                  </a>
                </p>
              </>
            )}
          </div>
          <div className="contact-box">
            <h4>{t("Sosyal", "Social")}</h4>
            {siteConfig.github_url && (
              <a href={siteConfig.github_url} target="_blank" data-cursor="disable" className="contact-social">
                Github <MdArrowOutward />
              </a>
            )}
            {siteConfig.linkedin_url && (
              <a href={siteConfig.linkedin_url} target="_blank" data-cursor="disable" className="contact-social">
                Linkedin <MdArrowOutward />
              </a>
            )}
            {siteConfig.twitter_url && (
              <a href={siteConfig.twitter_url} target="_blank" data-cursor="disable" className="contact-social">
                Twitter <MdArrowOutward />
              </a>
            )}
            {siteConfig.instagram_url && (
              <a href={siteConfig.instagram_url} target="_blank" data-cursor="disable" className="contact-social">
                Instagram <MdArrowOutward />
              </a>
            )}
          </div>
          <div className="contact-box">
            <h2>
              {siteConfig.footer_text.split(" by ").length > 1 ? (
                <>
                  {siteConfig.footer_text.split(" by ")[0]} <br /> by <span>{siteConfig.footer_text.split(" by ")[1]}</span>
                </>
              ) : (
                siteConfig.footer_text
              )}
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
