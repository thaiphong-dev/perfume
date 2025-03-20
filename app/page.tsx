import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import InstagramSection from "@/components/instagram-section"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function Home() {
  // Sample product data for the home page
  const skinCareProducts = [
    {
      id: 1,
      name: "Facial Cleanser",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200",
      isNew: true,
    },
    {
      id: 2,
      name: "Moisturizer",
      price: 34.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 15,
    },
    {
      id: 3,
      name: "Face Serum",
      price: 49.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Eye Cream",
      price: 39.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      name: "Face Mask",
      price: 24.99,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const trendingProducts = [
    {
      id: 6,
      name: "Perfume Collection",
      price: 59.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 7,
      name: "Body Lotion",
      price: 19.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 8,
      name: "Luxury Soap",
      price: 12.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 20,
    },
    {
      id: 9,
      name: "Hair Serum",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 10,
      name: "Perfume Mist",
      price: 39.99,
      image: "/placeholder.svg?height=200&width=200",
      isNew: true,
    },
  ]

  const accessoryProducts = [
    {
      id: 11,
      name: "Beauty Tool",
      price: 19.99,
      image: "/placeholder.svg?height=200&width=200",
      discount: 10,
    },
    {
      id: 12,
      name: "Makeup Brush",
      price: 14.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 13,
      name: "Face Roller",
      price: 24.99,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 14,
      name: "Makeup Sponge",
      price: 9.99,
      image: "/placeholder.svg?height=200&width=200",
      isNew: true,
    },
    {
      id: 15,
      name: "Cosmetic Bag",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-[#FFF5F2] px-4 py-12 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold text-[#4A3034] md:text-5xl lg:text-6xl">
                Reveal The <br />
                Beauty of Skin
              </h1>
              <p className="text-[#6D5D60] max-w-md">
                Discover our collection of premium skincare products designed to enhance your natural beauty
              </p>
              <div className="flex space-x-2">
                <span className="h-2 w-2 rounded-full bg-[#4A3034]"></span>
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              </div>
              <Button className="w-fit bg-[#4A3034] hover:bg-[#3A2024] text-white">Shop Now</Button>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Beauty products"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* Shop By Category */}
        <section className="px-4 py-12 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A3034]">Shop By Category</h2>
              <Link href="/categories" className="flex items-center text-sm text-[#4A3034]">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryCard
                title="Live In Fragrance"
                description="Discover our collection of premium fragrances"
                image="/placeholder.svg?height=300&width=300"
                bgColor="bg-[#F9F5FF]"
              />
              <CategoryCard
                title="Nature In Beauty"
                description="Natural ingredients for your skincare routine"
                image="/placeholder.svg?height=300&width=300"
                bgColor="bg-[#F0F9EB]"
              />
              <CategoryCard
                title="Best Personal Care"
                description="Premium products for your personal care"
                image="/placeholder.svg?height=300&width=300"
                bgColor="bg-[#FFE8F0]"
              />
            </div>
          </div>
        </section>

        {/* Skin Care Products */}
        <section className="px-4 py-8 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A3034]">Skin Care</h2>
              <Link href="/skin-care" className="flex items-center text-sm text-[#4A3034]">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {skinCareProducts.map((product) => (
                <ProductCard
                  key={`skincare-${product.id}`}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  discount={product.discount}
                  isNew={product.isNew}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="px-4 py-8 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A3034]">Trending</h2>
              <Link href="/trending" className="flex items-center text-sm text-[#4A3034]">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={`trending-${product.id}`}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  discount={product.discount}
                  isNew={product.isNew}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Sections */}
        <section className="px-4 py-8 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* You May Also Like */}
            <div className="rounded-lg bg-[#FFE8F0] p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="text-2xl font-bold text-[#4A3034]">You May Also Like</h3>
                  <p className="text-sm text-[#6D5D60]">
                    Discover our handpicked selection of products tailored just for you
                  </p>
                  <Button className="w-fit bg-[#4A3034] hover:bg-[#3A2024] text-white">Shop Now</Button>
                </div>
                <div className="relative h-[200px]">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Recommended products"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Customer Favorites */}
            <div className="rounded-lg bg-[#F5F5F5] p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="text-2xl font-bold text-[#4A3034]">Customer Favorite Beauty Essentials</h3>
                  <p className="text-sm text-[#6D5D60]">Top-rated products loved by our customers</p>
                  <Button className="w-fit bg-[#4A3034] hover:bg-[#3A2024] text-white">Shop Now</Button>
                </div>
                <div className="relative h-[200px]">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Customer favorites"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best New Accessories */}
        <section className="px-4 py-8 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A3034]">Best New Accessories</h2>
              <Link href="/accessories" className="flex items-center text-sm text-[#4A3034]">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {accessoryProducts.map((product) => (
                <ProductCard
                  key={`accessories-${product.id}`}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  discount={product.discount}
                  isNew={product.isNew}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Section */}
        <InstagramSection />
      </main>

      <Footer />
    </div>
  )
}

