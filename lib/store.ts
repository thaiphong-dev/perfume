import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import enTranslations from "./locales/en.json";
import viTranslations from "./locales/vi.json";

// Cart Store
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  itemCount: number;
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addToCart: (item, quantity) => {
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id
          );

          let newItems;
          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item to cart
            newItems = [...state.items, { ...item, quantity }];
          }

          const newItemCount = newItems.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return {
            items: newItems,
            itemCount: newItemCount,
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const newItemCount = newItems.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return {
            items: newItems,
            itemCount: newItemCount,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeFromCart(id), state;
          }

          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );

          const newItemCount = newItems.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return {
            items: newItems,
            itemCount: newItemCount,
          };
        });
      },

      clearCart: () => {
        set({ items: [], itemCount: 0 });
      },
    }),
    {
      name: "nire-beauty-cart", // name of the item in localStorage
    }
  )
);

// User Authentication Store
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Get additional user data from the users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (userError) throw userError;

          set({
            user: {
              id: data.user.id,
              name: userData.name || data.user.email?.split("@")[0] || "",
              email: data.user.email || "",
              ...userData,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Login error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred during login",
            isLoading: false,
          });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name || email.split("@")[0],
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;

          set({
            user: {
              id: data.user?.id || "",
              name: name || email.split("@")[0],
              email: email,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Registration error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred during registration",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred during logout",
          });
        }
      },

      updateProfile: async (userData) => {
        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error) throw error;
          if (!user) throw new Error("No user found");

          // Update user data in the users table
          const { error: updateError } = await supabase
            .from("users")
            .update(userData)
            .eq("id", user.id);

          if (updateError) throw updateError;

          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        } catch (error) {
          console.error("Profile update error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred while updating profile",
          });
        }
      },
    }),
    {
      name: "nire-beauty-auth", // name of the item in localStorage
    }
  )
);

// Language Store
type Language = "en" | "vi";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<Language, Record<string, string>>;
  t: (key: string) => string;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",

      setLanguage: (language) => {
        set({ language });
      },

      translations: {
        en: enTranslations,
        vi: viTranslations,
      },

      t: (key) => {
        const { language, translations } = get();
        return translations[language][key] || key;
      },
    }),
    {
      name: "nire-beauty-language", // name of the item in localStorage
    }
  )
);

// Search Store
type SearchState = {
  query: string;
  results: any[];
  isSearching: boolean;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  clearSearch: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: [],
  isSearching: false,

  setQuery: (query) => {
    set({ query });
  },

  search: (query) => {
    set({ isSearching: true, query });

    // Simulate search API call
    setTimeout(() => {
      // Sample search results
      const results =
        query.trim() === ""
          ? []
          : [
              {
                id: 1,
                name: "Facial Cleanser",
                price: 29.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Skin Care",
              },
              {
                id: 2,
                name: "Moisturizer",
                price: 34.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Skin Care",
              },
              {
                id: 3,
                name: "Face Serum",
                price: 49.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Skin Care",
              },
              {
                id: 6,
                name: "Perfume Collection",
                price: 59.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Fragrance",
              },
              {
                id: 11,
                name: "Beauty Tool",
                price: 19.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Accessories",
              },
            ].filter(
              (product) =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );

      set({ results, isSearching: false });
    }, 500);
  },

  clearSearch: () => {
    set({ query: "", results: [], isSearching: false });
  },
}));
