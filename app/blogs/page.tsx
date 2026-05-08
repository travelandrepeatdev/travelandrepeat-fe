"use client";

import { useEffect, useState } from "react";
import { QuoteHeader } from "@/components/quote-header";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { BlogHero } from "@/components/blog-hero";
import { publicApi } from "@/app/app/lib/api";
import type { Blog } from "@/app/app/lib/types";
import { Spinner } from "@/components/ui/spinner";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await publicApi.getPublishedBlogs();
        const mapped = response.map((d) => ({
          ...d,
          cover_image_url: d.cover_image_url ? apiBaseUrl + d.cover_image_url : null,
        }));
        setBlogs(mapped);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <QuoteHeader />
      <BlogHero />

      {/* Blog List Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner className="size-12 text-primary" />
                <p className="mt-4 text-muted-foreground">Cargando blogs...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl text-muted-foreground">
                  Pronto tendremos contenido increible para ti.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Estamos trabajando en nuevos articulos.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
