"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { User, Package, Heart, CreditCard, MapPin, Settings, LogOut, ChevronRight } from "lucide-react"
import { useAuthStore, useLanguageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { t } = useLanguageStore()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    logout()
    toast({
      title: t("success"),
      description: t("logged_out_successfully"),
    })
    router.push("/")
  }

  const accountMenuItems = [
    {
      icon: <Package className="h-5 w-5" />,
      label: t("orders"),
      href: "/me/orders",
      description: t("view_your_orders"),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: t("wishlist"),
      href: "/wishlist",
      description: t("view_your_wishlist"),
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: t("payment_methods"),
      href: "/me/payment-methods",
      description: t("manage_your_payment_methods"),
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: t("addresses"),
      href: "/me/addresses",
      description: t("manage_your_addresses"),
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: t("settings"),
      href: "/me/settings",
      description: t("account_settings"),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">{t("my_account")}</h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Profile Summary */}
            <div className="md:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full">
                    <Image
                      src={user.avatar || "/placeholder.svg?height=200&width=200"}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-[#4A3034]">{user.name}</h2>
                  <p className="text-sm text-[#6D5D60]">{user.email}</p>

                  <div className="mt-6 w-full">
                    <Link href="/me/profile">
                      <Button
                        variant="outline"
                        className="w-full border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t("edit_profile")}
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-2 w-full">
                    <Button
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Menu */}
            <div className="md:col-span-2">
              <div className="rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">{t("account_menu")}</h2>

                  <div className="space-y-1">
                    {accountMenuItems.map((item, index) => (
                      <div key={index}>
                        <Link href={item.href}>
                          <div className="flex items-center justify-between rounded-md p-3 hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F9F5FF] text-[#4A3034]">
                                {item.icon}
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-[#4A3034]">{item.label}</p>
                                <p className="text-xs text-[#6D5D60]">{item.description}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </Link>
                        {index < accountMenuItems.length - 1 && <Separator className="my-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mt-6 rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-[#4A3034]">{t("recent_orders")}</h2>
                    <Link href="/me/orders" className="text-sm text-[#4A3034] hover:underline">
                      {t("view_all")}
                    </Link>
                  </div>

                  <div className="rounded-md border border-gray-200 overflow-hidden">
                    <div className="p-4 text-center text-sm text-[#6D5D60]">{t("no_recent_orders")}</div>
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

