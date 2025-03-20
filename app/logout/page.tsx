"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function LogoutPage() {
  const { logout } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      logout()

      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      })

      // Redirect to home page after logout
      setTimeout(() => {
        router.push("/")
      }, 1000)
    }

    handleLogout()
  }, [logout, router, toast])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F9F9]">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4A3034]" />
        <h1 className="mt-4 text-xl font-bold text-[#4A3034]">Logging out...</h1>
        <p className="mt-2 text-sm text-[#6D5D60]">You will be redirected shortly.</p>
      </div>
    </div>
  )
}

