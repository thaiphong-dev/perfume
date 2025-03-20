"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Newsletter from "@/components/newsletter"
import RelatedProducts from "@/components/related-products"

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { toast } = useToast()
  const { addToCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // This would normally come from a database or API
  const product = {
    id: 1,
    slug: params.slug,
    name: "Vétiver Géranium",
    subtitle: "EAU DE PERFUME 100 ML",
    price: 560.0,
    currency: "SAR",
    rating: 5,
    reviewCount: 13,
    description: `Sunlight on skin. Crisp linen sheets. Vetiver Geranium opens with an airy, citrusy burst of grapefruit and bergamot, followed by the fragrant complexity of Haitian vetiver. Capturing the wild vetiver that adorns the majestic mountains of Haiti brings a distinctive, earthy element to this fragrance. 

The middle notes of Vetiver Geranium are infused with the soothing essence of geranium, to create a woody, aromatic heart. The base notes of amber and musk provide a warm, sensual foundation that allows the vetiver to shine even stronger and more bold to make of this scent, utter and result.

That might be quite some and create a nice fragrance all combined.`,
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
    )

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
    })
  }

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
    )

    // Redirect to checkout page
    window.location.href = "/checkout"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8">
          <nav className="flex text-sm text-[#6D5D60]">
            <Link href="/" className="hover:text-[#4A3034]">
              HOME
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-[#4A3034]">
              PERFUMES
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop/men" className="hover:text-[#4A3034]">
              MEN PERFUMES
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-[#4A3034]">VETIVER PERFUMES</span>
          </nav>
        </div>

        {/* Product Detail */}
        <section className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex space-x-2 overflow-auto">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${
                      index === selectedImage ? "border-[#4A3034]" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#4A3034]">{product.name}</h1>
                <p className="mt-1 text-lg text-[#6D5D60]">{product.subtitle}</p>
              </div>

              {/* Ratings */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#4A3034] text-[#4A3034]" />
                  ))}
                </div>
                <span className="text-sm text-[#6D5D60]">({product.reviewCount} Customer Reviews)</span>
              </div>

              {/* Price */}
              <div className="text-xl font-bold text-[#4A3034]">
                {product.currency}
                {product.price.toFixed(2)}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#4A3034]">QTY</p>
                <div className="flex w-32 items-center">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4 text-[#4A3034]" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="h-10 w-12 border-y border-gray-300 bg-white text-center text-sm"
                  />
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4 text-[#4A3034]" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white" onClick={handleAddToCart}>
                  Add Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b bg-transparent p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-[#4A3034] data-[state=active]:bg-transparent"
                >
                  DESCRIPTION
                </TabsTrigger>
                <TabsTrigger
                  value="information"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-[#4A3034] data-[state=active]:bg-transparent"
                >
                  MORE INFORMATION
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-[#4A3034] data-[state=active]:bg-transparent"
                >
                  REVIEWS
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 text-sm leading-relaxed text-[#6D5D60]">
                <p className="mb-4">{product.description}</p>
              </TabsContent>
              <TabsContent value="information" className="mt-4 text-sm leading-relaxed text-[#6D5D60]">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="font-medium">Brand</div>
                    <div>NOIR</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="font-medium">Volume</div>
                    <div>100 ML</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="font-medium">Fragrance Family</div>
                    <div>Woody Aromatic</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="font-medium">Top Notes</div>
                    <div>Grapefruit, Bergamot</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="font-medium">Heart Notes</div>
                    <div>Vetiver, Geranium</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="font-medium">Base Notes</div>
                    <div>Amber, Musk</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4 text-sm leading-relaxed text-[#6D5D60]">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#4A3034]">Customer Reviews</h3>
                    <Button variant="outline" className="text-xs">
                      Write a Review
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-md border border-gray-200 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#4A3034]">Sarah M.</p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-[#4A3034] text-[#4A3034]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">2 months ago</p>
                      </div>
                      <p>
                        Absolutely love this fragrance! It's sophisticated and long-lasting. The vetiver and geranium
                        blend beautifully together.
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-200 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#4A3034]">Michael T.</p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-[#4A3034] text-[#4A3034]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">1 month ago</p>
                      </div>
                      <p>
                        This has become my signature scent. The woody notes are perfect for everyday wear, and I receive
                        compliments every time I wear it.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts />
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}

