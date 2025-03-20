import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CategoryCardProps {
  title: string
  description: string
  image: string
  bgColor: string
}

export default function CategoryCard({ title, description, image, bgColor }: CategoryCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-center space-y-3">
          <h3 className="text-xl font-bold text-[#4A3034]">{title}</h3>
          <p className="text-xs text-[#6D5D60]">{description}</p>
          <Button
            variant="outline"
            className="mt-2 w-fit border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
          >
            Shop Now
          </Button>
        </div>
        <div className="relative h-[120px] md:h-[150px]">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-contain" />
        </div>
      </div>
    </div>
  )
}

