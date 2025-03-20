import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function InstagramSection() {
  const instagramImages = [
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ]

  return (
    <section className="bg-[#F5F5F5] px-4 py-12 md:px-6 lg:px-8 xl:px-16">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#4A3034]">INSTAGRAM</h2>
          <p className="text-sm text-[#6D5D60]">Follow us @nirebeauty</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {instagramImages.map((image, index) => (
            <Link
              href="https://instagram.com"
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-30">
                <span className="scale-0 text-white transition-transform duration-300 group-hover:scale-100">View</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">View More</Button>
        </div>
      </div>
    </section>
  )
}

