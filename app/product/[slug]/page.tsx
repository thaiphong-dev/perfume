import { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";
import { ProductWithDetails } from "@/lib/api/types";
import ProductDetail from "./components/product-detail";

// Generate metadata for the product page based on the slug
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const response = await getProductBySlug(params.slug);
    const product = response.success ? response.data : null;

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: `${product.name} - Perfume Store`,
      description:
        product.description || "Discover our range of luxury perfumes.",
      openGraph: {
        images:
          product.images && product.images.length > 0
            ? [{ url: product.images[0].url }]
            : [{ url: "/placeholder.svg?height=400&width=400" }],
      },
    };
  } catch (error) {
    return {
      title: "Perfume Store",
      description: "Discover our range of luxury perfumes.",
    };
  }
}

// Server component that passes the slug to the client component
export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />;
}
