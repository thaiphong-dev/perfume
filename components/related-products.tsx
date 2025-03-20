"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function RelatedProducts() {
  const { addToCart } = useCartStore()
  const { toast } = useToast()

  // Sample related products data
  const relatedProducts = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 100, // Using different IDs from the main product
    name: "Product Name",
    price: 199.99,
    currency: "SAR",
    image: "/placeholder.svg?height=200&width=200",
    isNew: i === 0,
    discount: i === 2 ? 15 : undefined,
  }))

  const handleAddToCart = (product: any) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
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
    <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {relatedProducts.map((product) => (
          <div key={product.id} className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-[#4A3034]">{product.name}</p>
              <p className="text-sm font-bold text-[#4A3034]">
                {product.currency}
                {product.price.toFixed(2)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full text-xs border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                onClick={() => handleAddToCart(product)}
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

