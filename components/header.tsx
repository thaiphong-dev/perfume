"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, Search, Heart, User, Menu, X, Globe } from "lucide-react"
import { useCartStore, useAuthStore, useLanguageStore, useSearchStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchModal from "@/components/search-modal"

const navItems = [
  { label: "home", href: "/" },
  { label: "shop", href: "/shop" },
  { label: "about", href: "/about" },
  { label: "contact", href: "/contact" },
  { label: "blog", href: "/blog" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const { itemCount } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const { language, setLanguage, t } = useLanguageStore()
  const { setQuery, search } = useSearchStore()

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleSearchClick = () => {
    setSearchModalOpen(true)
  }

  const handleLanguageChange = (newLanguage: "en" | "vi") => {
    setLanguage(newLanguage)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#4A3034] px-4 py-2 text-center text-xs text-white md:px-6 lg:px-8">
        <p>{t("free_shipping")}</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#4A3034]">NIRE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-medium text-[#4A3034] hover:text-[#6D5D60]">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Language Selector - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Globe className="h-5 w-5 text-[#4A3034]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("en")}
                    className={language === "en" ? "bg-gray-100" : ""}
                  >
                    {t("english")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("vi")}
                    className={language === "vi" ? "bg-gray-100" : ""}
                  >
                    {t("vietnamese")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <button className="hidden md:block" onClick={handleSearchClick}>
              <Search className="h-5 w-5 text-[#4A3034]" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <User className="h-5 w-5 text-[#4A3034]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>
                      {t("welcome_back")}, {user?.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/me">{t("my_account")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/me/orders">{t("orders")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/me/settings">{t("settings")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/logout">{t("logout")}</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">{t("login")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">{t("register")}</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-[#4A3034]" />
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5 text-[#4A3034]" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#4A3034] text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6 text-[#4A3034]" /> : <Menu className="h-6 w-6 text-[#4A3034]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block text-sm font-medium text-[#4A3034] hover:text-[#6D5D60]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      search((e.target as HTMLInputElement).value)
                      setSearchModalOpen(true)
                    }
                  }}
                />
                <button className="absolute right-3 top-2" onClick={handleSearchClick}>
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  )
}

