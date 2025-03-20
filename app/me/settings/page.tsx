"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Globe, Bell, Shield, Moon, Sun } from "lucide-react"
import { useAuthStore, useLanguageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SettingsPage() {
  const { isAuthenticated } = useAuthStore()
  const { language, setLanguage, t } = useLanguageStore()
  const { toast } = useToast()
  const router = useRouter()

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleLanguageChange = (newLanguage: "en" | "vi") => {
    setLanguage(newLanguage)
    toast({
      title: t("success"),
      description: t("language_updated"),
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: t("success"),
      description: t("notification_settings_updated"),
    })
  }

  const handleSaveTheme = () => {
    toast({
      title: t("success"),
      description: t("theme_settings_updated"),
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-[#F9F9F9] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Link href="/me" className="flex items-center text-sm text-[#6D5D60] hover:text-[#4A3034]">
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("back_to_account")}
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#4A3034] mb-6">{t("settings")}</h1>

          <div className="rounded-lg bg-white shadow-sm">
            <Tabs defaultValue="general">
              <div className="border-b">
                <div className="px-6">
                  <TabsList className="mt-6">
                    <TabsTrigger
                      value="general"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#4A3034] data-[state=active]:text-[#4A3034] px-4 pb-3"
                    >
                      {t("general")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#4A3034] data-[state=active]:text-[#4A3034] px-4 pb-3"
                    >
                      {t("notifications")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#4A3034] data-[state=active]:text-[#4A3034] px-4 pb-3"
                    >
                      {t("security")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="appearance"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-[#4A3034] data-[state=active]:text-[#4A3034] px-4 pb-3"
                    >
                      {t("appearance")}
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-6">
                <TabsContent value="general" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[#4A3034] mb-4">
                        <Globe className="inline-block mr-2 h-5 w-5" />
                        {t("language_settings")}
                      </h3>
                      <p className="text-sm text-[#6D5D60] mb-4">{t("language_settings_description")}</p>

                      <RadioGroup
                        value={language}
                        onValueChange={(value) => handleLanguageChange(value as "en" | "vi")}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="en" id="en" />
                          <Label htmlFor="en" className="cursor-pointer">
                            English
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vi" id="vi" />
                          <Label htmlFor="vi" className="cursor-pointer">
                            Tiếng Việt
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white">{t("save_changes")}</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[#4A3034] mb-4">
                        <Bell className="inline-block mr-2 h-5 w-5" />
                        {t("notification_settings")}
                      </h3>
                      <p className="text-sm text-[#6D5D60] mb-4">{t("notification_settings_description")}</p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#4A3034]">{t("email_notifications")}</p>
                            <p className="text-xs text-[#6D5D60]">{t("email_notifications_description")}</p>
                          </div>
                          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#4A3034]">{t("push_notifications")}</p>
                            <p className="text-xs text-[#6D5D60]">{t("push_notifications_description")}</p>
                          </div>
                          <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#4A3034]">{t("marketing_emails")}</p>
                            <p className="text-xs text-[#6D5D60]">{t("marketing_emails_description")}</p>
                          </div>
                          <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white" onClick={handleSaveNotifications}>
                        {t("save_changes")}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[#4A3034] mb-4">
                        <Shield className="inline-block mr-2 h-5 w-5" />
                        {t("security_settings")}
                      </h3>
                      <p className="text-sm text-[#6D5D60] mb-4">{t("security_settings_description")}</p>

                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          {t("change_password")}
                        </Button>

                        <Button variant="outline" className="w-full justify-start">
                          {t("two_factor_authentication")}
                        </Button>

                        <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
                          {t("delete_account")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-[#4A3034] mb-4">
                        {theme === "dark" ? (
                          <Moon className="inline-block mr-2 h-5 w-5" />
                        ) : (
                          <Sun className="inline-block mr-2 h-5 w-5" />
                        )}
                        {t("appearance_settings")}
                      </h3>
                      <p className="text-sm text-[#6D5D60] mb-4">{t("appearance_settings_description")}</p>

                      <RadioGroup
                        value={theme}
                        onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light" className="cursor-pointer">
                            <Sun className="inline-block mr-2 h-4 w-4" />
                            {t("light_mode")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dark" id="dark" />
                          <Label htmlFor="dark" className="cursor-pointer">
                            <Moon className="inline-block mr-2 h-4 w-4" />
                            {t("dark_mode")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="system" id="system" />
                          <Label htmlFor="system" className="cursor-pointer">
                            {t("system_theme")}
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button className="bg-[#4A3034] hover:bg-[#3A2024] text-white" onClick={handleSaveTheme}>
                        {t("save_changes")}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

