import { supabase } from "@/lib/supabase";
import { ApiResponse, Cart, CartItem, Product, ProductVariant } from "./types";

// Local storage key
const CART_STORAGE_KEY = "ecommerce_cart";

// Initialize empty cart
const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  total: 0,
};

/**
 * Get the current cart from localStorage
 */
export function getCart(): Cart {
  if (typeof window === "undefined") {
    return emptyCart;
  }

  const cartJson = localStorage.getItem(CART_STORAGE_KEY);
  if (!cartJson) {
    return emptyCart;
  }

  try {
    const cart = JSON.parse(cartJson) as Cart;
    return cart;
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return emptyCart;
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(cart: Cart): Cart {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let total = subtotal;

  // Apply shipping fee if applicable
  if (cart.shipping_fee) {
    total += cart.shipping_fee;
  }

  // Apply tax if applicable
  if (cart.tax) {
    total += cart.tax;
  }

  // Apply discount if applicable
  if (cart.discount) {
    total -= cart.discount;
  }

  return {
    ...cart,
    subtotal,
    total,
  };
}

/**
 * Add item to cart
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
  variantId?: string | null,
  options?: Record<string, string>
): Promise<ApiResponse<Cart>> {
  try {
    // Fetch current cart
    const cart = getCart();

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return {
        success: false,
        error: "Product not found or is inactive",
      };
    }

    // Fetch variant if specified
    let variant: ProductVariant | null = null;
    if (variantId) {
      const { data: variantData, error: variantError } = await supabase
        .from("product_variants")
        .select("*")
        .eq("id", variantId)
        .eq("product_id", productId)
        .eq("is_active", true)
        .single();

      if (variantError || !variantData) {
        return {
          success: false,
          error: "Product variant not found or is inactive",
        };
      }

      variant = variantData;
    }

    // Get product image
    const { data: images } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .eq("is_primary", true)
      .limit(1);

    const primaryImage = images && images.length > 0 ? images[0].url : null;

    // Create a unique ID for cart item (combination of product and variant)
    const itemId = variantId ? `${productId}_${variantId}` : productId;

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.id === itemId
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Create new cart item
      const newItem: CartItem = {
        id: itemId,
        product_id: productId,
        variant_id: variantId,
        name: variant ? variant.name : product.name,
        price: variant ? variant.price : product.price,
        compare_at_price: variant
          ? variant.compare_at_price
          : product.compare_at_price,
        quantity,
        image_url:
          variant && variant.image_url ? variant.image_url : primaryImage,
        options,
        product,
      };

      if (variant) {
        newItem.variant = variant;
      }

      cart.items.push(newItem);
    }

    // Recalculate cart totals
    const updatedCart = calculateCartTotals(cart);

    // Save to localStorage
    saveCart(updatedCart);

    return {
      success: true,
      data: updatedCart,
    };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while adding the item to cart",
    };
  }
}

/**
 * Update cart item quantity
 */
export function updateCartItemQuantity(
  itemId: string,
  quantity: number
): ApiResponse<Cart> {
  try {
    if (quantity < 1) {
      return removeCartItem(itemId);
    }

    const cart = getCart();
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return {
        success: false,
        error: "Item not found in cart",
      };
    }

    cart.items[itemIndex].quantity = quantity;

    const updatedCart = calculateCartTotals(cart);
    saveCart(updatedCart);

    return {
      success: true,
      data: updatedCart,
    };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating the cart",
    };
  }
}

/**
 * Remove item from cart
 */
export function removeCartItem(itemId: string): ApiResponse<Cart> {
  try {
    const cart = getCart();

    const updatedItems = cart.items.filter((item) => item.id !== itemId);
    const updatedCart = {
      ...cart,
      items: updatedItems,
    };

    const finalCart = calculateCartTotals(updatedCart);
    saveCart(finalCart);

    return {
      success: true,
      data: finalCart,
    };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while removing the item from cart",
    };
  }
}

/**
 * Clear the entire cart
 */
export function clearCart(): ApiResponse<Cart> {
  try {
    saveCart(emptyCart);

    return {
      success: true,
      data: emptyCart,
    };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while clearing the cart",
    };
  }
}

/**
 * Apply coupon to cart
 */
export async function applyCoupon(
  couponCode: string
): Promise<ApiResponse<Cart>> {
  try {
    const cart = getCart();

    // Validate coupon
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode)
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return {
        success: false,
        error: "Invalid or inactive coupon code",
      };
    }

    // Check if coupon is expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return {
        success: false,
        error: "Coupon has expired",
      };
    }

    // Check if coupon has reached usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return {
        success: false,
        error: "Coupon usage limit reached",
      };
    }

    // Check minimum order amount
    if (
      coupon.minimum_order_amount &&
      cart.subtotal < coupon.minimum_order_amount
    ) {
      return {
        success: false,
        error: `Minimum order amount for this coupon is ${coupon.minimum_order_amount}`,
      };
    }

    // Calculate discount amount
    let discount = 0;

    if (coupon.discount_type === "percentage") {
      discount = cart.subtotal * (coupon.discount_value / 100);
    } else if (coupon.discount_type === "fixed") {
      discount = coupon.discount_value;
    }

    // Apply maximum discount if applicable
    if (coupon.maximum_discount && discount > coupon.maximum_discount) {
      discount = coupon.maximum_discount;
    }

    // Update cart
    const updatedCart: Cart = {
      ...cart,
      coupon_code: couponCode,
      discount,
    };

    const finalCart = calculateCartTotals(updatedCart);
    saveCart(finalCart);

    return {
      success: true,
      data: finalCart,
    };
  } catch (error) {
    console.error("Error applying coupon:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while applying the coupon",
    };
  }
}

/**
 * Remove coupon from cart
 */
export function removeCoupon(): ApiResponse<Cart> {
  try {
    const cart = getCart();

    const updatedCart: Cart = {
      ...cart,
      coupon_code: null,
      discount: 0,
    };

    const finalCart = calculateCartTotals(updatedCart);
    saveCart(finalCart);

    return {
      success: true,
      data: finalCart,
    };
  } catch (error) {
    console.error("Error removing coupon:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while removing the coupon",
    };
  }
}

/**
 * Apply shipping method to cart
 */
export async function applyShipping(
  shippingMethodId: string
): Promise<ApiResponse<Cart>> {
  try {
    const cart = getCart();

    // Fetch shipping method
    const { data: shippingMethod, error } = await supabase
      .from("shipping_methods")
      .select("*")
      .eq("id", shippingMethodId)
      .eq("is_active", true)
      .single();

    if (error || !shippingMethod) {
      return {
        success: false,
        error: "Invalid or inactive shipping method",
      };
    }

    // Update cart
    const updatedCart: Cart = {
      ...cart,
      shipping_method_id: shippingMethodId,
      shipping_fee: shippingMethod.price,
    };

    const finalCart = calculateCartTotals(updatedCart);
    saveCart(finalCart);

    return {
      success: true,
      data: finalCart,
    };
  } catch (error) {
    console.error("Error applying shipping method:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while applying the shipping method",
    };
  }
}

/**
 * Get available shipping methods
 */
export async function getShippingMethods(): Promise<ApiResponse<any[]>> {
  try {
    const { data, error } = await supabase
      .from("shipping_methods")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching shipping methods",
    };
  }
}
