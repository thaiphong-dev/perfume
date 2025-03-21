"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Newsletter from "@/components/newsletter";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";
import { ProductWithDetails } from "@/lib/api/types";

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const { toast } = useToast();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await getProductBySlug(slug);

        if (!response.success || !response.data) {
          setError("Product not found");
          return;
        }

        const productData = response.data;
        setProduct(productData);

        // Fetch related products
        if (productData.id && productData.category_id) {
          const relatedResponse = await getRelatedProducts(
            productData.id,
            productData.category_id,
            4
          );

          if (relatedResponse.success && relatedResponse.data) {
            setRelatedProducts(relatedResponse.data as ProductWithDetails[]);
          }
        }
      } catch (error) {
        setError("Failed to load product data");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const productImage =
      product.images && product.images.length > 0
        ? product.images[0].url
        : "/placeholder.svg?height=400&width=400";

    addToCart(
      {
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        image: productImage,
      },
      quantity
    );

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;

    const productImage =
      product.images && product.images.length > 0
        ? product.images[0].url
        : "/placeholder.svg?height=400&width=400";

    addToCart(
      {
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        image: productImage,
      },
      quantity
    );

    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate discount percentage
  const getDiscountPercentage = (product: ProductWithDetails) => {
    if (product.compare_at_price && product.compare_at_price > product.price) {
      return Math.round(
        ((product.compare_at_price - product.price) /
          product.compare_at_price) *
          100
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A3034]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#4A3034] mb-4">
              Product Not Found
            </h1>
            <p className="text-[#6D5D60] mb-6">
              The product you are looking for does not exist or has been
              removed.
            </p>
            <Link href="/shop">
              <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Prepare product images array
  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : ["/placeholder.svg?height=400&width=400"];

  // Get discount percentage if exists
  const discountPercentage = getDiscountPercentage(product);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8">
          <nav className="flex text-sm text-[#6D5D60]">
            <Link href="/" className="hover:text-[#4A3034]">
              HOME
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-[#4A3034]">
              SHOP
            </Link>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <Link
                  href={`/shop?category=${product.category.id}`}
                  className="hover:text-[#4A3034]"
                >
                  {product.category.name.toUpperCase()}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="font-medium text-[#4A3034]">
              {product.name.toUpperCase()}
            </span>
          </nav>
        </div>

        {/* Product Detail */}
        <section className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-auto">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={`relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${
                        index === selectedImage
                          ? "border-[#4A3034]"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#4A3034]">
                  {product.name}
                </h1>
                <p className="mt-1 text-lg text-[#6D5D60]">
                  {product.sku && `SKU: ${product.sku}`}
                </p>
              </div>

              {/* Price */}
              <div className="text-xl font-bold text-[#4A3034]">
                {formatPrice(product.price)}
                {product.compare_at_price &&
                  product.compare_at_price > product.price && (
                    <span className="ml-2 text-lg line-through text-gray-500">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                {discountPercentage && (
                  <span className="ml-2 text-sm text-red-500">
                    ({discountPercentage}% OFF)
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="text-sm">
                <span className="font-medium">Availability:</span>{" "}
                <span
                  className={
                    product.stock_quantity && product.stock_quantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {product.stock_quantity && product.stock_quantity > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#4A3034]">QTY</p>
                <div className="flex w-32 items-center">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50"
                    onClick={decrementQuantity}
                    disabled={
                      !product.stock_quantity || product.stock_quantity <= 0
                    }
                  >
                    <Minus className="h-4 w-4 text-[#4A3034]" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity || 1}
                    value={quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 1;
                      const max = product.stock_quantity || 1;
                      setQuantity(Math.min(value, max));
                    }}
                    className="h-10 w-12 border-y border-gray-300 bg-white text-center text-sm"
                    disabled={
                      !product.stock_quantity || product.stock_quantity <= 0
                    }
                  />
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50"
                    onClick={incrementQuantity}
                    disabled={
                      !product.stock_quantity ||
                      quantity >= product.stock_quantity
                    }
                  >
                    <Plus className="h-4 w-4 text-[#4A3034]" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  className="flex-1 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                  onClick={handleAddToCart}
                  disabled={
                    !product.stock_quantity || product.stock_quantity <= 0
                  }
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                  onClick={handleBuyNow}
                  disabled={
                    !product.stock_quantity || product.stock_quantity <= 0
                  }
                >
                  Buy Now
                </Button>
              </div>

              {!product.stock_quantity ||
                (product.stock_quantity <= 0 && (
                  <p className="text-red-500 text-sm">
                    This product is currently out of stock.
                  </p>
                ))}
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b bg-transparent p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-[#4A3034] data-[state=active]:bg-transparent"
                >
                  DESCRIPTION
                </TabsTrigger>
                <TabsTrigger
                  value="information"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-[#4A3034] data-[state=active]:bg-transparent"
                >
                  MORE INFORMATION
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="description"
                className="mt-4 text-sm leading-relaxed text-[#6D5D60]"
              >
                <p className="mb-4">{product.description}</p>
              </TabsContent>
              <TabsContent
                value="information"
                className="mt-4 text-sm leading-relaxed text-[#6D5D60]"
              >
                <div className="space-y-4">
                  {product.sku && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="font-medium">SKU</div>
                      <div>{product.sku}</div>
                    </div>
                  )}
                  {product.category && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="font-medium">Category</div>
                      <div>{product.category.name}</div>
                    </div>
                  )}
                  {product.barcode && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="font-medium">Barcode</div>
                      <div>{product.barcode}</div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#FFF5F2] py-12">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <h2 className="mb-6 text-2xl font-bold text-[#4A3034]">
                Related Products
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => {
                  const relatedProductImage =
                    relatedProduct.images && relatedProduct.images.length > 0
                      ? relatedProduct.images[0].url
                      : "/placeholder.svg?height=200&width=200";

                  const relatedDiscountPercentage =
                    getDiscountPercentage(relatedProduct);

                  return (
                    <div
                      key={relatedProduct.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="relative aspect-square">
                        <Link href={`/product/${relatedProduct.slug}`}>
                          <Image
                            src={relatedProductImage}
                            alt={relatedProduct.name}
                            fill
                            className="object-contain p-2"
                          />
                        </Link>
                        {relatedProduct.is_new && (
                          <span className="absolute left-2 top-2 rounded bg-black px-1.5 py-0.5 text-xs font-medium text-white">
                            NEW
                          </span>
                        )}
                        {relatedDiscountPercentage && (
                          <span className="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
                            -{relatedDiscountPercentage}%
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="mb-2 text-sm font-medium text-[#4A3034]">
                          <Link href={`/product/${relatedProduct.slug}`}>
                            {relatedProduct.name}
                          </Link>
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold text-[#4A3034]">
                              {formatPrice(relatedProduct.price)}
                            </span>
                            {relatedProduct.compare_at_price &&
                              relatedProduct.compare_at_price >
                                relatedProduct.price && (
                                <span className="ml-2 text-xs text-gray-500 line-through">
                                  {formatPrice(relatedProduct.compare_at_price)}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
