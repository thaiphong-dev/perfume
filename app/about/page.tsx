"use client";

import Image from "next/image";
import { useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Newsletter from "@/components/newsletter";

export default function AboutPage() {
  const { t } = useLanguageStore();

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Sarah founded NIRE with a vision to create natural, effective beauty products that enhance natural beauty.",
    },
    {
      name: "Michael Chen",
      role: "Chief Product Officer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Michael oversees product development, ensuring each NIRE product meets our high standards of quality and effectiveness.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Research",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Emily leads our research team, discovering innovative ingredients and formulations for our skincare products.",
    },
    {
      name: "David Kim",
      role: "Creative Director",
      image: "/placeholder.svg?height=300&width=300",
      bio: "David is responsible for NIRE's brand identity, packaging design, and overall aesthetic vision.",
    },
  ];

  const values = [
    {
      title: "Natural Beauty",
      description:
        "We believe in enhancing your natural beauty, not masking it. Our products are designed to bring out the best in your skin.",
      icon: "✨",
    },
    {
      title: "Sustainability",
      description:
        "We're committed to sustainable practices, from responsibly sourced ingredients to eco-friendly packaging.",
      icon: "🌱",
    },
    {
      title: "Innovation",
      description:
        "We continuously research and develop new formulations that combine the best of nature and science.",
      icon: "🔬",
    },
    {
      title: "Inclusivity",
      description:
        "Beauty comes in all forms. We create products that work for everyone, regardless of skin type, tone, or age.",
      icon: "🤝",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#FFF5F2] px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-[#4A3034] md:text-5xl lg:text-6xl">
                  Our Story
                </h1>
                <p className="mt-6 max-w-md text-lg text-[#6D5D60]">
                  Founded in 2015, NIRE Beauty was born from a passion for
                  creating premium beauty products that enhance natural beauty
                  while being kind to the planet.
                </p>
                <Button className="mt-8 w-fit bg-[#4A3034] hover:bg-[#3A2024] text-white">
                  Discover Our Products
                </Button>
              </div>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="NIRE Beauty founder"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-[#4A3034]">Our Mission</h2>
              <p className="mt-6 text-lg text-[#6D5D60]">
                At NIRE, our mission is to empower individuals to feel confident
                in their own skin. We create high-quality, effective beauty
                products that enhance natural beauty while being mindful of our
                impact on the planet. We believe that beauty should be
                accessible, inclusive, and sustainable.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-[#F9F9F9] px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#4A3034]">
              Our Values
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE8F0] text-2xl">
                    {value.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#4A3034]">
                    {value.title}
                  </h3>
                  <p className="text-[#6D5D60]">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#4A3034]">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative mx-auto mb-4 h-64 w-64 overflow-hidden rounded-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#4A3034]">
                    {member.name}
                  </h3>
                  <p className="mb-2 text-[#6D5D60]">{member.role}</p>
                  <p className="text-sm text-[#6D5D60]">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="bg-[#F9F9F9] px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#4A3034]">
              Our Journey
            </h2>
            <div className="mx-auto max-w-3xl">
              <div className="relative border-l border-[#4A3034] pl-8 pb-8">
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-[#4A3034]"></div>
                <h3 className="text-xl font-bold text-[#4A3034]">
                  2015: The Beginning
                </h3>
                <p className="mt-2 text-[#6D5D60]">
                  NIRE Beauty was founded in a small apartment with just three
                  skincare products.
                </p>
              </div>
              <div className="relative border-l border-[#4A3034] pl-8 pb-8">
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-[#4A3034]"></div>
                <h3 className="text-xl font-bold text-[#4A3034]">
                  2017: Expansion
                </h3>
                <p className="mt-2 text-[#6D5D60]">
                  We expanded our product line to include makeup and fragrances,
                  and opened our first physical store.
                </p>
              </div>
              <div className="relative border-l border-[#4A3034] pl-8 pb-8">
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-[#4A3034]"></div>
                <h3 className="text-xl font-bold text-[#4A3034]">
                  2019: Going Global
                </h3>
                <p className="mt-2 text-[#6D5D60]">
                  NIRE Beauty products became available internationally,
                  reaching customers in over 20 countries.
                </p>
              </div>
              <div className="relative border-l border-[#4A3034] pl-8">
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-[#4A3034]"></div>
                <h3 className="text-xl font-bold text-[#4A3034]">
                  2023: Sustainability Commitment
                </h3>
                <p className="mt-2 text-[#6D5D60]">
                  We pledged to make all our packaging recyclable or
                  biodegradable by 2025 and launched our eco-friendly product
                  line.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Team */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="rounded-lg bg-[#FFE8F0] p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold text-[#4A3034]">
                    Join Our Team
                  </h2>
                  <p className="mt-4 text-[#6D5D60]">
                    We're always looking for passionate individuals to join our
                    growing team. Check out our current openings or send us your
                    resume for future opportunities.
                  </p>
                  <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">
                      View Openings
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                    >
                      Send Resume
                    </Button>
                  </div>
                </div>
                <div className="relative h-[200px] md:h-auto">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="NIRE Beauty team"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
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
