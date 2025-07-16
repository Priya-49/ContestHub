// navbar.tsx
"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react" // Import signOut
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import LoginModal from "./login-modal"

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleNotificationClick = () => {
    if (!session) {
      toast.warning("You have to login first.")
    } else {
      router.push("/notifications")
    }
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleLogoutClick = async () => {
    await signOut({ callbackUrl: "/" }); // Log out and redirect to home page
    toast.info("You have been logged out.");
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-gray-900">ContestHub</div>

          <div className="flex items-center gap-4">
            {/* Notification Icon - always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative text-gray-600 hover:text-gray-900"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            </Button>

            {/* Profile or Login/Logout */}
            {session ? (
              <>
                <User className="h-5 w-5 text-gray-700" />
                <Button
                  onClick={handleLogoutClick}
                  className="bg-black text-white hover:bg-gray-800" // Changed from red to black
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLoginClick}
                className="bg-black text-white hover:bg-gray-800"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  )
}