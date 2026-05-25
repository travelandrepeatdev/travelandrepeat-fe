"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Clock } from "lucide-react";
import { QuoteHeader } from "@/components/quote-header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { publicApi } from "@/app/app/lib/api";
import type { Blog } from "@/app/app/lib/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await publicApi.getBlogBySlug(slug);
        setBlog(response);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const formattedDate = blog?.published_at
    ? new Date(blog.published_at).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Estimate reading time (approx. 200 words per minute)
  const readingTime = blog?.content
    ? Math.ceil(blog.content.split(/\s+/).length / 200)
    : 0;

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <>
      <QuoteHeader />

      <main className="min-h-screen bg-background">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Spinner className="size-12 text-primary" />
            <p className="mt-4 text-muted-foreground">Cargando articulo...</p>
          </div>
        ) : error || !blog ? (
          <div className="container px-4 py-20 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                Articulo no encontrado
              </h1>
              <p className="text-muted-foreground mb-8">
                Lo sentimos, el articulo que buscas no existe o ha sido
                eliminado.
              </p>
              <Link href="/blogs">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al blog
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section with Cover Image */}
            <section className="relative overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-accent/50">
              {blog.cover_image_url && (
                <div className="absolute inset-0">
                  <img
                    src={(apiBaseUrl + blog.cover_image_url) || "/placeholder.svg"}
                    alt={blog.title}
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
                </div>
              )}

              <div className="container relative px-4 py-16 md:py-24 md:px-6">
                <div className="mx-auto max-w-3xl">
                  <Link href="/blogs">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver al blog
                    </Button>
                  </Link>

                  <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance mb-6">
                    {blog.title}
                  </h1>

                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {blog.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {formattedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                    {readingTime > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{readingTime} min de lectura</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="ml-auto gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </div>

            </section>

            {/* Blog Content */}
            <article className="container px-4 py-12 md:py-16 md:px-6">
              <div className="mx-auto max-w-3xl">
                {/* Featured Image */}
                {blog.cover_image_url && (
                  <div className="mb-12 overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={(apiBaseUrl + blog.cover_image_url) || "/placeholder.svg"}
                      alt={blog.title}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <div
                    className="text-foreground leading-relaxed whitespace-pre-wrap"
                    style={{ lineHeight: "1.8" }}
                  >
                    {blog.content.split("\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className={`mb-4 ${paragraph.trim() === "" ? "h-4" : ""}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Back to Blog */}
                <div className="mt-16 border-t border-border pt-8">
                  <Link href="/blogs">
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Ver mas articulos
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
