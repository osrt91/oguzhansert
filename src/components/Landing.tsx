import { PropsWithChildren } from "react";
import { useContent } from "../context/ContentProvider";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const { hero } = useContent();

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>{hero.greeting}</h2>
            <h1>
              {hero.name_line1}
              <br />
              <span>{hero.name_line2}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>{hero.subtitle_prefix}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{hero.subtitle_role1}</div>
              <div className="landing-h2-2">{hero.subtitle_role2}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{hero.subtitle_role2}</div>
              <div className="landing-h2-info-1">{hero.subtitle_role1}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
