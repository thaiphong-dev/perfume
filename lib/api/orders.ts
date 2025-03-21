import { supabase } from "@/lib/supabase";
import {
  ApiResponse,
  Cart,
  Order,
  OrderWithDetails,
  PaginatedResponse,
} from "./types";
import { clearCart } from "./cart";

/**
 * Create a new order from cart data
 */
export async function createOrder(
  userId: string,
  cart: Cart,
  shippingAddress: any,
  billingAddress: any,
  paymentMethodId: string,
  notes?: string
): Promise<ApiResponse<Order>> {
  try {
    // Validate input
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        success: false,
        error: "Cart is empty",
      };
    }

    if (!shippingAddress) {
      return {
        success: false,
        error: "Shipping address is required",
      };
    }

    if (!billingAddress) {
      return {
        success: false,
        error: "Billing address is required",
      };
    }

    if (!paymentMethodId) {
      return {
        success: false,
        error: "Payment method is required",
      };
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_number: orderNumber,
        status: "pending",
        subtotal: cart.subtotal,
        shipping_fee: cart.shipping_fee || 0,
        tax: cart.tax || 0,
        discount: cart.discount || 0,
        total: cart.total,
        coupon_code: cart.coupon_code,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: paymentMethodId,
        payment_status: "pending",
        notes,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items for each product in the cart
    const orderItems = cart.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.name,
      sku: item.product?.sku || null,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      options: item.options || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    // Clear the cart after successful order
    clearCart();

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while creating the order",
    };
  }
}

/**
 * Get orders for a specific user
 */
export async function getUserOrders(
  userId: string,
  options: {
    page?: number;
    per_page?: number;
    status?: string;
  } = {}
): Promise<PaginatedResponse<Order>> {
  try {
    const { page = 1, per_page = 10, status } = options;

    // Calculate offset
    const offset = (page - 1) * per_page;

    // Start building query
    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    // Add pagination
    query = query.range(offset, offset + per_page - 1);

    // Add sorting by created_at, newest first
    query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
      total: count || 0,
      page,
      per_page,
      total_pages: count ? Math.ceil(count / per_page) : 0,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      data: [],
      total: 0,
      page: options.page || 1,
      per_page: options.per_page || 10,
      total_pages: 0,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching orders",
    };
  }
}

/**
 * Get order details by ID
 */
export async function getOrderById(
  orderId: string
): Promise<ApiResponse<OrderWithDetails>> {
  try {
    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      throw orderError;
    }

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(
        `
        *,
        product:products (*),
        variant:product_variants (*)
      `
      )
      .eq("order_id", orderId);

    if (itemsError) {
      throw itemsError;
    }

    // Fetch shipping method if applicable
    let shippingMethod = null;
    if (order.payment_method) {
      const { data: shippingMethodData } = await supabase
        .from("shipping_methods")
        .select("*")
        .eq("id", order.payment_method)
        .single();

      shippingMethod = shippingMethodData;
    }

    // Fetch payment method if applicable
    let paymentMethod = null;
    if (order.payment_method) {
      const { data: paymentMethodData } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("id", order.payment_method)
        .single();

      paymentMethod = paymentMethodData;
    }

    // Assemble complete order details
    const orderWithDetails: OrderWithDetails = {
      ...order,
      items: orderItems || [],
      shipping_method: shippingMethod,
      payment_method: paymentMethod as any, // Type coercion to satisfy the TypeScript compiler
    };

    return {
      success: true,
      data: orderWithDetails,
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching order details",
    };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string
): Promise<ApiResponse<Order>> {
  try {
    const updateData: any = { status };

    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating order status",
    };
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  orderId: string
): Promise<ApiResponse<Order>> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while cancelling the order",
    };
  }
}

/**
 * Get order counts by status for a user
 */
export async function getUserOrderCounts(
  userId: string
): Promise<ApiResponse<Record<string, number>>> {
  try {
    // Fetch all statuses first
    const { data: statuses, error: statusesError } = await supabase
      .from("orders")
      .select("status")
      .eq("user_id", userId);

    if (statusesError) {
      throw statusesError;
    }

    // Count orders by status
    const counts: Record<string, number> = {
      all: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    if (statuses) {
      // Count total orders
      counts.all = statuses.length;

      // Count by status
      statuses.forEach((item) => {
        const status = item.status.toLowerCase();
        if (counts.hasOwnProperty(status)) {
          counts[status]++;
        }
      });
    }

    return {
      success: true,
      data: counts,
    };
  } catch (error) {
    console.error("Error fetching order counts:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching order counts",
    };
  }
}
