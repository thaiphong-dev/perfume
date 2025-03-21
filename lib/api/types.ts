import { Database } from "@/lib/database.types";

// Define user types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

// Define product types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate =
  Database["public"]["Tables"]["categories"]["Update"];

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];
export type ProductImageInsert =
  Database["public"]["Tables"]["product_images"]["Insert"];
export type ProductImageUpdate =
  Database["public"]["Tables"]["product_images"]["Update"];

export type ProductVariant =
  Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductVariantInsert =
  Database["public"]["Tables"]["product_variants"]["Insert"];
export type ProductVariantUpdate =
  Database["public"]["Tables"]["product_variants"]["Update"];

export type OptionType = Database["public"]["Tables"]["option_types"]["Row"];
export type OptionTypeInsert =
  Database["public"]["Tables"]["option_types"]["Insert"];
export type OptionTypeUpdate =
  Database["public"]["Tables"]["option_types"]["Update"];

export type OptionValue = Database["public"]["Tables"]["option_values"]["Row"];
export type OptionValueInsert =
  Database["public"]["Tables"]["option_values"]["Insert"];
export type OptionValueUpdate =
  Database["public"]["Tables"]["option_values"]["Update"];

export type ProductOption =
  Database["public"]["Tables"]["product_options"]["Row"];
export type ProductOptionInsert =
  Database["public"]["Tables"]["product_options"]["Insert"];
export type ProductOptionUpdate =
  Database["public"]["Tables"]["product_options"]["Update"];

// Define order types
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInsert =
  Database["public"]["Tables"]["order_items"]["Insert"];
export type OrderItemUpdate =
  Database["public"]["Tables"]["order_items"]["Update"];

export type ShippingMethod =
  Database["public"]["Tables"]["shipping_methods"]["Row"];
export type ShippingMethodInsert =
  Database["public"]["Tables"]["shipping_methods"]["Insert"];
export type ShippingMethodUpdate =
  Database["public"]["Tables"]["shipping_methods"]["Update"];

export type PaymentMethod =
  Database["public"]["Tables"]["payment_methods"]["Row"];
export type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];
export type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type CouponInsert = Database["public"]["Tables"]["coupons"]["Insert"];
export type CouponUpdate = Database["public"]["Tables"]["coupons"]["Update"];

// Define user-related types
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];
export type AddressUpdate = Database["public"]["Tables"]["addresses"]["Update"];

export type Wishlist = Database["public"]["Tables"]["wishlists"]["Row"];
export type WishlistInsert =
  Database["public"]["Tables"]["wishlists"]["Insert"];
export type WishlistUpdate =
  Database["public"]["Tables"]["wishlists"]["Update"];

// Extended types with related data
export interface ProductWithDetails extends Product {
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  options?: Array<{
    option_type: OptionType;
    option_values: OptionValue[];
  }>;
}

export interface OrderWithDetails extends Order {
  items?: Array<
    OrderItem & {
      product?: Product;
      variant?: ProductVariant;
    }
  >;
  shipping_method?: ShippingMethod;
  payment_method?: PaymentMethod;
  user?: User;
}

export interface UserWithDetails extends User {
  addresses?: Address[];
  wishlists?: Array<
    Wishlist & {
      product: Product;
    }
  >;
  orders?: Order[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  error?: string;
}

// Shopping cart types
export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string | null;
  name: string;
  price: number;
  compare_at_price?: number | null;
  quantity: number;
  image_url?: string | null;
  options?: Record<string, string>;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping_fee?: number;
  tax?: number;
  discount?: number;
  coupon_code?: string | null;
  total: number;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}
