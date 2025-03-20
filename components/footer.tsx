import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] px-4 py-12 md:px-6 lg:px-8 xl:px-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* About Us */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#4A3034]">ABOUT US</h3>
            <p className="mb-4 text-sm text-[#6D5D60]">
              NIRE is a premium beauty brand dedicated to enhancing your natural beauty with high-quality skincare
              products.
            </p>
            <p className="text-sm text-[#6D5D60]">Mon-Fri: 9:00 AM - 6:00 PM</p>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#4A3034]">CUSTOMER CARE</h3>
            <ul className="space-y-2 text-sm text-[#6D5D60]">
              <li>
                <Link href="/contact" className="hover:text-[#4A3034]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#4A3034]">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#4A3034]">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#4A3034]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#4A3034]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#4A3034]">FOLLOW US</h3>
            <div className="mb-4 flex space-x-4">
              <Link href="https://facebook.com" className="text-[#6D5D60] hover:text-[#4A3034]">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-[#6D5D60] hover:text-[#4A3034]">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="text-[#6D5D60] hover:text-[#4A3034]">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex space-x-2">
              <Image src="/placeholder.svg?height=30&width=50" alt="Visa" width={40} height={25} />
              <Image src="/placeholder.svg?height=30&width=50" alt="Mastercard" width={40} height={25} />
              <Image src="/placeholder.svg?height=30&width=50" alt="PayPal" width={40} height={25} />
              <Image src="/placeholder.svg?height=30&width=50" alt="Apple Pay" width={40} height={25} />
            </div>
          </div>

          {/* Download App */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#4A3034]">DOWNLOAD OUR APP</h3>
            <p className="mb-4 text-sm text-[#6D5D60]">Shop on the go with our mobile app and get exclusive offers.</p>
            <div className="flex flex-col space-y-2">
              <Link href="#">
                <Image src="/placeholder.svg?height=40&width=120" alt="App Store" width={120} height={40} />
              </Link>
              <Link href="#">
                <Image src="/placeholder.svg?height=40&width=120" alt="Google Play" width={120} height={40} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-[#6D5D60]">
          <p>© {new Date().getFullYear()} NIRE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

