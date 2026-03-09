import { useContent } from "../context/ContentProvider";
import "./styles/About.css";

const About = () => {
  const { about } = useContent();

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{about.title}</h3>
        <p className="para">{about.body}</p>
      </div>
    </div>
  );
};

export default About;
