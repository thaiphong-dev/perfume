"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, User, ChevronRight } from "lucide-react";
import { useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Newsletter from "@/components/newsletter";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
}

export default function BlogPage() {
  const { t } = useLanguageStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Skincare Tips for Glowing Skin",
      excerpt:
        "Discover the secrets to achieving that perfect glow with these essential skincare tips.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/placeholder.svg?height=400&width=600",
      date: "2023-05-15",
      author: "Sarah Johnson",
      category: "Skincare",
      tags: ["skincare", "beauty tips", "glowing skin"],
    },
    {
      id: 2,
      title: "The Ultimate Guide to Choosing the Right Perfume",
      excerpt:
        "Find your signature scent with our comprehensive guide to perfume selection.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/placeholder.svg?height=400&width=600",
      date: "2023-06-22",
      author: "Michael Chen",
      category: "Fragrance",
      tags: ["perfume", "fragrance", "scent guide"],
    },
    {
      id: 3,
      title: "Summer Makeup Trends You Need to Try",
      excerpt:
        "Stay ahead of the curve with these hot summer makeup trends that are taking over the beauty world.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/placeholder.svg?height=400&width=600",
      date: "2023-07-10",
      author: "Emily Rodriguez",
      category: "Makeup",
      tags: ["makeup", "summer trends", "beauty"],
    },
    {
      id: 4,
      title: "The Benefits of Natural Ingredients in Skincare",
      excerpt:
        "Learn why natural ingredients can make a significant difference in your skincare routine.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/placeholder.svg?height=400&width=600",
      date: "2023-08-05",
      author: "David Kim",
      category: "Skincare",
      tags: ["natural skincare", "ingredients", "clean beauty"],
    },
    {
      id: 5,
      title: "How to Create a Sustainable Beauty Routine",
      excerpt:
        "Reduce your environmental impact with these tips for a more sustainable beauty regimen.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/placeholder.svg?height=400&width=600",
      date: "2023-09-18",
      author: "Olivia Martinez",
      category: "Sustainability",
      tags: ["sustainable beauty", "eco-friendly", "green beauty"],
    },
    {
      id: 6,
      title: "The Science Behind Anti-Aging Products",
      excerpt:
        "Understand the research and ingredients that make anti-aging products effective.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/placeholder.svg?height=400&width=600",
      date: "2023-10-07",
      author: "James Wilson",
      category: "Skincare",
      tags: ["anti-aging", "skincare science", "ingredients"],
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Skincare", label: "Skincare" },
    { value: "Makeup", label: "Makeup" },
    { value: "Fragrance", label: "Fragrance" },
    { value: "Sustainability", label: "Sustainability" },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9]">
        {/* Hero Section */}
        <section className="bg-[#FFF5F2] px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-[#4A3034] md:text-5xl">
              NIRE Beauty Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6D5D60]">
              Discover the latest beauty trends, skincare tips, and product
              insights from our experts.
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t("search_blog")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="mt-2 sm:ml-2 sm:mt-0 sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Link href={`/blog/${post.id}`} key={post.id}>
                    <article className="overflow-hidden rounded-lg bg-white shadow-sm transition-transform hover:scale-[1.02]">
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="mb-2 flex items-center space-x-4 text-xs text-[#6D5D60]">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {post.author}
                          </span>
                        </div>
                        <Badge className="mb-2">{post.category}</Badge>
                        <h2 className="mb-2 text-xl font-bold text-[#4A3034]">
                          {post.title}
                        </h2>
                        <p className="mb-4 text-sm text-[#6D5D60]">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-sm font-medium text-[#4A3034]">
                          Read More <ChevronRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-medium text-[#4A3034]">
                  {t("no_posts_found")}
                </h2>
                <p className="mt-2 text-[#6D5D60]">
                  {t("try_different_search")}
                </p>
                <Button
                  className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                  }}
                >
                  {t("clear_filters")}
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex space-x-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    &lt;
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-[#4A3034] text-white"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    &gt;
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </section>

        {/* Featured Posts */}
        <section className="bg-white px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#4A3034]">
              Featured Posts
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <article className="overflow-hidden rounded-lg bg-[#F9F9F9] shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <Badge className="mb-2">{post.category}</Badge>
                      <h3 className="mb-2 text-lg font-bold text-[#4A3034]">
                        {post.title}
                      </h3>
                      <p className="mb-4 text-sm text-[#6D5D60]">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-sm font-medium text-[#4A3034]">
                        Read More <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#4A3034]">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {categories.slice(1).map((category) => (
                <div
                  key={category.value}
                  className="rounded-lg bg-white p-6 text-center shadow-sm transition-colors hover:bg-[#FFE8F0]"
                  onClick={() => setCategoryFilter(category.value)}
                >
                  <h3 className="text-lg font-bold text-[#4A3034]">
                    {category.label}
                  </h3>
                  <p className="mt-2 text-sm text-[#6D5D60]">
                    {
                      blogPosts.filter(
                        (post) => post.category === category.value
                      ).length
                    }{" "}
                    Articles
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
