import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getBlogPost, getBlogPosts, getProfile } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}): Promise<Metadata | undefined> {
  const { locale, slug } = await params;
  const [post, profile] = await Promise.all([
    getBlogPost(locale, slug),
    getProfile(locale),
  ]);

  if (!post) {
    return undefined;
  }

  const siteUrl = profile?.social_links?.website || "https://oguzhansert.dev";

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      url: `${siteUrl}/blog/${slug}`,
      ...(post.cover_image_url && {
        images: [{ url: post.cover_image_url }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      ...(post.cover_image_url && {
        images: [post.cover_image_url],
      }),
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, allPosts, profile] = await Promise.all([
    getBlogPost(locale, slug),
    getBlogPosts(locale),
    getProfile(locale),
  ]);

  if (!post) {
    notFound();
  }

  // Find prev/next posts in the sorted list
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const siteUrl = profile?.social_links?.website || "https://oguzhansert.dev";
  const authorName = profile?.name || "Author";

  const jsonLdContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    description: post.summary,
    image:
      post.cover_image_url ||
      `${siteUrl}/blog/${slug}/opengraph-image`,
    url: `${siteUrl}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: authorName,
    },
  }).replace(/</g, "\\u003c");

  return (
    <section id="blog">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: jsonLdContent,
        }}
      />
      <div className="flex justify-start gap-4 items-center">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2 py-1 inline-flex items-center gap-1 mb-6 group"
          aria-label="Back to Blog"
        >
          <ChevronLeft className="size-3 group-hover:-translate-x-px transition-transform" />
          Back to Blog
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="title font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {post.published_at ? formatDate(post.published_at) : ""}
        </p>
      </div>
      <div className="my-6 flex w-full items-center">
        <div
          className="flex-1 h-px bg-border"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        />
      </div>
      <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
        <Markdown>{post.content}</Markdown>
      </article>

      <nav className="mt-12 pt-8 max-w-2xl">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {previousPost ? (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="group flex-1 flex flex-col gap-1 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChevronLeft className="size-3" />
                Previous
              </span>
              <span className="text-sm font-medium group-hover:text-foreground transition-colors whitespace-normal wrap-break-word">
                {previousPost.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex-1 flex flex-col gap-1 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-right"
            >
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                Next
                <ChevronRight className="size-3" />
              </span>
              <span className="text-sm font-medium group-hover:text-foreground transition-colors whitespace-normal wrap-break-word">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}
        </div>
      </nav>
    </section>
  );
}
