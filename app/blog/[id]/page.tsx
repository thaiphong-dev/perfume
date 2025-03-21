"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Tag,
  ChevronLeft,
  Facebook,
  Twitter,
  Instagram,
  Share2,
} from "lucide-react";
import { useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  authorImage: string;
  category: string;
  tags: string[];
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const { t } = useLanguageStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const blogPosts: BlogPost[] = [
      {
        id: 1,
        title: "10 Skincare Tips for Glowing Skin",
        excerpt:
          "Discover the secrets to achieving that perfect glow with these essential skincare tips.",
        content: `
          <p>Achieving that coveted glowing skin isn't just about genetics—it's about consistent care and the right approach. Here are our top 10 tips for radiant, healthy skin:</p>
          
          <h2>1. Cleanse Properly</h2>
          <p>Always cleanse your face morning and night. Use a gentle cleanser that doesn't strip your skin of its natural oils. Double cleansing in the evening is essential if you wear makeup or sunscreen.</p>
          
          <h2>2. Exfoliate Regularly</h2>
          <p>Exfoliation removes dead skin cells that can make your complexion look dull. Use a chemical exfoliant with AHAs or BHAs 2-3 times a week for best results.</p>
          
          <h2>3. Hydrate, Hydrate, Hydrate</h2>
          <p>Drink plenty of water throughout the day. Hydrated skin is plump, radiant skin. Aim for at least 8 glasses of water daily.</p>
          
          <h2>4. Never Skip Moisturizer</h2>
          <p>Even if you have oily skin, moisturizing is crucial. Choose a formula appropriate for your skin type and apply it while your skin is still slightly damp for better absorption.</p>
          
          <h2>5. Sunscreen is Non-Negotiable</h2>
          <p>UV damage is the number one cause of premature aging. Apply a broad-spectrum SPF 30+ sunscreen every day, rain or shine, and reapply every two hours when outdoors.</p>
          
          <h2>6. Incorporate Antioxidants</h2>
          <p>Vitamin C serums and other antioxidants protect your skin from environmental damage and brighten your complexion. Apply in the morning before sunscreen.</p>
          
          <h2>7. Don't Forget Your Neck and Décolletage</h2>
          <p>These areas show signs of aging quickly but are often neglected. Extend your skincare routine beyond your face to these areas.</p>
          
          <h2>8. Get Your Beauty Sleep</h2>
          <p>Your skin repairs itself while you sleep. Aim for 7-9 hours of quality sleep each night, and consider using a silk pillowcase to prevent creasing and friction.</p>
          
          <h2>9. Mind Your Diet</h2>
          <p>What you eat reflects on your skin. Incorporate foods rich in omega-3 fatty acids, antioxidants, and vitamins. Reduce sugar and processed food intake.</p>
          
          <h2>10. Manage Stress</h2>
          <p>Chronic stress can trigger inflammation and exacerbate skin conditions like acne, eczema, and psoriasis. Practice stress-reduction techniques like meditation, yoga, or deep breathing exercises.</p>
          
          <p>Remember, consistency is key when it comes to skincare. Results won't happen overnight, but with patience and dedication, you'll be on your way to that enviable glow!</p>
        `,
        image: "/placeholder.svg?height=600&width=1200",
        date: "2023-05-15",
        author: "Sarah Johnson",
        authorImage: "/placeholder.svg?height=100&width=100",
        category: "Skincare",
        tags: ["skincare", "beauty tips", "glowing skin"],
      },
      {
        id: 2,
        title: "The Ultimate Guide to Choosing the Right Perfume",
        excerpt:
          "Find your signature scent with our comprehensive guide to perfume selection.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "/placeholder.svg?height=600&width=1200",
        date: "2023-06-22",
        author: "Michael Chen",
        authorImage: "/placeholder.svg?height=100&width=100",
        category: "Fragrance",
        tags: ["perfume", "fragrance", "scent guide"],
      },
      {
        id: 3,
        title: "Summer Makeup Trends You Need to Try",
        excerpt:
          "Stay ahead of the curve with these hot summer makeup trends that are taking over the beauty world.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "/placeholder.svg?height=600&width=1200",
        date: "2023-07-10",
        author: "Emily Rodriguez",
        authorImage: "/placeholder.svg?height=100&width=100",
        category: "Makeup",
        tags: ["makeup", "summer trends", "beauty"],
      },
      {
        id: 4,
        title: "The Benefits of Natural Ingredients in Skincare",
        excerpt:
          "Learn why natural ingredients can make a significant difference in your skincare routine.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "/placeholder.svg?height=600&width=1200",
        date: "2023-08-05",
        author: "David Kim",
        authorImage: "/placeholder.svg?height=100&width=100",
        category: "Skincare",
        tags: ["natural skincare", "ingredients", "clean beauty"],
      },
    ];

    const currentPost = blogPosts.find(
      (p) => p.id === Number.parseInt(params.id)
    );
    setPost(currentPost || null);

    if (currentPost) {
      // Find related posts (same category or shared tags)
      const related = blogPosts
        .filter((p) => p.id !== currentPost.id)
        .filter(
          (p) =>
            p.category === currentPost.category ||
            p.tags.some((tag) => currentPost.tags.includes(tag))
        )
        .slice(0, 3);

      setRelatedPosts(related);
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-[#F9F9F9] py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-[#4A3034]">
              Post not found
            </h1>
            <Link href="/blog">
              <Button className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white">
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9]">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px]">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div
                className="flex flex-wrap items-center justify
-center space-x-4"
              >
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  {post.author}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/blog"
                className="mb-8 flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Blog
              </Link>

              <article className="rounded-lg bg-white p-6 shadow-sm">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-[#4A3034] prose-p:text-[#6D5D60]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>

                <Separator className="my-8" />

                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                  <div className="flex flex-wrap items-center space-x-2">
                    <Tag className="h-4 w-4 text-[#6D5D60]" />
                    {post.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-[#6D5D60]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-[#6D5D60]">Share:</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Instagram className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>

              {/* Author Bio */}
              <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      src={post.authorImage || "/placeholder.svg"}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#4A3034]">
                      {post.author}
                    </h3>
                    <p className="text-[#6D5D60]">
                      Beauty expert and skincare enthusiast with over 10 years
                      of experience in the beauty industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-white px-4 py-16 md:px-6 lg:px-8 xl:px-16">
            <div className="container mx-auto">
              <h2 className="mb-8 text-center text-3xl font-bold text-[#4A3034]">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                    <article className="overflow-hidden rounded-lg bg-[#F9F9F9] shadow-sm transition-transform hover:scale-[1.02]">
                      <div className="relative h-48 w-full">
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <Badge className="mb-2">{relatedPost.category}</Badge>
                        <h3 className="mb-2 text-lg font-bold text-[#4A3034]">
                          {relatedPost.title}
                        </h3>
                        <p className="mb-4 text-sm text-[#6D5D60]">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-sm font-medium text-[#4A3034]">
                          Read More{" "}
                          <ChevronLeft className="ml-1 h-4 w-4 rotate-180" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
