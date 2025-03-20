"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Newsletter from "@/components/newsletter"
import ShopSidebar from "@/components/shop-sidebar"

export default function ShopPage() {
  const { addToCart } = useCartStore()
  const { toast } = useToast()
  const [sortOption, setSortOption] = useState("featured")

  // Sample product data
  const products = Array.from({ length: 16 }).map((_, i) => ({
    id: i + 100,
    name: "Perfume Name",
    brand: i % 4 === 0 ? "GABRIELA" : i % 4 === 1 ? "CHANEL" : i % 4 === 2 ? "DIOR" : "GUERLAIN",
    price: 99.99,
    image: "/placeholder.svg?height=200&width=200",
    isNew: i % 8 === 0,
    discount: i % 7 === 0 ? 15 : undefined,
  }))

  const handleAddToCart = (product: any) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
        image: product.image,
      },
      1,
    )

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-[#6D5D60]">
              <Link href="/" className="hover:text-[#4A3034]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-[#4A3034]">Shop</span>
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Sidebar - Mobile Toggle */}
            <div className="mb-4 lg:hidden">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Products
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
              <ShopSidebar />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4 xl:w-4/5">
              {/* Category Header */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold text-[#4A3034]">
                  <span className="text-[#6D5D60]">ALL &gt;</span> MEN PERFUMES
                </h1>
                <div className="mt-4 flex items-center sm:mt-0">
                  <span className="mr-2 text-sm text-[#6D5D60]">Sort by:</span>
                  <Select defaultValue={sortOption} onValueChange={(value) => setSortOption(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.isNew && (
                        <span className="absolute left-2 top-2 rounded bg-black px-1.5 py-0.5 text-xs font-medium text-white">
                          NEW
                        </span>
                      )}
                      {product.discount && (
                        <span className="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
                          -{product.discount}%
                        </span>
                      )}
                      <button className="absolute right-2 top-2 rounded-full bg-white p-1.5 opacity-70 transition-opacity hover:opacity-100">
                        <Heart className="h-4 w-4 text-[#4A3034]" />
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="mb-1 text-xs uppercase text-gray-500">{product.brand}</div>
                      <h3 className="mb-2 text-sm font-medium text-[#4A3034]">Product Name</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#4A3034]">${product.price.toFixed(2)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                          onClick={() => handleAddToCart(product)}
                        >
                          ADD TO CART
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="flex space-x-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    &lt;
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-[#4A3034] text-white">
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
            </div>
          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

