import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Golang } from "@/components/ui/svgs/golang";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Java } from "@/components/ui/svgs/java";
import { Csharp } from "@/components/ui/svgs/csharp";

const DATA_TR = {
  name: "Oğuzhan Sert",
  description:
    "Teknoloji Girişimcisi & Yazılım Geliştirici | SaaS, E-Ticaret ve B2B Çözümleri | Kozmetik Ambalaj Üretimi",
  summary:
    "Geleneksel \"yazılımcı\" tanımının ötesinde, kendi dijital ekosistemlerini sıfırdan inşa eden ve yöneten bir ürün mimarıyım. Sadece kod yazmıyor; uçtan uca geliştirdiğim web teknolojilerini kullanarak B2B üretim hatlarından, oyunlaştırılmış SaaS platformlarına ve özel altyapılı e-ticaret sistemlerine kadar farklı sektörlerde sürdürülebilir iş modelleri kuruyorum.",
};

const DATA_EN = {
  name: "Oguzhan Sert",
  description:
    "Tech Entrepreneur & Software Developer | SaaS, E-Commerce & B2B Solutions | Cosmetic Packaging Manufacturing",
  summary:
    "Beyond the traditional \"developer\" label, I'm a product architect who builds and manages entire digital ecosystems from scratch. I don't just write code — I create sustainable business models across different industries, from B2B production lines and gamified SaaS platforms to custom-built e-commerce systems, using end-to-end web technologies.",
};

export function getLocalizedData(locale: string) {
  return locale === "en" ? DATA_EN : DATA_TR;
}

export const DATA = {
  name: "Oğuzhan Sert",
  initials: "OS",
  url: "https://oguzhansert.dev",
  location: "İstanbul",
  locationLink: "https://www.google.com/maps/place/istanbul",
  description: DATA_TR.description,
  summary: DATA_TR.summary,
  avatarUrl: "/me.png",
  skills: [
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Typescript", icon: Typescript },
    { name: "Node.js", icon: Nodejs },
    { name: "Python", icon: Python },
    { name: "Go", icon: Golang },
    { name: "Postgres", icon: Postgresql },
    { name: "Docker", icon: Docker },
    { name: "Kubernetes", icon: Kubernetes },
    { name: "Java", icon: Java },
    { name: "C#", icon: Csharp },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "info@oguzhansert.dev",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/osrt91",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/osrt91/",
        icon: Icons.linkedin,
        navbar: true,
      },
      Instagram: {
        name: "Instagram",
        url: "https://instagram.com/osrt91",
        icon: Icons.instagram,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:info@oguzhansert.dev",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [],
  education: [],
  projects: [],
} as const;
