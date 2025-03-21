"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/admin-store";
import { useTheme } from "next-themes";
import { Moon, Sun, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { settings, updateSettings } = useAdminStore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    notifications: true,
    emailAlerts: true,
    language: "en",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      notifications: settings.notifications,
      emailAlerts: settings.emailAlerts,
      language: settings.language,
    });
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSettings({
        ...formData,
        language: formData.language as "en" | "vi",
      });

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });

      setSaveSuccess(true);

      // Reset success indicator after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#4A3034] dark:text-white mb-8">
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white mb-6">
              Notification Settings
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications about new orders, low stock, etc.
                  </p>
                </div>
                <Switch
                  checked={formData.notifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Alerts</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for important updates.
                  </p>
                </div>
                <Switch
                  checked={formData.emailAlerts}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, emailAlerts: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white mb-6">
              Appearance
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose between light and dark mode.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className={
                      theme === "light" ? "bg-[#4A3034] hover:bg-[#5B4145]" : ""
                    }
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className={
                      theme === "dark" ? "bg-[#4A3034] hover:bg-[#5B4145]" : ""
                    }
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Language</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select your preferred language.
                  </p>
                </div>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value as "en" | "vi" })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white mb-6">
              Account
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500 dark:text-gray-400">
                  Name
                </Label>
                <p className="text-base font-medium">Admin User</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </Label>
                <p className="text-base font-medium">admin@example.com</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500 dark:text-gray-400">
                  Role
                </Label>
                <p className="text-base font-medium">Administrator</p>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Change Password
              </Button>
            </div>
          </div>

          {/* Save Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#4A3034] dark:text-white mb-6">
              Save Changes
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Save your settings to apply the changes.
            </p>

            <Button
              className="w-full bg-[#4A3034] hover:bg-[#5B4145]"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                "Saving..."
              ) : saveSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
