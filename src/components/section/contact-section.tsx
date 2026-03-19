import Link from "next/link";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import type { Profile } from "@/types/database";

interface ContactSectionProps {
  profile?: Profile | null;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  // Try to get a social link for the contact CTA
  const socialUrl =
    profile?.social_links?.X ||
    profile?.social_links?.x ||
    profile?.social_links?.Twitter ||
    profile?.social_links?.twitter ||
    profile?.social_links?.LinkedIn ||
    profile?.social_links?.linkedin ||
    "#";

  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Get in Touch
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground text-balance">
          Want to chat? Just shoot me a dm{" "}
          <Link
            href={socialUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            with a direct question on twitter
          </Link>{" "}
          and I&apos;ll respond whenever I can. I will ignore all soliciting.
        </p>
      </div>
    </div>
  );
}
