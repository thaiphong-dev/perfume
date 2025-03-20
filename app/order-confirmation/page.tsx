"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = Math.floor(100000000 + Math.random() * 900000000).toString()
    setOrderNumber(randomOrderNumber)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-[#4A3034] mb-2">Thank You for Your Order!</h1>
                <p className="text-[#6D5D60] mb-6">Your order has been received and is now being processed.</p>

                <div className="mb-8 rounded-md bg-gray-50 p-4">
                  <p className="text-sm text-[#6D5D60]">Order Number</p>
                  <p className="text-lg font-medium text-[#4A3034]">#{orderNumber}</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-md bg-gray-50 p-4">
                    <p className="text-sm text-[#6D5D60]">Date</p>
                    <p className="text-sm font-medium text-[#4A3034]">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-4">
                    <p className="text-sm text-[#6D5D60]">Total</p>
                    <p className="text-sm font-medium text-[#4A3034]">SAR 575.00</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-4">
                    <p className="text-sm text-[#6D5D60]">Payment Method</p>
                    <p className="text-sm font-medium text-[#4A3034]">Credit Card</p>
                  </div>
                </div>

                <p className="text-[#6D5D60] mb-6">
                  A confirmation email has been sent to your email address. You can track your order status in your
                  account.
                </p>

                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
                  <Link href="/shop">
                    <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">Continue Shopping</Button>
                  </Link>
                  <Link href="/account/orders">
                    <Button
                      variant="outline"
                      className="border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                    >
                      Track Order
                    </Button>
                  </Link>
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

