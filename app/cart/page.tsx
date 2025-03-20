"use client"

import { useState } from "react"
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import RelatedProducts from "@/components/related-products"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 15 : 0
  const tax = subtotal * 0.05 // 5% tax
  const discount = 0 // This would be calculated based on applied coupon
  const total = subtotal + shipping + tax - discount

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    setIsApplyingCoupon(true)

    // Simulate API call to validate coupon
    setTimeout(() => {
      setIsApplyingCoupon(false)

      // For demo purposes, we'll just show a message
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or has expired.",
        variant: "destructive",
      })
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-[#4A3034] mb-6">Shopping Cart</h1>
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="flex justify-center mb-6">
                <ShoppingBag className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="text-xl font-medium text-[#4A3034] mb-2">Your cart is empty</h2>
              <p className="text-[#6D5D60] mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/shop">
                <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          {/* You might also like section */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-[#4A3034] mb-6">You might also like</h2>
            <RelatedProducts />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#4A3034]">Shopping Cart</h1>
            <Link href="/shop" className="flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-[#4A3034]">Cart Items ({items.length})</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#6D5D60] hover:text-[#4A3034] flex items-center"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear your cart?")) {
                          clearCart()
                          toast({
                            title: "Cart cleared",
                            description: "All items have been removed from your cart.",
                          })
                        }
                      }}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Clear Cart
                    </Button>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="border-b border-gray-100 pb-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* Product Image */}
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <Link href={`/product/${item.id}`}>
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
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
                              <p className="text-sm font-medium text-[#4A3034]">
                                SAR {(item.price * item.quantity).toFixed(2)}
                              </p>
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
                                  className="h-8 text-xs text-[#6D5D60] hover:text-red-500"
                                  onClick={() => {
                                    removeFromCart(item.id)
                                    toast({
                                      title: "Item removed",
                                      description: `${item.name} has been removed from your cart.`,
                                    })
                                  }}
                                >
                                  <X className="mr-1 h-3 w-3" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping & Coupon */}
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-md font-medium text-[#4A3034] mb-4">Shipping Estimate</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-[#6D5D60] mb-1 block">Country</label>
                        <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                          <option>Saudi Arabia</option>
                          <option>United Arab Emirates</option>
                          <option>Kuwait</option>
                          <option>Qatar</option>
                          <option>Bahrain</option>
                          <option>Oman</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-[#6D5D60] mb-1 block">Postal Code</label>
                        <Input placeholder="Enter postal code" />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                      >
                        Calculate Shipping
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-md font-medium text-[#4A3034] mb-4">Coupon Code</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-[#6D5D60]">If you have a coupon code, please apply it below.</p>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          className="border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white whitespace-nowrap"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6D5D60]">Subtotal</span>
                      <span className="text-sm font-medium text-[#4A3034]">SAR {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6D5D60]">Shipping</span>
                      <span className="text-sm font-medium text-[#4A3034]">SAR {shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6D5D60]">Tax (5%)</span>
                      <span className="text-sm font-medium text-[#4A3034]">SAR {tax.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm">Discount</span>
                        <span className="text-sm font-medium">-SAR {discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-md font-medium text-[#4A3034]">Total</span>
                      <span className="text-md font-bold text-[#4A3034]">SAR {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-[#4A3034] hover:bg-[#3A2024] text-white">
                    Proceed to Checkout
                  </Button>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-[#4A3034] mb-2">We Accept</h3>
                    <div className="flex space-x-2">
                      <Image
                        src="/placeholder.svg?height=30&width=40"
                        alt="Visa"
                        width={40}
                        height={25}
                        className="rounded-md border border-gray-200"
                      />
                      <Image
                        src="/placeholder.svg?height=30&width=40"
                        alt="Mastercard"
                        width={40}
                        height={25}
                        className="rounded-md border border-gray-200"
                      />
                      <Image
                        src="/placeholder.svg?height=30&width=40"
                        alt="American Express"
                        width={40}
                        height={25}
                        className="rounded-md border border-gray-200"
                      />
                      <Image
                        src="/placeholder.svg?height=30&width=40"
                        alt="PayPal"
                        width={40}
                        height={25}
                        className="rounded-md border border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="mt-6 text-xs text-[#6D5D60]">
                    <p>
                      By proceeding to checkout, you agree to our{" "}
                      <Link href="/terms" className="text-[#4A3034] underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#4A3034] underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-[#4A3034] mb-6">Recently Viewed</h2>
            <RelatedProducts />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

