"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCartStore, useLanguageStore } from "@/lib/store";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RelatedProducts from "@/components/related-products";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export default function WishlistPage() {
  const { addToCart } = useCartStore();
  const { t } = useLanguageStore();
  const { toast } = useToast();

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Facial Cleanser",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Skin Care",
      inStock: true,
    },
    {
      id: 2,
      name: "Moisturizer",
      price: 34.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Skin Care",
      inStock: true,
    },
    {
      id: 6,
      name: "Perfume Collection",
      price: 59.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Fragrance",
      inStock: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = wishlistItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    toast({
      title: t("removed_from_wishlist"),
      description: t("item_removed_from_wishlist"),
    });
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      1
    );

    toast({
      title: t("added_to_cart"),
      description: `${item.name} ${t("has_been_added_to_cart")}`,
    });
  };

  const handleClearWishlist = () => {
    if (confirm(t("confirm_clear_wishlist"))) {
      setWishlistItems([]);
      toast({
        title: t("wishlist_cleared"),
        description: t("all_items_removed_from_wishlist"),
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">
            {t("wishlist")}
          </h1>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t("search_wishlist")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleClearWishlist}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("clear_wishlist")}
              </Button>
            )}
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-white shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-500 hover:text-red-600"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 text-xs uppercase text-gray-500">
                      {item.category}
                    </div>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="mb-2 text-sm font-medium text-[#4A3034] hover:underline">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="mb-3 text-sm font-bold text-[#4A3034]">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-[#4A3034] hover:bg-[#3A2024] text-white"
                        disabled={!item.inStock}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {item.inStock ? t("add_to_cart") : t("out_of_stock")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("remove")}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <Heart className="mx-auto h-16 w-16 text-gray-300" />
              <h2 className="mt-4 text-xl font-medium text-[#4A3034]">
                {t("wishlist_empty")}
              </h2>
              <p className="mt-2 text-[#6D5D60]">
                {t("wishlist_empty_description")}
              </p>
              <Link href="/shop">
                <Button className="mt-6 bg-[#4A3034] hover:bg-[#3A2024] text-white">
                  {t("continue_shopping")}
                </Button>
              </Link>
            </div>
          )}

          {/* You might also like section */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-[#4A3034] mb-6">
              {t("you_might_also_like")}
            </h2>
            <RelatedProducts />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
