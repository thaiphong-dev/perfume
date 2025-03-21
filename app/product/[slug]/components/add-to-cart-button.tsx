"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProductWithDetails } from "@/lib/api/types";
import { addToCart } from "@/lib/api";

interface AddToCartButtonProps {
  product: ProductWithDetails;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Safely check stock quantity (with fallback to 0 if undefined)
  const stockQuantity = product.stock_quantity || 0;
  const isInStock = stockQuantity > 0;

  const incrementQuantity = () => {
    if (quantity < stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isInStock) return;

    setIsLoading(true);
    try {
      const response = await addToCart(product.id, quantity);

      if (response.success) {
        toast({
          title: "Added to cart",
          description: `${quantity} × ${product.name} has been added to your cart.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add item",
          description:
            response.error ||
            "There was a problem adding this item to your cart.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isInStock) return;

    setIsLoading(true);
    try {
      const response = await addToCart(product.id, quantity);

      if (response.success) {
        router.push("/checkout");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to proceed",
          description:
            response.error || "There was a problem processing your request.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || !isInStock || isLoading}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="h-8 px-3 flex items-center justify-center border border-input bg-background">
            {quantity}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={incrementQuantity}
            disabled={quantity >= stockQuantity || !isInStock || isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!isInStock || isLoading}
          variant="default"
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
        <Button
          className="flex-1"
          onClick={handleBuyNow}
          disabled={!isInStock || isLoading}
          variant="secondary"
        >
          {isLoading ? "Processing..." : "Buy Now"}
        </Button>
      </div>

      {/* Stock message */}
      {!isInStock && (
        <p className="text-red-500 text-sm">
          This product is currently out of stock.
        </p>
      )}
    </div>
  );
}
