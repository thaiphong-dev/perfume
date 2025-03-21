"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Newsletter from "@/components/newsletter";
import ShopSidebar from "@/components/shop-sidebar";
import { getProducts, getCategories } from "@/lib/api";
import {
  Product,
  Category,
  ProductWithDetails,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/api/types";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  // Get URL parameters
  const categoryId = searchParams.get("category");
  const minPrice = searchParams.get("min_price")
    ? parseInt(searchParams.get("min_price")!)
    : undefined;
  const maxPrice = searchParams.get("max_price")
    ? parseInt(searchParams.get("max_price")!)
    : undefined;
  const fragrance = searchParams.get("fragrance");
  const sortOption = searchParams.get("sort") || "featured";
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  // Set up state
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate discounted price for display
  const getDiscountedPrice = (product: Product) => {
    if (product.compare_at_price && product.compare_at_price > product.price) {
      return {
        originalPrice: product.compare_at_price,
        currentPrice: product.price,
        discountPercentage: Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        ),
      };
    }
    return {
      originalPrice: null,
      currentPrice: product.price,
      discountPercentage: null,
    };
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/shop?${params.toString()}`);
  };

  // Add to cart handler
  const handleAddToCart = (product: ProductWithDetails) => {
    addToCart(
      {
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        image:
          product.images && product.images.length > 0
            ? product.images[0].url
            : "/placeholder.svg?height=200&width=200",
      },
      1
    );

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Determine sort parameters
        let sortBy: string;
        if (sortOption === "featured") sortBy = "is_featured";
        else if (sortOption === "newest") sortBy = "created_at";
        else if (sortOption === "price-low" || sortOption === "price-high")
          sortBy = "price";
        else sortBy = "created_at";

        const sortOrder = sortOption === "price-high" ? "desc" : "asc";

        // Prepare API parameters
        const apiParams: any = {
          page,
          per_page: 16,
          sort_by: sortBy,
          sort_order: sortOrder,
        };

        // Add filters if present
        if (categoryId) apiParams.category_id = categoryId;
        if (minPrice) apiParams.min_price = minPrice;
        if (maxPrice) apiParams.max_price = maxPrice;

        // Handle fragrance filter
        if (fragrance) apiParams.tags = fragrance;

        // Call API
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(apiParams),
          getCategories(),
        ]);

        // Update state with API data
        if (productsResponse.success) {
          // Create ProductWithDetails objects by adding empty arrays for potentially missing properties
          const productsWithDetails = productsResponse.data.map((product) => ({
            ...product,
            images: [] as ProductWithDetails["images"],
          }));

          setProducts(productsWithDetails);
          setTotalPages(productsResponse.total_pages || 1);
        }

        if (categoriesResponse.success) {
          // We know from the API function that getCategories returns Category[]
          setCategories(categoriesResponse.data as unknown as Category[]);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    searchParams,
    page,
    categoryId,
    minPrice,
    maxPrice,
    fragrance,
    sortOption,
  ]);

  // Function to generate pagination URLs
  const getPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    return `/shop?${params.toString()}`;
  };

  // Get current category name for display
  const currentCategory = categoryId
    ? categories.find((cat) => cat.id === categoryId)?.name
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-[#6D5D60]">
              <Link href="/" className="hover:text-[#4A3034]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-[#4A3034]">Shop</span>
              {currentCategory && (
                <>
                  <span className="mx-2">/</span>
                  <span className="font-medium text-[#4A3034]">
                    {currentCategory}
                  </span>
                </>
              )}
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Sidebar - Mobile Toggle */}
            <div className="mb-4 lg:hidden">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() =>
                  document
                    .getElementById("mobile-filters")
                    ?.classList.toggle("hidden")
                }
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Products
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {/* Mobile filters */}
              <div id="mobile-filters" className="hidden mt-4">
                <ShopSidebar categories={categories} />
              </div>
            </div>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
              <ShopSidebar categories={categories} />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4 xl:w-4/5">
              {/* Category Header */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold text-[#4A3034]">
                  {currentCategory ? (
                    <>
                      <span className="text-[#6D5D60]">ALL &gt;</span>{" "}
                      {currentCategory.toUpperCase()}
                    </>
                  ) : (
                    "ALL PRODUCTS"
                  )}
                </h1>
                <div className="mt-4 flex items-center sm:mt-0">
                  <span className="mr-2 text-sm text-[#6D5D60]">Sort by:</span>
                  <Select value={sortOption} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A3034]"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => {
                    const { originalPrice, currentPrice, discountPercentage } =
                      getDiscountedPrice(product);
                    const productImageUrl =
                      product.images &&
                      Array.isArray(product.images) &&
                      product.images.length > 0
                        ? product.images[0].url
                        : "/placeholder.svg?height=200&width=200";

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg overflow-hidden shadow-sm"
                      >
                        <div className="relative aspect-square">
                          <Link href={`/product/${product.slug}`}>
                            <Image
                              src={productImageUrl}
                              alt={product.name}
                              fill
                              className="object-contain p-2"
                            />
                          </Link>
                          {product.is_new && (
                            <span className="absolute left-2 top-2 rounded bg-black px-1.5 py-0.5 text-xs font-medium text-white">
                              NEW
                            </span>
                          )}
                          {discountPercentage && (
                            <span className="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
                              -{discountPercentage}%
                            </span>
                          )}
                          <button className="absolute right-2 top-2 rounded-full bg-white p-1.5 opacity-70 transition-opacity hover:opacity-100">
                            <Heart className="h-4 w-4 text-[#4A3034]" />
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="mb-1 text-xs uppercase text-gray-500">
                            {product.category?.name || "PERFUME"}
                          </div>
                          <h3 className="mb-2 text-sm font-medium text-[#4A3034]">
                            <Link href={`/product/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold text-[#4A3034]">
                                {formatPrice(currentPrice)}
                              </span>
                              {originalPrice && (
                                <span className="ml-2 text-xs text-gray-500 line-through">
                                  {formatPrice(originalPrice)}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                              onClick={() => handleAddToCart(product)}
                            >
                              ADD TO CART
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-[#4A3034]">
                    No products found
                  </h3>
                  <p className="text-[#6D5D60] mt-2">
                    Try changing your filters or search criteria
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex space-x-1">
                    {page > 1 && (
                      <Link href={getPaginationUrl(page - 1)}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          &lt;
                        </Button>
                      </Link>
                    )}

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // For pagination with more than 5 pages, show ellipsis
                      const pageNum =
                        page <= 3
                          ? i + 1
                          : page >= totalPages - 2
                          ? totalPages - 4 + i
                          : page - 2 + i;

                      return pageNum <= totalPages ? (
                        <Link key={pageNum} href={getPaginationUrl(pageNum)}>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-8 w-8 p-0 ${
                              pageNum === page ? "bg-[#4A3034] text-white" : ""
                            }`}
                          >
                            {pageNum}
                          </Button>
                        </Link>
                      ) : null;
                    })}

                    {page < totalPages && (
                      <Link href={getPaginationUrl(page + 1)}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          &gt;
                        </Button>
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
