import { supabase } from "@/lib/supabase";
import {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductWithDetails,
} from "./types";

// Fetch all products with optional filtering and pagination
export async function getProducts(
  options: {
    page?: number;
    per_page?: number;
    category_id?: string;
    is_featured?: boolean;
    is_new?: boolean;
    is_on_sale?: boolean;
    min_price?: number;
    max_price?: number;
    search?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  } = {}
): Promise<PaginatedResponse<Product>> {
  try {
    const {
      page = 1,
      per_page = 10,
      category_id,
      is_featured,
      is_new,
      is_on_sale,
      min_price,
      max_price,
      search,
      sort_by = "created_at",
      sort_order = "desc",
    } = options;

    // Calculate offset
    const offset = (page - 1) * per_page;

    // Start building query
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    // Apply filters
    if (category_id) {
      query = query.eq("category_id", category_id);
    }

    if (is_featured !== undefined) {
      query = query.eq("is_featured", is_featured);
    }

    if (is_new !== undefined) {
      query = query.eq("is_new", is_new);
    }

    if (is_on_sale !== undefined) {
      query = query.eq("is_on_sale", is_on_sale);
    }

    if (min_price !== undefined) {
      query = query.gte("price", min_price);
    }

    if (max_price !== undefined) {
      query = query.lte("price", max_price);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add pagination
    query = query.range(offset, offset + per_page - 1);

    // Add sorting
    query = query.order(sort_by, { ascending: sort_order === "asc" });

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
    console.error("Error fetching products:", error);
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
          : "An error occurred while fetching products",
    };
  }
}

// Fetch a single product by slug with all related data
export async function getProductBySlug(
  slug: string
): Promise<ApiResponse<ProductWithDetails>> {
  try {
    // Fetch product
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      throw error;
    }

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // Fetch category if product has a category_id
    let category = null;
    if (product.category_id) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("*")
        .eq("id", product.category_id)
        .single();

      category = categoryData;
    }

    // Fetch product images
    const { data: images } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", product.id)
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true });

    // Fetch product variants
    const { data: variants } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", product.id)
      .eq("is_active", true);

    // Fetch product options
    const { data: productOptions } = await supabase
      .from("product_options")
      .select(
        `
        id,
        option_type:option_types (*)
      `
      )
      .eq("product_id", product.id);

    // For each option type, fetch the option values
    const options = [];
    if (productOptions) {
      for (const productOption of productOptions) {
        if (productOption.option_type && productOption.option_type.id) {
          const { data: optionValues } = await supabase
            .from("option_values")
            .select("*")
            .eq("option_type_id", productOption.option_type.id)
            .order("sort_order", { ascending: true });

          options.push({
            option_type: productOption.option_type,
            option_values: optionValues || [],
          });
        }
      }
    }

    // Assemble the complete product data
    const productWithDetails: ProductWithDetails = {
      ...product,
      category,
      images: images || [],
      variants: variants || [],
      options: options || [],
    };

    return {
      success: true,
      data: productWithDetails,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the product",
    };
  }
}

// Get related products based on category
export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit: number = 4
): Promise<ApiResponse<Product[]>> {
  try {
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .neq("id", productId)
      .limit(limit);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // If not enough products from the same category, get random products
    if (data && data.length < limit) {
      const productIds = data.map((p) => p.id).join(",");

      const { data: randomProducts, error: randomError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .neq("id", productId)
        .not(
          productIds ? "id" : "id",
          productIds ? "in" : "eq",
          productIds || productId
        )
        .limit(limit - (data?.length || 0));

      if (randomError) {
        throw randomError;
      }

      return {
        success: true,
        data: [...(data || []), ...(randomProducts || [])],
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching related products",
    };
  }
}

// Fetch categories
export async function getCategories(): Promise<ApiResponse<Product[]>> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching categories",
    };
  }
}

// Search products by name or description
export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<ApiResponse<Product[]>> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while searching products",
    };
  }
}

// Get new arrivals
export async function getNewArrivals(
  limit: number = 8
): Promise<ApiResponse<Product[]>> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching new arrivals",
    };
  }
}

// Get featured products
export async function getFeaturedProducts(
  limit: number = 8
): Promise<ApiResponse<Product[]>> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(limit);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching featured products",
    };
  }
}

// Get on sale products
export async function getOnSaleProducts(
  limit: number = 8
): Promise<ApiResponse<Product[]>> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_on_sale", true)
      .not("compare_at_price", "is", null)
      .limit(limit);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching on sale products:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching on sale products",
    };
  }
}
