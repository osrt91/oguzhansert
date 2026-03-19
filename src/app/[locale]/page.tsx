/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import { ArrowUpRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import {
  getProfile,
  getSkills,
  getWorkExperience,
  getEducation,
  getProjects,
  getHackathons,
} from "@/lib/content";

export const revalidate = 60;

const BLUR_FADE_DELAY = 0.04;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all data in parallel from Supabase
  const [profile, skills, work, education, projects, hackathons] =
    await Promise.all([
      getProfile(locale),
      getSkills(),
      getWorkExperience(locale),
      getEducation(locale),
      getProjects(locale),
      getHackathons(locale),
    ]);

  const name = profile?.name ?? "";
  const firstName = name.split(" ")[0] || "";
  const initials = profile?.initials ?? "";
  const description = profile?.description ?? "";
  const summary = profile?.summary ?? "";
  const avatarUrl = profile?.avatar_url ?? "/me.png";

  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={firstName ? `Hi, I'm ${firstName}` : "Welcome"}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage alt={name} src={avatarUrl} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {summary && (
        <section id="about">
          <div className="flex min-h-0 flex-col gap-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-xl font-bold">About</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                <Markdown>{summary}</Markdown>
              </div>
            </BlurFade>
          </div>
        </section>
      )}

      {work.length > 0 && (
        <section id="work">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold">Work Experience</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <WorkSection work={work} />
            </BlurFade>
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-xl font-bold">Education</h2>
            </BlurFade>
            <div className="flex flex-col gap-8">
              {education.map((edu, index) => (
                <BlurFade
                  key={edu.id || edu.school}
                  delay={BLUR_FADE_DELAY * 8 + index * 0.05}
                >
                  <Link
                    href={edu.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-3 justify-between group"
                  >
                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                      {edu.logo_url ? (
                        <img
                          src={edu.logo_url}
                          alt={edu.school}
                          className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                        />
                      ) : (
                        <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                      )}
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="font-semibold leading-none flex items-center gap-2">
                          {edu.school}
                          <ArrowUpRight
                            className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                            aria-hidden
                          />
                        </div>
                        <div className="font-sans text-sm text-muted-foreground">
                          {edu.degree}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                      <span>{edu.period}</span>
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section id="skills">
          <div className="flex min-h-0 flex-col gap-y-4">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
              <h2 className="text-xl font-bold">Skills</h2>
            </BlurFade>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, id) => (
                <BlurFade
                  key={skill.id || skill.name}
                  delay={BLUR_FADE_DELAY * 10 + id * 0.05}
                >
                  <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium">
                      {skill.name}
                    </span>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section id="projects">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <ProjectsSection projects={projects} />
          </BlurFade>
        </section>
      )}

      {hackathons.length > 0 && (
        <section id="hackathons">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <HackathonsSection hackathons={hackathons} />
          </BlurFade>
        </section>
      )}

      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection profile={profile} />
        </BlurFade>
      </section>
    </main>
  );
}
