"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/database";
import { Icons } from "@/components/icons";
import { useTranslations } from "next-intl";

const BLUR_FADE_DELAY = 0.04;

interface ProjectsSectionProps {
  projects?: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = useTranslations("home");

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">
                {t("projects_title")}
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t("projects_subtitle")}
            </h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              {t("projects_description")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto auto-rows-fr">
          {projects.map((project, id) => {
            const links: { type: string; href: string; icon: React.ReactNode }[] = [];
            if (project.url) {
              links.push({
                type: t("website"),
                href: project.url,
                icon: <Icons.globe className="size-3" />,
              });
            }
            if (project.source_url) {
              links.push({
                type: t("source"),
                href: project.source_url,
                icon: <Icons.github className="size-3" />,
              });
            }

            return (
              <BlurFade
                key={project.id || project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                className="h-full"
              >
                <ProjectCard
                  href={project.url}
                  title={project.title}
                  description={project.description}
                  dates=""
                  tags={project.technologies ?? []}
                  image={project.image_url}
                  links={links}
                />
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
