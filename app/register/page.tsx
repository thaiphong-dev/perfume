"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore, useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, isRegistering, registerError } = useAuth();
  const { t } = useLanguageStore();
  const { toast: sonnerToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    if (!agreeTerms) {
      setFormError("You must agree to the Terms & Conditions");
      return;
    }

    try {
      await register({ email, password, name });
      toast.success(
        "Registration successful! Please check your email to confirm your account."
      );
      router.push("/login?registered=true");
    } catch (error) {
      setFormError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-[#4A3034]">
                  {t("register")}
                </h1>
                <p className="mt-2 text-sm text-[#6D5D60]">
                  {t("create_account")}
                </p>
              </div>

              {registerError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                  {registerError.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-[#4A3034]"
                  >
                    {t("name")}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-[#4A3034]"
                  >
                    {t("email")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-[#4A3034]"
                  >
                    {t("password")}
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-1 block text-sm font-medium text-[#4A3034]"
                  >
                    {t("confirm_password")}
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) =>
                      setAgreeTerms(checked as boolean)
                    }
                  />
                  <label htmlFor="terms" className="text-xs text-[#6D5D60]">
                    {t("agree_terms")}{" "}
                    <Link
                      href="/terms"
                      className="text-[#4A3034] hover:underline"
                    >
                      {t("terms_conditions")}
                    </Link>{" "}
                    {t("and")}{" "}
                    <Link
                      href="/privacy"
                      className="text-[#4A3034] hover:underline"
                    >
                      {t("privacy_policy")}
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4A3034] hover:bg-[#3A2024] text-white"
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("loading")}
                    </>
                  ) : (
                    t("sign_up")
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-[#6D5D60]">
                    {t("already_have_account")}{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#4A3034] hover:underline"
                    >
                      {t("sign_in")}
                    </Link>
                  </p>
                </div>

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-[#6D5D60]">
                      {t("or_sign_up_with")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <span className="sr-only">Google</span>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.13 15.1703 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.1704 24.0001 17.9704 22.935 20.0454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.295L1.27539 17.39C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="h-5 w-5 text-[#1877F2]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                    </svg>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <span className="sr-only">Apple</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.6734 7.2221C10.7974 7.2221 9.44138 6.2261 8.01338 6.2621C6.12938 6.2861 4.40138 7.3541 3.42938 9.0461C1.47338 12.4421 2.92538 17.4661 4.83338 20.2181C5.76938 21.5621 6.87338 23.0741 8.33738 23.0261C9.74138 22.9661 10.2694 22.1181 11.9734 22.1181C13.6654 22.1181 14.1454 23.0261 15.6334 22.9901C17.1454 22.9661 18.1054 21.6221 19.0294 20.2661C20.0974 18.7061 20.5414 17.1941 20.5654 17.1101C20.5294 17.0981 17.6254 16.0541 17.5894 12.6941C17.5654 9.9301 19.8814 8.6221 19.9894 8.5621C18.6694 6.6301 16.6414 6.2981 15.8534 6.2621C14.0174 6.1541 12.5414 7.2221 11.6734 7.2221ZM14.7934 4.3901C15.5814 3.4381 16.0974 2.1301 15.9534 0.834106C14.8494 0.882106 13.5294 1.5941 12.7174 2.5341C11.9894 3.3701 11.3694 4.7141 11.5374 5.9741C12.7654 6.0701 14.0054 5.3421 14.7934 4.3901Z" />
                    </svg>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
