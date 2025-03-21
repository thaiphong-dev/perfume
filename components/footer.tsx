import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#4A3034] px-4 py-12 md:px-6 lg:px-8 xl:px-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* About Us */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">ABOUT US</h3>
            <p className="mb-4 text-sm text-gray-200">
              NIRE is a premium beauty brand dedicated to enhancing your natural
              beauty with high-quality skincare products.
            </p>
            <p className="text-sm text-gray-200">Mon-Fri: 9:00 AM - 6:00 PM</p>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">CUSTOMER CARE</h3>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">FOLLOW US</h3>
            <div className="mb-4 flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-gray-200 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-200 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-gray-200 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex space-x-2">
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Visa"
                width={40}
                height={25}
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Mastercard"
                width={40}
                height={25}
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="PayPal"
                width={40}
                height={25}
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Apple Pay"
                width={40}
                height={25}
              />
            </div>
          </div>

          {/* Download App */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              DOWNLOAD OUR APP
            </h3>
            <p className="mb-4 text-sm text-gray-200">
              Shop on the go with our mobile app and get exclusive offers.
            </p>
            <div className="flex flex-col space-y-2">
              <Link href="#">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="App Store"
                  width={120}
                  height={40}
                />
              </Link>
              <Link href="#">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="Google Play"
                  width={120}
                  height={40}
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-600 pt-6 text-center text-xs text-gray-300">
          <p>© {new Date().getFullYear()} NIRE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
