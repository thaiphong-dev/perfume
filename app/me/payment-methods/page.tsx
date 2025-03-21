"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Plus, CreditCard, Trash2, Check } from "lucide-react";
import { useAuthStore, useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "paypal";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  cardholderName: string;
}

export default function PaymentMethodsPage() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();
  const { toast } = useToast();
  const router = useRouter();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
      cardholderName: "John Doe",
    },
    {
      id: "2",
      type: "mastercard",
      last4: "5678",
      expiryMonth: "09",
      expiryYear: "2024",
      isDefault: false,
      cardholderName: "John Doe",
    },
  ]);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, you would send this to your payment processor
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: "visa", // This would be determined by the card number in a real app
      last4: newCard.cardNumber.slice(-4),
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      isDefault: paymentMethods.length === 0, // Make default if it's the first card
      cardholderName: newCard.cardholderName,
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setIsAddCardOpen(false);
    setNewCard({
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });

    toast({
      title: t("success"),
      description: t("payment_method_added"),
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );

    toast({
      title: t("success"),
      description: t("default_payment_method_updated"),
    });
  };

  const handleDeleteCard = (id: string) => {
    const methodToDelete = paymentMethods.find((method) => method.id === id);

    if (methodToDelete?.isDefault && paymentMethods.length > 1) {
      toast({
        title: t("error"),
        description: t("cannot_delete_default_payment_method"),
        variant: "destructive",
      });
      return;
    }

    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));

    toast({
      title: t("success"),
      description: t("payment_method_removed"),
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  const getCardImage = (type: string) => {
    switch (type) {
      case "visa":
        return "/placeholder.svg?height=40&width=60";
      case "mastercard":
        return "/placeholder.svg?height=40&width=60";
      case "amex":
        return "/placeholder.svg?height=40&width=60";
      case "paypal":
        return "/placeholder.svg?height=40&width=60";
      default:
        return "/placeholder.svg?height=40&width=60";
    }
  };

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
            {t("payment_methods")}
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#4A3034]">
                      {t("your_payment_methods")}
                    </h2>
                    <Button
                      onClick={() => setIsAddCardOpen(true)}
                      className="bg-[#4A3034] hover:bg-[#3A2024] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("add_payment_method")}
                    </Button>
                  </div>

                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`rounded-lg border p-4 ${
                            method.isDefault
                              ? "border-[#4A3034] bg-[#F9F5FF]"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="relative h-10 w-16">
                                <Image
                                  src={
                                    getCardImage(method.type) ||
                                    "/placeholder.svg"
                                  }
                                  alt={method.type}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#4A3034]">
                                  {method.type.charAt(0).toUpperCase() +
                                    method.type.slice(1)}{" "}
                                  •••• {method.last4}
                                </p>
                                <p className="text-xs text-[#6D5D60]">
                                  {t("expires")}: {method.expiryMonth}/
                                  {method.expiryYear}
                                </p>
                                <p className="text-xs text-[#6D5D60]">
                                  {method.cardholderName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {method.isDefault ? (
                                <span className="flex items-center rounded-full bg-[#4A3034] px-2 py-1 text-xs text-white">
                                  <Check className="mr-1 h-3 w-3" />
                                  {t("default")}
                                </span>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefault(method.id)}
                                  className="text-xs"
                                >
                                  {t("set_as_default")}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCard(method.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                      <CreditCard className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-[#4A3034]">
                        {t("no_payment_methods")}
                      </h3>
                      <p className="mt-1 text-xs text-[#6D5D60]">
                        {t("no_payment_methods_description")}
                      </p>
                      <Button
                        onClick={() => setIsAddCardOpen(true)}
                        className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("add_payment_method")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-[#4A3034] mb-4">
                    {t("about_payment_methods")}
                  </h3>
                  <div className="space-y-4 text-sm text-[#6D5D60]">
                    <p>{t("payment_methods_info_1")}</p>
                    <p>{t("payment_methods_info_2")}</p>
                    <p>{t("payment_methods_info_3")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("add_payment_method")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCard}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">{t("card_number")}</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cardNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cardholderName">{t("cardholder_name")}</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={newCard.cardholderName}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cardholderName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryMonth">{t("expiry_month")}</Label>
                  <Input
                    id="expiryMonth"
                    placeholder="MM"
                    value={newCard.expiryMonth}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expiryMonth: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryYear">{t("expiry_year")}</Label>
                  <Input
                    id="expiryYear"
                    placeholder="YY"
                    value={newCard.expiryYear}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expiryYear: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">{t("cvv")}</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) =>
                      setNewCard({ ...newCard, cvv: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddCardOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-[#4A3034] hover:bg-[#3A2024] text-white"
              >
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
