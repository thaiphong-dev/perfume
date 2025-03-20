"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { CartItem as CartItemType } from "@/context/cart-context"

interface CartItemProps {
  item: CartItemType
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
}

export default function CartItem({ item, updateQuantity, removeFromCart }: CartItemProps) {
  const { toast } = useToast()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = () => {
    setIsRemoving(true)

    // Add a small delay to show the removing state
    setTimeout(() => {
      removeFromCart(item.id)
      toast({
        title: "Item removed",
        description: `${item.name} has been removed from your cart.`,
      })
    }, 300)
  }

  const handleMoveToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${item.name} has been added to your wishlist.`,
    })
  }

  const itemTotal = item.price * item.quantity

  return (
    <div className={`border-b border-gray-100 pb-6 ${isRemoving ? "opacity-50" : ""}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
          <Link href={`/product/${item.id}`}>
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col sm:ml-4 mt-4 sm:mt-0">
          <div className="flex justify-between">
            <div>
              <Link href={`/product/${item.id}`}>
                <h3 className="text-sm font-medium text-[#4A3034] hover:underline">{item.name}</h3>
              </Link>
              <p className="mt-1 text-xs text-[#6D5D60]">SAR {item.price.toFixed(2)} each</p>
            </div>
            <p className="text-sm font-medium text-[#4A3034]">SAR {itemTotal.toFixed(2)}</p>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 rounded-md">
              <button
                className="flex h-8 w-8 items-center justify-center text-[#6D5D60] hover:bg-gray-50 disabled:opacity-50"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if (!isNaN(value) && value > 0) {
                    updateQuantity(item.id, value)
                  }
                }}
                className="h-8 w-12 border-x border-gray-200 bg-white text-center text-sm"
              />
              <button
                className="flex h-8 w-8 items-center justify-center text-[#6D5D60] hover:bg-gray-50"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-[#6D5D60] hover:text-[#4A3034]"
                onClick={handleMoveToWishlist}
              >
                <Heart className="mr-1 h-3 w-3" />
                Save for Later
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-[#6D5D60] hover:text-red-500"
                onClick={handleRemove}
                disabled={isRemoving}
              >
                <X className="mr-1 h-3 w-3" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

