"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdminStore } from "@/store/admin-store";
import { Chart } from "@/components/admin/chart";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  TrendingUp,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const { stats, fetchStats } = useAdminStore();
  const [timeframe, setTimeframe] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Prepare chart data based on selected timeframe
  const getChartData = () => {
    let labels: string[] = [];
    let data: number[] = [];

    switch (timeframe) {
      case "monthly":
        labels = stats.monthlySales.map((item) => item.month);
        data = stats.monthlySales.map((item) => item.revenue);
        break;
      case "quarterly":
        labels = stats.quarterlySales.map((item) => item.quarter);
        data = stats.quarterlySales.map((item) => item.revenue);
        break;
      case "yearly":
        labels = stats.yearlySales.map((item) => item.year);
        data = stats.yearlySales.map((item) => item.revenue);
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          borderColor: "#4A3034",
          backgroundColor: "rgba(74, 48, 52, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  // User growth chart data
  const userGrowthData = {
    labels: stats?.userGrowth?.map((item) => item.date),
    datasets: [
      {
        label: "New Users",
        data: stats.userGrowth.map((item) => item.users),
        borderColor: "#4A3034",
        backgroundColor: "#4A3034",
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#4A3034] dark:text-white mb-8">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={
            <DollarSign className="h-8 w-8 text-[#4A3034] dark:text-pink-300" />
          }
          change={12.5}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={
            <ShoppingBag className="h-8 w-8 text-[#4A3034] dark:text-pink-300" />
          }
          change={8.2}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={<Users className="h-8 w-8 text-[#4A3034] dark:text-pink-300" />}
          change={-2.4}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={
            <Package className="h-8 w-8 text-[#4A3034] dark:text-pink-300" />
          }
          change={5.1}
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Revenue Statistics
            </h2>
            <div className="flex space-x-2">
              <TimeframeButton
                active={timeframe === "monthly"}
                onClick={() => setTimeframe("monthly")}
              >
                Monthly
              </TimeframeButton>
              <TimeframeButton
                active={timeframe === "quarterly"}
                onClick={() => setTimeframe("quarterly")}
              >
                Quarterly
              </TimeframeButton>
              <TimeframeButton
                active={timeframe === "yearly"}
                onClick={() => setTimeframe("yearly")}
              >
                Yearly
              </TimeframeButton>
            </div>
          </div>
          <Chart type="line" data={getChartData()} height={350} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white flex items-center">
              <Users className="mr-2 h-5 w-5" />
              User Growth
            </h2>
            <button className="text-[#4A3034] dark:text-pink-300 hover:underline text-sm">
              Last 30 Days
            </button>
          </div>
          <Chart type="bar" data={userGrowthData} height={350} />
        </div>
      </div>

      {/* Best Selling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Best Selling Products
            </h2>
            <button className="text-[#4A3034] dark:text-pink-300 hover:underline text-sm">
              View All Products
            </button>
          </div>
          <div className="space-y-4">
            {stats.bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.sales} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Activity
            </h2>
            <button className="text-[#4A3034] dark:text-pink-300 hover:underline text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <ActivityItem
              title="New Order"
              description="Order #ORD-1234 was placed by John Doe"
              time="10 minutes ago"
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <ActivityItem
              title="Low Stock Alert"
              description="Hydrating Face Cream is running low on inventory"
              time="1 hour ago"
              icon={<Package className="h-4 w-4" />}
            />
            <ActivityItem
              title="New User"
              description="Sarah Wilson created an account"
              time="3 hours ago"
              icon={<Users className="h-4 w-4" />}
            />
            <ActivityItem
              title="Payment Received"
              description="$129.99 payment received for order #ORD-1230"
              time="5 hours ago"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <ActivityItem
              title="Product Review"
              description="New 5-star review for Vitamin C Serum"
              time="Yesterday"
              icon={<Star className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  change,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
}) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-full">
          {icon}
        </div>
      </div>
      <div
        className={`flex items-center mt-4 text-sm ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <ArrowUpRight size={16} className="mr-1" />
        ) : (
          <ArrowDownRight size={16} className="mr-1" />
        )}
        <span>{Math.abs(change)}% from last month</span>
      </div>
    </div>
  );
}

function TimeframeButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`px-3 py-1 text-sm rounded-md transition-colors ${
        active
          ? "bg-[#4A3034] text-white"
          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-3">
        <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-full">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {time}
      </div>
    </div>
  );
}
