"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, User, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { useGetBlogDetailsQuery, useGetBlogListQuery } from "@/store/apis";

const CATEGORY_COLORS: Record<string, string> = {
  "Exam Preparation": "bg-blue-100 text-blue-700",
  "Study Guides": "bg-teal-100 text-teal-700",
  "Education News": "bg-amber-100 text-amber-700",
  "Student Tips": "bg-purple-100 text-purple-700",
};

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

// NOTE: URL-e ekhon post._id jay (slug na), karon backend endpoint
// /blog/details/{blogId} — ID chay, slug na. Tai route folder ekhon
// [blogId] (othoba [id]) hote hobe.
export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ blogId?: string; id?: string; slug?: string }>;
}) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.blogId ?? resolvedParams.id ?? resolvedParams.slug ?? "";

  const { data, isLoading, isError } = useGetBlogDetailsQuery(blogId, { skip: !blogId });
  const post = data?.data;

  // Sidebar-er "Most Read" / "Related" er jonno shob published post fetch
  const { data: listData } = useGetBlogListQuery(
    { status: "published", limit: 20 },
    { skip: !post }
  );
  const allPosts = useMemo(() => listData?.data?.data ?? [], [listData]);

  const related = useMemo(
    () => (post ? allPosts.filter((p) => p._id !== post._id && p.category === post.category).slice(0, 3) : []),
    [allPosts, post]
  );
  const mostRead = useMemo(
    () => (post ? allPosts.filter((p) => p._id !== post._id).slice(0, 4) : []),
    [allPosts, post]
  );

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    allPosts.forEach((p) => {
      const cat = p.category ?? "Uncategorized";
      map.set(cat, (map.get(cat) ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, [allPosts]);

  if (isError) notFound();

  if (isLoading || !post) {
    return (
      <section className="app-container flex-1 py-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="h-56 w-full animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </section>
    );
  }

 

  return (
    <section className="app-container flex-1 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href={ROUTES.BLOG} className="hover:text-primary">
          Blog
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-500">{post.category}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="max-w-xs truncate text-gray-700">{post.title}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main article */}
        <article className="min-w-0 flex-1">
          <span
            className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CATEGORY_COLORS[post.category ?? ""] ?? "bg-gray-100 text-gray-600"}`}
          >
            {post.category}
          </span>
          <h1 className="mb-4 text-2xl leading-tight font-extrabold text-gray-900">{post.title}</h1>
          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author || "Testora Team"}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            )}
          </div>

          {/* Hero image */}
          <div className="from-primary/5 mb-8 flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br to-indigo-100">
            {post.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200/50">
                <CalendarDays className="text-primary h-8 w-8" />
              </div>
            )}
          </div>

          {/* Intro */}
          <p className="mb-6 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>

          {/* Full content — backend jodi HTML/rich-text pathay tahole eভাবে render hobe.
              Plain text hole eta shudhu ekta paragraph hisebe dekhabe. */}
          <div
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Related Articles</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r._id}
                    href={`${ROUTES.BLOG}/${r._id}`}
                    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="from-primary/5 flex h-28 items-center justify-center bg-linear-to-br to-indigo-100">
                      <CalendarDays className="text-primary h-8 w-8" />
                    </div>
                    <div className="p-3">
                      <p className="mb-1 text-sm leading-snug font-bold text-gray-900">{r.title}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-400">
                        <CalendarDays className="h-3 w-3" /> {formatDate(r.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          {/* Search */}
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-gray-900">Search Articles</h3>
            <input
              type="text"
              placeholder="Search..."
              className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-gray-900">Categories</h3>
            <ul className="flex flex-col gap-1">
              {categoryCounts.map(([cat, count]) => (
                <li key={cat}>
                  <Link
                    href={ROUTES.BLOG}
                    className="flex justify-between rounded px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    <span>{cat}</span>
                    <span className="font-semibold text-gray-400">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Most Read */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-gray-900">Most Read</h3>
            <ul className="flex flex-col gap-3">
              {mostRead.map((p) => (
                <li key={p._id}>
                  <Link href={`${ROUTES.BLOG}/${p._id}`} className="group flex items-start gap-3">
                    <div className="bg-primary/5 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded">
                      <CalendarDays className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="group-hover:text-primary line-clamp-2 text-xs leading-snug font-medium text-gray-800">
                        {p.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-400">{formatDate(p.publishedAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}