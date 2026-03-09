import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { useContent } from "../context/ContentProvider";

const SocialIcons = () => {
  const { siteConfig } = useContent();

  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);
        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      updatePosition();
    });
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {siteConfig.github_url && (
          <span>
            <a href={siteConfig.github_url} target="_blank">
              <FaGithub />
            </a>
          </span>
        )}
        {siteConfig.linkedin_url && (
          <span>
            <a href={siteConfig.linkedin_url} target="_blank">
              <FaLinkedinIn />
            </a>
          </span>
        )}
        {siteConfig.twitter_url && (
          <span>
            <a href={siteConfig.twitter_url} target="_blank">
              <FaXTwitter />
            </a>
          </span>
        )}
        {siteConfig.instagram_url && (
          <span>
            <a href={siteConfig.instagram_url} target="_blank">
              <FaInstagram />
            </a>
          </span>
        )}
      </div>
      {siteConfig.resume_url && siteConfig.resume_url !== "#" && (
        <a className="resume-button" href={siteConfig.resume_url} target="_blank">
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      )}
    </div>
  );
};

export default SocialIcons;
