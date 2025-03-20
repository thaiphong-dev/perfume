"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Search, Filter, Eye } from "lucide-react"
import { useAuthStore, useLanguageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Sample order data
const sampleOrders = [
  {
    id: "ORD-12345",
    date: "2023-05-15",
    status: "delivered",
    total: 129.99,
    items: 3,
    tracking: "TRK-987654",
  },
  {
    id: "ORD-12346",
    date: "2023-06-02",
    status: "processing",
    total: 89.5,
    items: 2,
    tracking: "TRK-987655",
  },
  {
    id: "ORD-12347",
    date: "2023-06-10",
    status: "shipped",
    total: 210.75,
    items: 4,
    tracking: "TRK-987656",
  },
  {
    id: "ORD-12348",
    date: "2023-06-15",
    status: "cancelled",
    total: 45.99,
    items: 1,
    tracking: null,
  },
  {
    id: "ORD-12349",
    date: "2023-06-20",
    status: "delivered",
    total: 156.5,
    items: 3,
    tracking: "TRK-987657",
  },
]

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore()
  const { t } = useLanguageStore()
  const router = useRouter()

  const [orders, setOrders] = useState(sampleOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastOrder = currentPage * itemsPerPage
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the filter
  }

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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Link href="/me" className="flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]">
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("back_to_account")}
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">{t("orders")}</h1>

          <div className="rounded-lg bg-white shadow-sm">
            <div className="p-6">
              {/* Filters */}
              <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="search"
                    placeholder={t("search_orders")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-[#6D5D60]" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("filter_by_status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all_orders")}</SelectItem>
                      <SelectItem value="processing">{t("processing")}</SelectItem>
                      <SelectItem value="shipped">{t("shipped")}</SelectItem>
                      <SelectItem value="delivered">{t("delivered")}</SelectItem>
                      <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Orders Table */}
              {currentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("order_id")}</TableHead>
                        <TableHead>{t("date")}</TableHead>
                        <TableHead>{t("status")}</TableHead>
                        <TableHead>{t("total")}</TableHead>
                        <TableHead>{t("items")}</TableHead>
                        <TableHead className="text-right">{t("actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                            >
                              {t(order.status)}
                            </span>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/me/orders/${order.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-3">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[#4A3034]">{t("no_orders_found")}</h3>
                  <p className="mt-1 text-sm text-[#6D5D60]">{t("no_orders_description")}</p>
                  <Button
                    className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                    onClick={() => router.push("/shop")}
                  >
                    {t("start_shopping")}
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredOrders.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

