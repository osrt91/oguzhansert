import { useContent } from "../context/ContentProvider";
import { useLang } from "../context/LanguageProvider";
import "./styles/Career.css";

const Career = () => {
  const { career } = useContent();
  const { t } = useLang();

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          {t("Kariyerim", "My career")} <span>&</span>
          <br /> {t("deneyimim", "experience")}
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {career.map((entry) => (
            <div className="career-info-box" key={entry.id}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{entry.position}</h4>
                  <h5>{entry.company}</h5>
                </div>
                <h3>{entry.year}</h3>
              </div>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
