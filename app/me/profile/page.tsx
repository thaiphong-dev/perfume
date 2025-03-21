"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Upload, Loader2 } from "lucide-react";
import { useAuthStore, useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { t } = useLanguageStore();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio("");
    }
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateProfile({
        name,
        email,
        phone,
      });

      toast({
        title: t("success"),
        description: t("profile_updated_successfully"),
      });

      setIsLoading(false);
    } catch (error) {
      toast({
        title: t("error"),
        description: t("profile_update_failed"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Link
              href="/me"
              className="flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("back_to_account")}
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">
            {t("edit_profile")}
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Profile Picture */}
            <div className="md:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full">
                    <Image
                      src={
                        user.avatar || "/placeholder.svg?height=200&width=200"
                      }
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-medium text-[#4A3034]">
                    {user.name}
                  </h2>
                  <p className="text-sm text-[#6D5D60]">{user.email}</p>

                  <div className="mt-6 w-full">
                    <Button
                      variant="outline"
                      className="w-full border-[#4A3034] text-[#4A3034] hover:bg-[#4A3034] hover:text-white"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {t("change_profile_picture")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2">
              <div className="rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">
                    {t("personal_information")}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-1 block text-sm font-medium text-[#4A3034]"
                        >
                          {t("name")}
                        </label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-1 block text-sm font-medium text-[#4A3034]"
                        >
                          {t("phone")}
                        </label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="mb-1 block text-sm font-medium text-[#4A3034]"
                      >
                        {t("bio")}
                      </label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        placeholder={t("tell_us_about_yourself")}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/me")}
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#4A3034] hover:bg-[#3A2024] text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("saving")}
                          </>
                        ) : (
                          t("save_changes")
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Change Password */}
              <div className="mt-6 rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-[#4A3034] mb-4">
                    {t("change_password")}
                  </h2>

                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="current-password"
                        className="mb-1 block text-sm font-medium text-[#4A3034]"
                      >
                        {t("current_password")}
                      </label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="new-password"
                          className="mb-1 block text-sm font-medium text-[#4A3034]"
                        >
                          {t("new_password")}
                        </label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirm-password"
                          className="mb-1 block text-sm font-medium text-[#4A3034]"
                        >
                          {t("confirm_password")}
                        </label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        className="bg-[#4A3034] hover:bg-[#3A2024] text-white"
                      >
                        {t("update_password")}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
