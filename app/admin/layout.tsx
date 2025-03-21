import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
// import { getSession } from "@/lib/session";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Beauty E-commerce",
  description: "Admin dashboard for Beauty E-commerce platform",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const session = await getSession();

  //   // Double-check auth on server side
  //   if (!session || session.user?.role !== "admin") {
  //     redirect("/login?callbackUrl=/admin");
  //   }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#4A3034] dark:text-white">
            Admin Panel
          </h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            <NavItem
              href="/admin"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
            />
            <NavItem
              href="/admin/orders"
              icon={<ShoppingBag size={20} />}
              label="Orders"
            />
            <NavItem
              href="/admin/users"
              icon={<Users size={20} />}
              label="Users"
            />
            <NavItem
              href="/admin/products"
              icon={<Package size={20} />}
              label="Products"
            />
            <NavItem
              href="/admin/blog"
              icon={<FileText size={20} />}
              label="Blog Posts"
            />
            <NavItem
              href="/admin/settings"
              icon={<Settings size={20} />}
              label="Settings"
            />
          </div>
          <div className="px-4 mt-10">
            <Link
              href="/"
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Back to Site</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
