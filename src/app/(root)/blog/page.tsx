"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";
import PageHero from "@/components/common/PageHero";
import { useGetBlogListQuery } from "@/store/apis";
import Image from "next/image";

const CATEGORY_COLORS: Record<string, string> = {
  "Exam Preparation": "bg-blue-100 text-blue-700",
  "Study Guides": "bg-teal-100 text-teal-700",
  "Education News": "bg-amber-100 text-amber-700",
  "Student Tips": "bg-purple-100 text-purple-700",
};

const CARD_GRADIENTS = [
  "from-blue-100 to-indigo-200",
  "from-amber-100 to-orange-200",
  "from-teal-100 to-cyan-200",
  "from-purple-100 to-violet-200",
  "from-rose-100 to-pink-200",
  "from-gray-200 to-slate-200",
];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [visibleCount, setVisibleCount] = useState(6);

  // Shudhu "published" post dekhano hocche
  const { data, isLoading } = useGetBlogListQuery({ status: "published", limit: 100 });
  const posts = useMemo(() => data?.data?.data ?? [], [data]);

  // Category list, real post data theke dynamically ber kora
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["All Articles", ...Array.from(set)];
  }, [posts]);

  const featured = posts.find((p) => p.isFeatured) ?? posts[0];
  const regular = posts.filter((p) => p._id !== featured?._id);

  const filtered =
    activeCategory === "All Articles"
      ? regular
      : regular.filter((p) => p.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);

  console.log(featured?.image)

  return (
    <section className="flex-1">
      {/* Hero */}
      <PageHero
        title="Blog"
        description="News, updates and guidance related to school exams and university entrance tests"
      />

      <div className="app-container py-8 sm:py-10">
        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveCategory(c as string);
                setVisibleCount(6);
              }}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${activeCategory === c
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center text-sm text-gray-400">
            No articles published yet.
          </div>
        ) : (
          <>
            {/* Featured article */}
            {activeCategory === "All Articles" && featured && (
              <Link
                href={`${ROUTES.BLOG}/${featured._id}`}
                className="mb-8 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs md:flex-row"
              >
                {
                  featured.image ?
                    <Image src={featured.image} width={320} height={192} alt={featured.title} className="h-48 w-[30%] object-cover" /> :
                    <div className="from-primary/10 to-primary2/10 flex h-48 w-full items-center justify-center bg-linear-to-br md:h-auto md:w-80 md:shrink-0">
                      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                        {/* <CalendarDays className="text-primary h-8 w-8" /> */}
                      </div>
                      <div className="text-primary ml-3 text-sm font-medium">Featured Article</div>
                    </div>

                }

                <div className="flex flex-col justify-center p-6">
                  <span
                    className={`mb-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CATEGORY_COLORS[featured.category ?? ""] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {featured.category}
                  </span>
                  <h2 className="mb-2 text-xl font-extrabold text-gray-900">{featured.title}</h2>
                  <p className="mb-4 text-sm text-gray-500">{featured.excerpt}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(featured.publishedAt)}
                      </span>
                      {featured.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featured.readTime}
                        </span>
                      )}
                    </div>
                    <span className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline">
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Regular grid */}
            {visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
                No articles found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {visible.map((post, i) => (
                  <Link
                    key={post._id}
                    href={`${ROUTES.BLOG}/${post._id}`}
                    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >

                    {
                      post?.image ?
                        <Image src={post.image} width={320} height={192} alt={post.title} className="h-48 w-[30%] object-cover" /> :
                        <div
                          className={`flex h-40 items-center justify-center bg-linear-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`}
                        >
                          <CalendarDays className="h-10 w-10 text-blue-400/60" />
                        </div>

                    }



                    <div className="flex flex-1 flex-col p-4">
                      <span
                        className={`mb-2 inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[post.category ?? ""] ?? "bg-gray-200 text-gray-600"}`}
                      >
                        {post.category}
                      </span>
                      <h3 className="mb-2 text-sm leading-snug font-bold text-gray-900">
                        {post.title}
                      </h3>
                      <p className="mb-3 line-clamp-3 flex-1 text-xs leading-relaxed text-gray-500">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="text-primary flex items-center gap-1 text-xs font-medium hover:underline">
                          Read More <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {visibleCount < filtered.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount((n) => n + 3)}
                  className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}