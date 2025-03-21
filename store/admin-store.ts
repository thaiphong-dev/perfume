import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
type Stats = {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  monthlySales: { month: string; revenue: number }[];
  quarterlySales: { quarter: string; revenue: number }[];
  yearlySales: { year: string; revenue: number }[];
  userGrowth: { date: string; users: number }[];
  bestSellers: {
    id: string;
    name: string;
    image: string;
    sales: number;
    revenue: number;
  }[];
};

type RecentOrder = {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  items: number;
  status: "pending" | "processing" | "completed" | "cancelled";
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  joinDate: string;
  lastLogin: string;
  orders: number;
  totalSpent: number;
  avatar?: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  featured: boolean;
  image: string;
  sales: number;
  rating: number;
};

type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  read: boolean;
  replied: boolean;
};

interface AdminState {
  stats: Stats;
  recentOrders: RecentOrder[];
  users: User[];
  products: Product[];
  chatMessages: ChatMessage[];
  settings: {
    notifications: boolean;
    emailAlerts: boolean;
    darkMode: boolean;
    language: "en" | "vi";
  };
  fetchStats: () => Promise<void>;
  fetchRecentOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchChatMessages: () => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    status: RecentOrder["status"]
  ) => Promise<void>;
  updateProduct: (productId: string, data: Partial<Product>) => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  updateSettings: (settings: Partial<AdminState["settings"]>) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  replyToMessage: (messageId: string, reply: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      stats: {
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        monthlySales: [],
        quarterlySales: [],
        yearlySales: [],
        userGrowth: [],
        bestSellers: [],
      },
      recentOrders: [],
      users: [],
      products: [],
      chatMessages: [],
      settings: {
        notifications: true,
        emailAlerts: true,
        darkMode: false,
        language: "en",
      },
      fetchStats: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate monthly sales data (last 12 months)
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const currentMonth = new Date().getMonth();
        const monthlySales = Array.from({ length: 12 }, (_, i) => {
          const monthIndex = (currentMonth - 11 + i) % 12;
          return {
            month: months[monthIndex],
            revenue: Math.floor(Math.random() * 10000) + 5000,
          };
        });

        // Generate quarterly sales data (last 4 quarters)
        const quarterlySales = [
          {
            quarter: "Q1",
            revenue: monthlySales
              .slice(0, 3)
              .reduce((sum, m) => sum + m.revenue, 0),
          },
          {
            quarter: "Q2",
            revenue: monthlySales
              .slice(3, 6)
              .reduce((sum, m) => sum + m.revenue, 0),
          },
          {
            quarter: "Q3",
            revenue: monthlySales
              .slice(6, 9)
              .reduce((sum, m) => sum + m.revenue, 0),
          },
          {
            quarter: "Q4",
            revenue: monthlySales
              .slice(9, 12)
              .reduce((sum, m) => sum + m.revenue, 0),
          },
        ];

        // Generate yearly sales data (last 5 years)
        const currentYear = new Date().getFullYear();
        const yearlySales = Array.from({ length: 5 }, (_, i) => ({
          year: (currentYear - 4 + i).toString(),
          revenue: Math.floor(Math.random() * 100000) + 50000,
        }));

        // Generate user growth data (last 30 days)
        const userGrowth = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 29 + i);
          return {
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            users: Math.floor(Math.random() * 20) + 5,
          };
        });

        // Generate best sellers
        const bestSellers = [
          {
            id: "P001",
            name: "Hydrating Face Cream",
            image: "/placeholder.svg?height=80&width=80",
            sales: 156,
            revenue: 7800,
          },
          {
            id: "P002",
            name: "Vitamin C Serum",
            image: "/placeholder.svg?height=80&width=80",
            sales: 142,
            revenue: 7100,
          },
          {
            id: "P003",
            name: "Retinol Night Cream",
            image: "/placeholder.svg?height=80&width=80",
            sales: 128,
            revenue: 6400,
          },
          {
            id: "P004",
            name: "Hyaluronic Acid Moisturizer",
            image: "/placeholder.svg?height=80&width=80",
            sales: 115,
            revenue: 5750,
          },
          {
            id: "P005",
            name: "Exfoliating Facial Scrub",
            image: "/placeholder.svg?height=80&width=80",
            sales: 98,
            revenue: 4900,
          },
        ];

        // Calculate totals
        const totalSales = monthlySales.reduce((sum, m) => sum + m.revenue, 0);

        set({
          stats: {
            totalSales,
            totalOrders: 1256,
            totalUsers: 4328,
            totalProducts: 189,
            monthlySales,
            quarterlySales,
            yearlySales,
            userGrowth,
            bestSellers,
          },
        });
      },
      fetchRecentOrders: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const statuses: RecentOrder["status"][] = [
          "pending",
          "processing",
          "completed",
          "cancelled",
        ];
        const customers = [
          "Jane Smith",
          "John Doe",
          "Emily Johnson",
          "Michael Brown",
          "Sarah Wilson",
          "David Lee",
          "Lisa Chen",
          "Robert Kim",
          "Jennifer Lopez",
          "William Taylor",
          "Maria Garcia",
          "James Rodriguez",
          "Patricia Martinez",
          "Thomas Anderson",
          "Elizabeth White",
        ];

        // Generate 50 orders
        const orders: RecentOrder[] = Array.from({ length: 50 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          const customer =
            customers[Math.floor(Math.random() * customers.length)];
          const email =
            customer.toLowerCase().replace(" ", ".") + "@example.com";

          return {
            id: `ORD-${(1000 + i).toString().padStart(3, "0")}`,
            customer,
            email,
            date: date.toISOString().split("T")[0],
            amount: Math.floor(Math.random() * 200) + 50,
            items: Math.floor(Math.random() * 5) + 1,
            status: statuses[Math.floor(Math.random() * statuses.length)],
          };
        });

        // Sort by date (newest first)
        orders.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        set({ recentOrders: orders });
      },
      fetchUsers: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const roles: User["role"][] = ["user", "admin"];
        const statuses: User["status"][] = ["active", "inactive"];
        const names = [
          "Jane Smith",
          "John Doe",
          "Emily Johnson",
          "Michael Brown",
          "Sarah Wilson",
          "David Lee",
          "Lisa Chen",
          "Robert Kim",
          "Jennifer Lopez",
          "William Taylor",
          "Maria Garcia",
          "James Rodriguez",
          "Patricia Martinez",
          "Thomas Anderson",
          "Elizabeth White",
          "Daniel Lewis",
          "Nancy Clark",
          "Paul Walker",
          "Karen Hall",
          "George Young",
          "Susan Allen",
          "Kevin Wright",
          "Linda Scott",
          "Edward Green",
          "Barbara Adams",
        ];

        // Generate 100 users
        const users: User[] = Array.from({ length: 100 }, (_, i) => {
          const name = names[Math.floor(Math.random() * names.length)];
          const email = name.toLowerCase().replace(" ", ".") + "@example.com";
          const joinDate = new Date();
          joinDate.setDate(
            joinDate.getDate() - Math.floor(Math.random() * 365)
          );
          const lastLogin = new Date();
          lastLogin.setDate(
            lastLogin.getDate() - Math.floor(Math.random() * 30)
          );

          return {
            id: `U${(1000 + i).toString().padStart(3, "0")}`,
            name,
            email,
            role: i < 5 ? "admin" : "user", // First 5 are admins
            status: statuses[Math.floor(Math.random() * statuses.length)],
            joinDate: joinDate.toISOString().split("T")[0],
            lastLogin: lastLogin.toISOString().split("T")[0],
            orders: Math.floor(Math.random() * 10),
            totalSpent: Math.floor(Math.random() * 1000) + 50,
            avatar: `/placeholder.svg?height=40&width=40`,
          };
        });

        // Sort by join date (newest first)
        users.sort(
          (a, b) =>
            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        );

        set({ users });
      },
      fetchProducts: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const categories = [
          "Skincare",
          "Makeup",
          "Haircare",
          "Fragrance",
          "Bath & Body",
        ];
        const statuses: Product["status"][] = [
          "in-stock",
          "low-stock",
          "out-of-stock",
        ];
        const productNames = [
          "Hydrating Face Cream",
          "Vitamin C Serum",
          "Retinol Night Cream",
          "Hyaluronic Acid Moisturizer",
          "Exfoliating Facial Scrub",
          "Anti-Aging Eye Cream",
          "Brightening Face Mask",
          "Gentle Cleansing Foam",
          "Matte Lipstick",
          "Volumizing Mascara",
          "Liquid Foundation",
          "Eyeshadow Palette",
          "Nourishing Shampoo",
          "Repairing Conditioner",
          "Hair Growth Serum",
          "Heat Protection Spray",
          "Floral Eau de Parfum",
          "Citrus Body Mist",
          "Woody Cologne",
          "Lavender Essential Oil",
          "Exfoliating Body Scrub",
          "Moisturizing Body Lotion",
          "Relaxing Bath Bombs",
          "Hand Repair Cream",
        ];

        // Generate 100 products
        const products: Product[] = Array.from({ length: 100 }, (_, i) => {
          const name =
            productNames[i % productNames.length] +
            ` ${Math.floor(i / productNames.length) + 1}`;
          const category =
            categories[Math.floor(Math.random() * categories.length)];
          const price = Math.floor(Math.random() * 100) + 10;
          const stock = Math.floor(Math.random() * 100);
          let status: Product["status"];

          if (stock === 0) status = "out-of-stock";
          else if (stock < 10) status = "low-stock";
          else status = "in-stock";

          return {
            id: `P${(1000 + i).toString().padStart(3, "0")}`,
            name,
            category,
            price,
            stock,
            status,
            featured: Math.random() > 0.8, // 20% are featured
            image: `/placeholder.svg?height=80&width=80`,
            sales: Math.floor(Math.random() * 200),
            rating: Math.floor(Math.random() * 5) + 1,
          };
        });

        // Sort by sales (highest first)
        products.sort((a, b) => b.sales - a.sales);

        set({ products });
      },
      fetchChatMessages: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const users = [
          {
            id: "U1001",
            name: "Jane Smith",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "U1002",
            name: "John Doe",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "U1003",
            name: "Emily Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "U1004",
            name: "Michael Brown",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "U1005",
            name: "Sarah Wilson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ];

        const messageContents = [
          "Hello, I have a question about my recent order.",
          "When will my order be shipped?",
          "I'd like to return an item from my last purchase.",
          "Do you have this product in a different size?",
          "Is this product suitable for sensitive skin?",
          "Can you recommend a product for dry skin?",
          "I'm looking for a gift for my mother, any suggestions?",
          "How long does shipping usually take?",
          "Do you offer international shipping?",
          "I need help with my payment method.",
        ];

        // Generate 20 messages
        const messages: ChatMessage[] = Array.from({ length: 20 }, (_, i) => {
          const user = users[Math.floor(Math.random() * users.length)];
          const date = new Date();
          date.setHours(date.getHours() - Math.floor(Math.random() * 48)); // Last 48 hours

          return {
            id: `M${(1000 + i).toString().padStart(3, "0")}`,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            message:
              messageContents[
                Math.floor(Math.random() * messageContents.length)
              ],
            timestamp: date,
            read: Math.random() > 0.3, // 70% are read
            replied: Math.random() > 0.5, // 50% are replied
          };
        });

        // Sort by timestamp (newest first)
        messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        set({ chatMessages: messages });
      },
      updateOrderStatus: async (orderId, status) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          recentOrders: state.recentOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));

        return Promise.resolve();
      },
      updateProduct: async (productId, data) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...data } : product
          ),
        }));

        return Promise.resolve();
      },
      updateUser: async (userId, data) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, ...data } : user
          ),
        }));

        return Promise.resolve();
      },
      updateSettings: async (settings) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));

        return Promise.resolve();
      },
      markMessageAsRead: async (messageId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        set((state) => ({
          chatMessages: state.chatMessages.map((message) =>
            message.id === messageId ? { ...message, read: true } : message
          ),
        }));

        return Promise.resolve();
      },
      replyToMessage: async (messageId, reply) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          chatMessages: state.chatMessages.map((message) =>
            message.id === messageId ? { ...message, replied: true } : message
          ),
        }));

        return Promise.resolve();
      },
    }),
    {
      name: "admin-storage",
    }
  )
);
