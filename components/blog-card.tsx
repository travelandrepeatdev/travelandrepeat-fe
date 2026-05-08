"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/app/app/lib/types";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary/30 to-accent/30">
        {blog.cover_image_url ? (
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <img
              src="/LOGO-EVA-CIRCULO.webp"
              alt="Travel Repeat"
              className="h-20 w-20 opacity-50"
            />
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        {formattedDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        )}
        <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/blogs/${blog.slug}`} className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-between text-primary hover:text-primary hover:bg-primary/5"
          >
            Leer mas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
