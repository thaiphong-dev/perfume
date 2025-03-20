"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ShopSidebar() {
  const [priceRange, setPriceRange] = useState([0, 100])

  const genderFilters = [
    { id: "men", label: "Men", count: 120 },
    { id: "women", label: "Women", count: 85 },
    { id: "unisex", label: "Unisex", count: 45 },
  ]

  const brandFilters = [
    { id: "dior", label: "Dior", count: 24 },
    { id: "chanel", label: "Chanel", count: 18 },
    { id: "guerlain", label: "Guerlain", count: 15 },
    { id: "gabriela", label: "Gabriela", count: 12 },
    { id: "armani", label: "Armani", count: 10 },
    { id: "versace", label: "Versace", count: 8 },
  ]

  const productTypeFilters = [
    { id: "eau-de-parfum", label: "Eau de Parfum", count: 45 },
    { id: "eau-de-toilette", label: "Eau de Toilette", count: 38 },
    { id: "perfume", label: "Perfume", count: 25 },
    { id: "body-spray", label: "Body Spray", count: 18 },
    { id: "after-shave", label: "After Shave", count: 12 },
  ]

  const characterFilters = [
    { id: "woody", label: "Woody", count: 28 },
    { id: "floral", label: "Floral", count: 24 },
    { id: "fresh", label: "Fresh", count: 20 },
    { id: "oriental", label: "Oriental", count: 18 },
    { id: "citrus", label: "Citrus", count: 15 },
  ]

  const fragranceFilters = [
    { id: "vanilla", label: "Vanilla", count: 22 },
    { id: "musk", label: "Musk", count: 18 },
    { id: "rose", label: "Rose", count: 16 },
    { id: "sandalwood", label: "Sandalwood", count: 14 },
    { id: "jasmine", label: "Jasmine", count: 12 },
  ]

  const complementsFilters = [
    { id: "gift-sets", label: "Gift Sets", count: 25 },
    { id: "travel-size", label: "Travel Size", count: 18 },
    { id: "body-lotion", label: "Body Lotion", count: 15 },
    { id: "shower-gel", label: "Shower Gel", count: 12 },
    { id: "deodorant", label: "Deodorant", count: 10 },
  ]

  const priceFilters = [
    { id: "under-50", label: "Under $50", value: [0, 50] },
    { id: "50-100", label: "$50 - $100", value: [50, 100] },
    { id: "100-200", label: "$100 - $200", value: [100, 200] },
    { id: "over-200", label: "Over $200", value: [200, 500] },
  ]

  const renderFilterGroup = (title: string, filters: any[], expanded = false) => (
    <Accordion
      type="single"
      collapsible
      defaultValue={expanded ? title : undefined}
      className="border-b border-gray-200"
    >
      <AccordionItem value={title} className="border-0">
        <AccordionTrigger className="py-3 text-sm font-bold uppercase text-[#4A3034] hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pb-4">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id={filter.id} className="mr-2 h-4 w-4 rounded-sm border-gray-300" />
                  <label htmlFor={filter.id} className="text-xs text-[#6D5D60] cursor-pointer">
                    {filter.label}
                  </label>
                </div>
                <span className="text-xs text-gray-400">({filter.count})</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-[#4A3034]">SHOP BY</h2>

      {renderFilterGroup("SHOP BY GENDER", genderFilters, true)}
      {renderFilterGroup("SHOP BY BRAND", brandFilters)}
      {renderFilterGroup("PRODUCT TYPE", productTypeFilters)}
      {renderFilterGroup("CHARACTER", characterFilters)}
      {renderFilterGroup("FRAGRANCE", fragranceFilters)}
      {renderFilterGroup("COMPLEMENTS", complementsFilters)}

      <Accordion type="single" collapsible className="border-b border-gray-200">
        <AccordionItem value="price" className="border-0">
          <AccordionTrigger className="py-3 text-sm font-bold uppercase text-[#4A3034] hover:no-underline">
            PRICE
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-4">
              {priceFilters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id={filter.id} className="mr-2 h-4 w-4 rounded-sm border-gray-300" />
                    <label htmlFor={filter.id} className="text-xs text-[#6D5D60] cursor-pointer">
                      {filter.label}
                    </label>
                  </div>
                </div>
              ))}

              <div className="mt-4 px-2">
                <Slider
                  defaultValue={[0, 100]}
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
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="h-8 w-16 text-xs"
                    />
                  </div>
                  <span className="text-xs">-</span>
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">$</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="h-8 w-16 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

