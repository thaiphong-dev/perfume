"use client"

import type React from "react"

import Image from "next/image"
import { Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  discount?: number
  isNew?: boolean
  brand?: string
}

export default function ProductCard({ id, name, price, image, discount, isNew, brand }: ProductCardProps) {
  const { addToCart } = useCartStore()
  const { toast } = useToast()
  const discountedPrice = discount ? price - (price * discount) / 100 : price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart(
      {
        id,
        name,
        price: discountedPrice,
        image,
      },
      1,
    )

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    })
  }

  return (
    <div className="group relative flex flex-col">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button className="absolute right-2 top-2 rounded-full bg-white p-1.5 opacity-70 transition-opacity hover:opacity-100">
          <Heart className="h-4 w-4 text-[#4A3034]" />
        </button>
        {discount && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
            -{discount}%
          </span>
        )}
        {isNew && (
          <span className="absolute left-2 top-2 rounded bg-[#4A3034] px-1.5 py-0.5 text-xs font-medium text-white">
            NEW
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#4A3034] p-2 text-center text-xs text-white transition-transform duration-300 group-hover:translate-y-0"
        >
          Add to Cart
        </button>
      </div>
      {brand && <div className="mb-1 text-xs uppercase text-gray-500">{brand}</div>}
      <h3 className="mb-1 text-sm font-medium text-[#4A3034]">{name}</h3>
      <div className="mt-auto flex items-center">
        {discount ? (
          <>
            <span className="text-sm font-bold text-[#4A3034]">${discountedPrice.toFixed(2)}</span>
            <span className="ml-2 text-xs text-gray-500 line-through">${price.toFixed(2)}</span>
          </>
        ) : (
          <span className="text-sm font-bold text-[#4A3034]">${price.toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}

