import { supabase } from "@/lib/supabase";
import { ApiResponse, Address, User, UserWithDetails, Wishlist } from "./types";

/**
 * Get the current user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.session.user.id)
      .single();

    if (error) {
      throw error;
    }

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching user profile",
    };
  }
}

/**
 * Get user profile with details (addresses, wishlists)
 */
export async function getUserWithDetails(): Promise<
  ApiResponse<UserWithDetails>
> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    // Fetch user profile
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      throw userError;
    }

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Fetch addresses
    const { data: addresses, error: addressesError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default_shipping", { ascending: false })
      .order("is_default_billing", { ascending: false })
      .order("created_at", { ascending: false });

    if (addressesError) {
      throw addressesError;
    }

    // Fetch wishlists with product details
    const { data: wishlists, error: wishlistsError } = await supabase
      .from("wishlists")
      .select(
        `
        *,
        product:products (*)
      `
      )
      .eq("user_id", userId);

    if (wishlistsError) {
      throw wishlistsError;
    }

    // Fetch recent orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (ordersError) {
      throw ordersError;
    }

    const userWithDetails: UserWithDetails = {
      ...user,
      addresses: addresses || [],
      wishlists: wishlists || [],
      orders: orders || [],
    };

    return {
      success: true,
      data: userWithDetails,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching user details",
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userData: Partial<User>
): Promise<ApiResponse<User>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    // Remove any fields that shouldn't be updated directly
    const { id, created_at, updated_at, ...updateData } = userData;

    // Add updated_at timestamp
    Object.assign(updateData, { updated_at: new Date().toISOString() });

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
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
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating user profile",
    };
  }
}

/**
 * Add a new address
 */
export async function addAddress(
  addressData: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">
): Promise<ApiResponse<Address>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    // Check if this is the user's first address and set as default if it is
    const { data: existingAddresses, error: countError } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId);

    if (countError) {
      throw countError;
    }

    const isFirstAddress = !existingAddresses || existingAddresses.length === 0;

    // Prepare address data
    const newAddress = {
      ...addressData,
      user_id: userId,
      is_default_shipping: addressData.is_default_shipping || isFirstAddress,
      is_default_billing: addressData.is_default_billing || isFirstAddress,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // If this address is set as default, update other addresses
    if (newAddress.is_default_shipping) {
      await supabase
        .from("addresses")
        .update({ is_default_shipping: false })
        .eq("user_id", userId)
        .eq("is_default_shipping", true);
    }

    if (newAddress.is_default_billing) {
      await supabase
        .from("addresses")
        .update({ is_default_billing: false })
        .eq("user_id", userId)
        .eq("is_default_billing", true);
    }

    // Insert new address
    const { data, error } = await supabase
      .from("addresses")
      .insert(newAddress)
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
    console.error("Error adding address:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while adding the address",
    };
  }
}

/**
 * Update an existing address
 */
export async function updateAddress(
  addressId: string,
  addressData: Partial<Address>
): Promise<ApiResponse<Address>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    // Get current address data
    const { data: currentAddress, error: fetchError } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!currentAddress) {
      return {
        success: false,
        error: "Address not found or does not belong to user",
      };
    }

    // Remove any fields that shouldn't be updated directly
    const { id, user_id, created_at, ...updateData } = addressData;

    // Add updated_at timestamp
    Object.assign(updateData, { updated_at: new Date().toISOString() });

    // If this address is being set as default, update other addresses
    if (updateData.is_default_shipping && !currentAddress.is_default_shipping) {
      await supabase
        .from("addresses")
        .update({ is_default_shipping: false })
        .eq("user_id", userId)
        .eq("is_default_shipping", true);
    }

    if (updateData.is_default_billing && !currentAddress.is_default_billing) {
      await supabase
        .from("addresses")
        .update({ is_default_billing: false })
        .eq("user_id", userId)
        .eq("is_default_billing", true);
    }

    // Update address
    const { data, error } = await supabase
      .from("addresses")
      .update(updateData)
      .eq("id", addressId)
      .eq("user_id", userId)
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
    console.error("Error updating address:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating the address",
    };
  }
}

/**
 * Delete an address
 */
export async function deleteAddress(
  addressId: string
): Promise<ApiResponse<void>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    // Check if address exists and belongs to user
    const { data: address, error: fetchError } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!address) {
      return {
        success: false,
        error: "Address not found or does not belong to user",
      };
    }

    // If this is a default address, find another address to make default
    if (address.is_default_shipping || address.is_default_billing) {
      const { data: otherAddresses, error: otherError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .neq("id", addressId)
        .limit(1);

      if (!otherError && otherAddresses && otherAddresses.length > 0) {
        const updates: Partial<Address> = {};

        if (address.is_default_shipping) {
          updates.is_default_shipping = true;
        }

        if (address.is_default_billing) {
          updates.is_default_billing = true;
        }

        await supabase
          .from("addresses")
          .update(updates)
          .eq("id", otherAddresses[0].id);
      }
    }

    // Delete address
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the address",
    };
  }
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(
  productId: string
): Promise<ApiResponse<Wishlist>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // Check if product is already in wishlist
    const { data: existing, error: existingError } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (existingError) {
      throw existingError;
    }

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: "Product is already in wishlist",
      };
    }

    // Add to wishlist
    const { data, error } = await supabase
      .from("wishlists")
      .insert({
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        product:products (*)
      `
      )
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while adding to wishlist",
    };
  }
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(
  productId: string
): Promise<ApiResponse<void>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      throw error;
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while removing from wishlist",
    };
  }
}

/**
 * Get user's wishlist
 */
export async function getWishlist(): Promise<ApiResponse<Wishlist[]>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    const { data, error } = await supabase
      .from("wishlists")
      .select(
        `
        *,
        product:products (*)
      `
      )
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching wishlist",
    };
  }
}

/**
 * Check if a product is in the user's wishlist
 */
export async function isInWishlist(
  productId: string
): Promise<ApiResponse<boolean>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const userId = session.session.user.id;

    const { data, error } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data && data.length > 0,
    };
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while checking wishlist",
    };
  }
}
