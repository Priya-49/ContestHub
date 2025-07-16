// login-modal.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = () => {
    setError("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  // Helper function for email validation
    const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper function for password strength validation
  const isStrongPassword = (password: string) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Added common special characters

    return (
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    );
  };


  const handleLogin = async () => {
    setError("")
    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
      return;
    }

    setIsLoading(true)
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.ok) {
        toast.success("Logged in successfully!")
        onClose()
        resetForm()
      } else {
        setError("Invalid email or password.")
      }
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async () => {
    setError("")
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || "Account created successfully! Please log in.")
        setIsSignUp(false) // Switch to login view after successful signup
        resetForm() // Clear form after signup
      } else {
        setError(data.message || "Sign up failed. Please try again.")
      }
    } catch {
      setError("Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm border border-gray-200 transition-transform duration-200 ease-in scale-100">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isSignUp ? "Create Account" : "Welcome Back!"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {isSignUp && (
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-4 text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={isSignUp ? handleSignUp : handleLogin}
            className="bg-black text-white hover:bg-gray-800 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
          </Button>
          <p className="text-sm text-center text-gray-500">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    resetForm();
                  }}
                  className="text-blue-600 hover:underline"
                  disabled={isLoading}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    resetForm();
                  }}
                  className="text-blue-600 hover:underline"
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-xs text-center text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} ContestHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}