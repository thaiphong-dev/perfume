import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  return (
    <section className="bg-[#F5F5F5] px-4 py-8 md:px-6 lg:px-8 xl:px-16">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-[#4A3034]">OUR NEWSLETTER</h2>
          <div className="mx-auto flex max-w-md flex-col sm:flex-row">
            <Input type="email" placeholder="Enter your email address" className="mb-2 sm:mb-0 sm:mr-2" />
            <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">SUBSCRIBE</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

