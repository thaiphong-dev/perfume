"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Truck, Package, ArrowLeft } from "lucide-react"
import { useAuthStore, useLanguageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample order details
const orderDetails = {
  id: "ORD-12345",
  date: "2023-05-15",
  status: "delivered",
  total: 129.99,
  subtotal: 109.99,
  shipping: 10.0,
  tax: 10.0,
  discount: 0,
  paymentMethod: "Credit Card (****1234)",
  shippingAddress: {
    name: "John Doe",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  },
  items: [
    {
      id: 1,
      name: "Facial Cleanser",
      price: 29.99,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Moisturizer",
      price: 34.99,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Face Serum",
      price: 45.01,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
  tracking: {
    number: "TRK-987654",
    carrier: "FedEx",
    estimatedDelivery: "2023-05-20",
    status: "Delivered",
    history: [
      {
        date: "2023-05-15",
        status: "Order Placed",
        location: "Online",
      },
      {
        date: "2023-05-16",
        status: "Processing",
        location: "Warehouse",
      },
      {
        date: "2023-05-17",
        status: "Shipped",
        location: "Distribution Center",
      },
      {
        date: "2023-05-20",
        status: "Delivered",
        location: "Customer Address",
      },
    ],
  },
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuthStore()
  const { t } = useLanguageStore()
  const router = useRouter()

  const [order, setOrder] = useState(orderDetails)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // In a real app, you would fetch the order details based on the ID
    // For this demo, we're using the sample data
    setOrder({
      ...orderDetails,
      id: params.id,
    })
  }, [isAuthenticated, router, params.id])

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAuthenticated || !order) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Link href="/me/orders" className="flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]">
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("back_to_orders")}
            </Link>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-[#4A3034]">
              {t("order")} {order.id}
            </h1>
            <div className="mt-2 sm:mt-0">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}
              >
                {t(order.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">{t("order_summary")}</h2>

                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-sm font-medium text-[#6D5D60] mb-3">{t("items")}</h3>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-start">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="text-sm font-medium text-[#4A3034]">{item.name}</h4>
                              <p className="mt-1 text-xs text-[#6D5D60]">
                                {t("quantity")}: {item.quantity}
                              </p>
                              <p className="mt-1 text-xs font-medium text-[#4A3034]">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-[#4A3034]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Order Totals */}
                    <div>
                      <h3 className="text-sm font-medium text-[#6D5D60] mb-3">{t("order_total")}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6D5D60]">{t("subtotal")}</span>
                          <span className="text-[#4A3034]">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6D5D60]">{t("shipping")}</span>
                          <span className="text-[#4A3034]">${order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6D5D60]">{t("tax")}</span>
                          <span className="text-[#4A3034]">${order.tax.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[#6D5D60]">{t("discount")}</span>
                            <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-[#4A3034]">{t("total")}</span>
                          <span className="text-[#4A3034]">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Information */}
                    <div>
                      <h3 className="text-sm font-medium text-[#6D5D60] mb-3">{t("payment_information")}</h3>
                      <p className="text-sm text-[#4A3034]">{order.paymentMethod}</p>
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-sm font-medium text-[#6D5D60] mb-3">{t("shipping_address")}</h3>
                      <address className="not-italic text-sm text-[#4A3034]">
                        {order.shippingAddress.name}
                        <br />
                        {order.shippingAddress.street}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        <br />
                        {order.shippingAddress.country}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">{t("tracking_information")}</h2>

                  {order.tracking ? (
                    <div className="space-y-4">
                      <div className="rounded-md bg-gray-50 p-4">
                        <div className="flex items-center">
                          <Truck className="h-5 w-5 text-[#4A3034]" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-[#4A3034]">{order.tracking.carrier}</p>
                            <p className="text-xs text-[#6D5D60]">{order.tracking.number}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-[#6D5D60] mb-3">{t("tracking_history")}</h3>
                        <div className="space-y-4">
                          {order.tracking.history.map((event, index) => (
                            <div key={index} className="relative pl-6">
                              <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-[#4A3034]"></div>
                              <div
                                className={
                                  index < order.tracking.history.length - 1
                                    ? "absolute left-1.5 top-4 h-full w-0.5 bg-gray-200"
                                    : ""
                                }
                              />
                              <div>
                                <p className="text-sm font-medium text-[#4A3034]">{event.status}</p>
                                <p className="text-xs text-[#6D5D60]">{event.location}</p>
                                <p className="text-xs text-[#6D5D60]">{new Date(event.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          className="border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                        >
                          <Package className="mr-2 h-4 w-4" />
                          {t("track_package")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Package className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-[#6D5D60]">{t("no_tracking_information")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">{t("actions")}</h2>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                    >
                      {t("download_invoice")}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                    >
                      {t("contact_support")}
                    </Button>

                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <Button
                        variant="outline"
                        className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        {t("cancel_order")}
                      </Button>
                    )}

                    {order.status === "delivered" && (
                      <Button
                        variant="outline"
                        className="w-full justify-start border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                      >
                        {t("return_items")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="flex items-center text-[#4A3034]" onClick={() => router.push("/shop")}>
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

