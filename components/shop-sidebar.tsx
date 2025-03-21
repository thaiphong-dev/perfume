"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Category } from "@/lib/api/types";

interface ShopSidebarProps {
  categories: Category[];
}

export default function ShopSidebar({ categories }: ShopSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL
  const initialCategory = searchParams.get("category") || undefined;
  const initialMinPrice = searchParams.get("min_price")
    ? parseInt(searchParams.get("min_price")!)
    : 0;
  const initialMaxPrice = searchParams.get("max_price")
    ? parseInt(searchParams.get("max_price")!)
    : 500;
  const initialFragrance = searchParams.get("fragrance") || undefined;

  // Set up state
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategory
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    initialMinPrice,
    initialMaxPrice,
  ]);
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>(
    initialFragrance ? initialFragrance.split(",") : []
  );

  // Prepare lists of filter options
  const fragranceFilters = [
    { id: "vanilla", label: "Vanilla" },
    { id: "musk", label: "Musk" },
    { id: "rose", label: "Rose" },
    { id: "sandalwood", label: "Sandalwood" },
    { id: "jasmine", label: "Jasmine" },
    { id: "lavender", label: "Lavender" },
    { id: "citrus", label: "Citrus" },
    { id: "woody", label: "Woody" },
    { id: "floral", label: "Floral" },
    { id: "fresh", label: "Fresh" },
    { id: "oriental", label: "Oriental" },
  ];

  const priceFilters = [
    { id: "under-50", label: "Under $50", value: [0, 50] },
    { id: "50-100", label: "$50 - $100", value: [50, 100] },
    { id: "100-200", label: "$100 - $200", value: [100, 200] },
    { id: "over-200", label: "Over $200", value: [200, 500] },
  ];

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Handle fragrance selection
  const handleFragranceChange = (fragranceId: string, checked: boolean) => {
    if (checked) {
      setSelectedFragrances((prev) => [...prev, fragranceId]);
    } else {
      setSelectedFragrances((prev) => prev.filter((id) => id !== fragranceId));
    }
  };

  // Handle price filter from presets
  const handlePricePresetChange = (range: number[]) => {
    setPriceRange(range);
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle category
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    // Handle price range
    if (priceRange[0] > 0) {
      params.set("min_price", priceRange[0].toString());
    } else {
      params.delete("min_price");
    }

    if (priceRange[1] < 500) {
      params.set("max_price", priceRange[1].toString());
    } else {
      params.delete("max_price");
    }

    // Handle fragrances
    if (selectedFragrances.length > 0) {
      params.set("fragrance", selectedFragrances.join(","));
    } else {
      params.delete("fragrance");
    }

    // Keep existing sort parameter if present
    const sortBy = searchParams.get("sort");
    if (sortBy) {
      params.set("sort", sortBy);
    }

    // Navigate to the new URL
    router.push(`/shop?${params.toString()}`);
  }, [router, searchParams, selectedCategory, priceRange, selectedFragrances]);

  // Render category filter group
  const renderCategoryFilter = () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="CATEGORIES"
      className="border-b border-gray-200"
    >
      <AccordionItem value="CATEGORIES" className="border-0">
        <AccordionTrigger className="py-3 text-sm font-bold uppercase text-[#4A3034] hover:no-underline">
          CATEGORIES
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pb-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Checkbox
                    id={`category-${category.id}`}
                    className="mr-2 h-4 w-4 rounded-sm border-gray-300"
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-xs text-[#6D5D60] cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  // Render fragrance filter group
  const renderFragranceFilter = () => (
    <Accordion
      type="single"
      collapsible
      defaultValue="FRAGRANCE"
      className="border-b border-gray-200"
    >
      <AccordionItem value="FRAGRANCE" className="border-0">
        <AccordionTrigger className="py-3 text-sm font-bold uppercase text-[#4A3034] hover:no-underline">
          FRAGRANCE
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pb-4">
            {fragranceFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Checkbox
                    id={filter.id}
                    className="mr-2 h-4 w-4 rounded-sm border-gray-300"
                    checked={selectedFragrances.includes(filter.id)}
                    onCheckedChange={(checked) =>
                      handleFragranceChange(filter.id, checked === true)
                    }
                  />
                  <label
                    htmlFor={filter.id}
                    className="text-xs text-[#6D5D60] cursor-pointer"
                  >
                    {filter.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-[#4A3034]">SHOP BY</h2>

      {renderCategoryFilter()}
      {renderFragranceFilter()}

      <Accordion
        type="single"
        collapsible
        defaultValue="price"
        className="border-b border-gray-200"
      >
        <AccordionItem value="price" className="border-0">
          <AccordionTrigger className="py-3 text-sm font-bold uppercase text-[#4A3034] hover:no-underline">
            PRICE
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-4">
              {priceFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Checkbox
                      id={filter.id}
                      className="mr-2 h-4 w-4 rounded-sm border-gray-300"
                      checked={
                        priceRange[0] === filter.value[0] &&
                        priceRange[1] === filter.value[1]
                      }
                      onCheckedChange={() =>
                        handlePricePresetChange(filter.value)
                      }
                    />
                    <label
                      htmlFor={filter.id}
                      className="text-xs text-[#6D5D60] cursor-pointer"
                    >
                      {filter.label}
                    </label>
                  </div>
                </div>
              ))}

              <div className="mt-4 px-2">
                <Slider
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">$</span>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      className="h-8 w-16 text-xs"
                    />
                  </div>
                  <span className="text-xs">-</span>
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">$</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || 0,
                        ])
                      }
                      className="h-8 w-16 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4">
        <Button
          className="w-full bg-[#4A3034] hover:bg-[#3A2024] text-white"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
