"use client"
import { ChevronRight } from "lucide-react";
import Titlebar from "../common/Titlebar";
import { useGetBlogListQuery } from "@/store/apis";
import Image from "next/image";
import { ROUTES } from "@/constants";
import Link from "next/link";

const posts = [
  {
    title: "10 Essential Tips for Matura Exam Success",
    excerpt:
      "Discover proven strategies and techniques to maximize your performance in the national Matura exam.",
    date: "Mar 8, 2026",
    readTime: "5 min read",
    color: "from-amber-100 to-orange-200",
  },
  {
    title: "Understanding University Entrance Exam Requirements",
    excerpt:
      "A comprehensive guide to entrance exam requirements across different universities and faculties.",
    date: "Mar 5, 2026",
    readTime: "7 min read",
    color: "from-teal-100 to-cyan-200",
  },
  {
    title: "How Technology is Transforming Exam Preparation",
    excerpt:
      "Explore how digital learning platforms are helping students prepare for their exams more effectively.",
    date: "Mar 1, 2026",
    readTime: "4 min read",
    color: "from-blue-100 to-indigo-200",
  },
];

function Blog() {
  const { data, isLoading } = useGetBlogListQuery({ status: "published", limit: 3 });

  console.log(data?.data?.data);

  return (
    <section className="bg-blue-50/60 py-16 md:py-20">
      <div className="app-container">
        <Titlebar
          title="Latest from Our Blog"
          description="Tips, strategies, and insights to help you succeed"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {data?.data?.data?.map((post: any) => (
            <div
              key={post._id}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <Image
                src={post.image}
                width={900}
                height={192}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h4 className="mb-2 font-bold text-gray-900">{post.title}</h4>
                <p className="mb-3 flex-1 text-sm text-gray-500">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <Link
                    key={post._id}
                    href={`${ROUTES.BLOG}/${post._id}`}>
                    <button className="text-primary flex items-center gap-1 text-xs font-medium hover:underline">
                      Read More <ChevronRight className="h-3 w-3" />
                    </button>
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;
