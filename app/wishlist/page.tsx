"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react"
import { useAuthStore, useLanguageStore, useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample wishlist data
const sampleWishlist = [
  {
    id: 1,
    name: "Facial Cleanser",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
  },
  {
    id: 2,
    name: "Moisturizer",
    price: 34.99,
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
  },
  {
    id: 3,
    name: "Face Serum",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
    inStock: false,
  },
  {
    id: 6,
    name: "Perfume Collection",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
  },
]

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore()
  const { t } = useLanguageStore()
  const { addToCart } = useCartStore()
  const { toast } = useToast()
  const router = useRouter()

  const [wishlist, setWishlist] = useState(sampleWishlist)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id))
    toast({
      title: t("success"),
      description: t("item_removed_from_wishlist"),
    })
  }

  const handleAddToCart = (item: any) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      1,
    )

    toast({
      title: t("success"),
      description: t("item_added_to_cart"),
    })
  }

  const handleMoveAllToCart = () => {
    wishlist
      .filter((item) => item.inStock)
      .forEach((item) => {
        addToCart(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          },
          1,
        )
      })

    toast({
      title: t("success"),
      description: t("all_items_added_to_cart"),
    })
  }

  const handleClearWishlist = () => {
    setWishlist([])
    toast({
      title: t("success"),
      description: t("wishlist_cleared"),
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">{t("wishlist")}</h1>

          {wishlist.length > 0 ? (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#6D5D60]">
                  {wishlist.length} {wishlist.length === 1 ? t("item") : t("items")}
                </p>
                <div className="mt-2 flex space-x-2 sm:mt-0">
                  <Button variant="outline" size="sm" className="text-[#4A3034]" onClick={handleMoveAllToCart}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t("move_all_to_cart")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={handleClearWishlist}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("clear_wishlist")}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="relative">
                      <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <button
                        className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-500 shadow-sm"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-[#4A3034]">{item.name}</h3>
                      <p className="mt-1 text-sm font-bold text-[#4A3034]">${item.price.toFixed(2)}</p>

                      <div className="mt-2">
                        {item.inStock ? (
                          <Button
                            className="w-full bg-[#4A3034] hover:bg-[#3A2024] text-white"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            {t("add_to_cart")}
                          </Button>
                        ) : (
                          <Button className="w-full" disabled>
                            {t("out_of_stock")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-[#4A3034]">{t("wishlist_empty")}</h2>
              <p className="mt-2 text-[#6D5D60]">{t("wishlist_empty_description")}</p>
              <Button className="mt-6 bg-[#4A3034] hover:bg-[#3A2024] text-white" onClick={() => router.push("/shop")}>
                {t("start_shopping")}
              </Button>
            </div>
          )}

          <div className="mt-8">
            <Button variant="outline" className="flex items-center text-[#4A3034]" onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("continue_shopping")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

