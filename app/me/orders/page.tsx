"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Package,
  Search,
  Filter,
  ChevronDown,
  Eye,
} from "lucide-react";
import { useAuthStore, useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();
  const { toast } = useToast();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-12345",
      date: "2023-05-15",
      status: "delivered",
      total: 129.99,
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
          quantity: 2,
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: 3,
          name: "Face Serum",
          price: 49.99,
          quantity: 1,
          image: "/placeholder.svg?height=200&width=200",
        },
      ],
      trackingNumber: "TRK-987654321",
      shippingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
      },
    },
    {
      id: "ORD-67890",
      date: "2023-06-20",
      status: "processing",
      total: 89.98,
      items: [
        {
          id: 6,
          name: "Perfume Collection",
          price: 59.99,
          quantity: 1,
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: 7,
          name: "Body Lotion",
          price: 19.99,
          quantity: 1,
          image: "/placeholder.svg?height=200&width=200",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
      },
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const filteredOrders = orders
    .filter((order) => {
      // Filter by search query
      if (searchQuery) {
        return (
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
      return true;
    })
    .filter((order) => {
      // Filter by status
      if (statusFilter !== "all") {
        return order.status === statusFilter;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Link
              href="/me"
              className="flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("back_to_account")}
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">
            {t("orders")}
          </h1>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="all">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <TabsList>
                    <TabsTrigger value="all">{t("all_orders")}</TabsTrigger>
                    <TabsTrigger value="active">
                      {t("active_orders")}
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      {t("completed_orders")}
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder={t("search_orders")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[130px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          <span>{t("filter")}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("all_statuses")}</SelectItem>
                        <SelectItem value="pending">{t("pending")}</SelectItem>
                        <SelectItem value="processing">
                          {t("processing")}
                        </SelectItem>
                        <SelectItem value="shipped">{t("shipped")}</SelectItem>
                        <SelectItem value="delivered">
                          {t("delivered")}
                        </SelectItem>
                        <SelectItem value="cancelled">
                          {t("cancelled")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-[130px]">
                        <div className="flex items-center">
                          <ChevronDown className="mr-2 h-4 w-4" />
                          <span>{t("sort")}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">
                          {t("newest_first")}
                        </SelectItem>
                        <SelectItem value="oldest">
                          {t("oldest_first")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TabsContent value="all">
                  {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-lg border border-gray-200 overflow-hidden"
                        >
                          <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[#4A3034]">
                                  {t("order")} #{order.id}
                                </p>
                                <Badge
                                  className={getStatusBadgeColor(order.status)}
                                >
                                  {t(order.status)}
                                </Badge>
                              </div>
                              <p className="text-xs text-[#6D5D60]">
                                {t("placed_on")}{" "}
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-[#4A3034]">
                                {t("total")}: ${order.total.toFixed(2)}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewOrderDetails(order)}
                                className="text-xs"
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                {t("view_details")}
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3"
                                >
                                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-[#4A3034]">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-[#6D5D60]">
                                      {t("qty")}: {item.quantity} × $
                                      {item.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                      <Package className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-[#4A3034]">
                        {t("no_orders_found")}
                      </h3>
                      <p className="mt-1 text-xs text-[#6D5D60]">
                        {t("no_orders_description")}
                      </p>
                      <Button
                        onClick={() => router.push("/shop")}
                        className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                      >
                        {t("start_shopping")}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="active">
                  {filteredOrders.filter((order) =>
                    ["pending", "processing", "shipped"].includes(order.status)
                  ).length > 0 ? (
                    <div className="space-y-4">
                      {filteredOrders
                        .filter((order) =>
                          ["pending", "processing", "shipped"].includes(
                            order.status
                          )
                        )
                        .map((order) => (
                          <div
                            key={order.id}
                            className="rounded-lg border border-gray-200 overflow-hidden"
                          >
                            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-[#4A3034]">
                                    {t("order")} #{order.id}
                                  </p>
                                  <Badge
                                    className={getStatusBadgeColor(
                                      order.status
                                    )}
                                  >
                                    {t(order.status)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-[#6D5D60]">
                                  {t("placed_on")}{" "}
                                  {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[#4A3034]">
                                  {t("total")}: ${order.total.toFixed(2)}
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewOrderDetails(order)}
                                  className="text-xs"
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  {t("view_details")}
                                </Button>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-[#4A3034]">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-[#6D5D60]">
                                        {t("qty")}: {item.quantity} × $
                                        {item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                      <Package className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-[#4A3034]">
                        {t("no_active_orders")}
                      </h3>
                      <p className="mt-1 text-xs text-[#6D5D60]">
                        {t("no_active_orders_description")}
                      </p>
                      <Button
                        onClick={() => router.push("/shop")}
                        className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                      >
                        {t("start_shopping")}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed">
                  {filteredOrders.filter((order) =>
                    ["delivered", "cancelled"].includes(order.status)
                  ).length > 0 ? (
                    <div className="space-y-4">
                      {filteredOrders
                        .filter((order) =>
                          ["delivered", "cancelled"].includes(order.status)
                        )
                        .map((order) => (
                          <div
                            key={order.id}
                            className="rounded-lg border border-gray-200 overflow-hidden"
                          >
                            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-[#4A3034]">
                                    {t("order")} #{order.id}
                                  </p>
                                  <Badge
                                    className={getStatusBadgeColor(
                                      order.status
                                    )}
                                  >
                                    {t(order.status)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-[#6D5D60]">
                                  {t("placed_on")}{" "}
                                  {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[#4A3034]">
                                  {t("total")}: ${order.total.toFixed(2)}
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewOrderDetails(order)}
                                  className="text-xs"
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  {t("view_details")}
                                </Button>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                      <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-[#4A3034]">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-[#6D5D60]">
                                        {t("qty")}: {item.quantity} × $
                                        {item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                      <Package className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-[#4A3034]">
                        {t("no_completed_orders")}
                      </h3>
                      <p className="mt-1 text-xs text-[#6D5D60]">
                        {t("no_completed_orders_description")}
                      </p>
                      <Button
                        onClick={() => router.push("/shop")}
                        className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                      >
                        {t("start_shopping")}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("order_details")}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#4A3034]">
                    {t("order")} #{selectedOrder.id}
                  </p>
                  <p className="text-xs text-[#6D5D60]">
                    {t("placed_on")}{" "}
                    {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusBadgeColor(selectedOrder.status)}>
                  {t(selectedOrder.status)}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#4A3034] mb-2">
                  {t("order_items")}
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#4A3034]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#6D5D60]">
                          {t("qty")}: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[#4A3034]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-[#4A3034] mb-2">
                  {t("order_summary")}
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#6D5D60]">{t("subtotal")}</p>
                    <p className="text-[#4A3034]">
                      $
                      {selectedOrder.items
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#6D5D60]">{t("shipping")}</p>
                    <p className="text-[#4A3034]">$10.00</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#6D5D60]">{t("tax")}</p>
                    <p className="text-[#4A3034]">
                      $
                      {(
                        selectedOrder.total -
                        selectedOrder.items.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        ) -
                        10
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-sm font-medium">
                    <p className="text-[#4A3034]">{t("total")}</p>
                    <p className="text-[#4A3034]">
                      ${selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#4A3034] mb-2">
                    {t("shipping_address")}
                  </h3>
                  <div className="text-sm text-[#6D5D60]">
                    <p>{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
                {selectedOrder.trackingNumber && (
                  <div>
                    <h3 className="text-sm font-medium text-[#4A3034] mb-2">
                      {t("tracking_information")}
                    </h3>
                    <div className="text-sm text-[#6D5D60]">
                      <p>
                        {t("tracking_number")}: {selectedOrder.trackingNumber}
                      </p>
                      <p>{t("carrier")}: Standard Shipping</p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-[#4A3034] hover:text-[#6D5D60]"
                        onClick={() =>
                          window.open(
                            `https://example.com/track/${selectedOrder.trackingNumber}`,
                            "_blank"
                          )
                        }
                      >
                        {t("track_package")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOrderDetailsOpen(false)}
                >
                  {t("close")}
                </Button>
                {selectedOrder.status === "delivered" && (
                  <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">
                    {t("buy_again")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
