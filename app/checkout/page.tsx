"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 15 : 0
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + shipping + tax

  const handlePlaceOrder = () => {
    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      clearCart()

      // Redirect to order confirmation page
      window.location.href = "/order-confirmation"
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-[#4A3034] mb-6">Checkout</h1>
            <p className="text-[#6D5D60] mb-6">
              Your cart is empty. Please add some items to your cart before proceeding to checkout.
            </p>
            <Link href="/shop">
              <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">Continue Shopping</Button>
            </Link>
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
          <div className="flex items-center mb-6">
            <Link href="/cart" className="flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Cart
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">Checkout</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">Shipping Information</h2>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="Enter your first name" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Enter your last name" className="mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" className="mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Enter your street address" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter your city" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input id="postal-code" placeholder="Enter your postal code" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <select id="country" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1">
                        <option>Saudi Arabia</option>
                        <option>United Arab Emirates</option>
                        <option>Kuwait</option>
                        <option>Qatar</option>
                        <option>Bahrain</option>
                        <option>Oman</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" placeholder="Enter your state/province" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">Payment Method</h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-4">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-5 w-5 text-[#4A3034]" />
                            <span>Credit / Debit Card</span>
                          </div>
                        </Label>
                        <div className="flex space-x-1">
                          <Image
                            src="/placeholder.svg?height=24&width=36"
                            alt="Visa"
                            width={36}
                            height={24}
                            className="rounded-md border border-gray-200"
                          />
                          <Image
                            src="/placeholder.svg?height=24&width=36"
                            alt="Mastercard"
                            width={36}
                            height={24}
                            className="rounded-md border border-gray-200"
                          />
                          <Image
                            src="/placeholder.svg?height=24&width=36"
                            alt="American Express"
                            width={36}
                            height={24}
                            className="rounded-md border border-gray-200"
                          />
                        </div>
                      </div>

                      {paymentMethod === "credit-card" && (
                        <div className="rounded-md border border-gray-200 p-4 ml-6">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="card-number">Card Number</Label>
                              <Input id="card-number" placeholder="0000 0000 0000 0000" className="mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" className="mt-1" />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="card-name">Name on Card</Label>
                              <Input id="card-name" placeholder="Enter name on card" className="mt-1" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-4">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <Image
                              src="/placeholder.svg?height=24&width=72"
                              alt="PayPal"
                              width={72}
                              height={24}
                              className="mr-2"
                            />
                            <span>PayPal</span>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-4">
                        <RadioGroupItem value="apple-pay" id="apple-pay" />
                        <Label htmlFor="apple-pay" className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <Image
                              src="/placeholder.svg?height=24&width=72"
                              alt="Apple Pay"
                              width={72}
                              height={24}
                              className="mr-2"
                            />
                            <span>Apple Pay</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm text-[#6D5D60] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link href="/terms" className="text-[#4A3034] underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#4A3034] underline">
                          Privacy Policy
                        </Link>
                      </label>
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

                  <div className="space-y-4 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-[#4A3034]">{item.name}</h3>
                          <p className="mt-1 text-xs text-[#6D5D60]">Qty: {item.quantity}</p>
                          <p className="mt-1 text-xs font-medium text-[#4A3034]">
                            SAR {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

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
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-md font-medium text-[#4A3034]">Total</span>
                      <span className="text-md font-bold text-[#4A3034]">SAR {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <div className="mt-6 text-xs text-[#6D5D60] text-center">
                    <p>
                      Your personal data will be used to process your order, support your experience, and for other
                      purposes described in our privacy policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

