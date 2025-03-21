"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, MapPin, Trash2, Edit, Check } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: "shipping" | "billing" | "both";
}

export default function AddressesPage() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguageStore();
  const { toast } = useToast();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
      type: "both",
    },
  ]);

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
    type: "shipping" as "shipping" | "billing" | "both",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, address]);
    setIsAddAddressOpen(false);
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      phone: "",
      type: "shipping",
    });

    toast({
      title: t("success"),
      description: t("address_added"),
    });
  };

  const handleEditAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAddress) return;

    setAddresses(
      addresses.map((address) =>
        address.id === currentAddress.id ? { ...currentAddress } : address
      )
    );

    setIsEditAddressOpen(false);
    setCurrentAddress(null);

    toast({
      title: t("success"),
      description: t("address_updated"),
    });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );

    toast({
      title: t("success"),
      description: t("default_address_updated"),
    });
  };

  const handleDeleteAddress = (id: string) => {
    const addressToDelete = addresses.find((address) => address.id === id);

    if (addressToDelete?.isDefault && addresses.length > 1) {
      toast({
        title: t("error"),
        description: t("cannot_delete_default_address"),
        variant: "destructive",
      });
      return;
    }

    setAddresses(addresses.filter((address) => address.id !== id));

    toast({
      title: t("success"),
      description: t("address_removed"),
    });
  };

  if (!isAuthenticated) {
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
            {t("addresses")}
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#4A3034]">
                      {t("your_addresses")}
                    </h2>
                    <Button
                      onClick={() => setIsAddAddressOpen(true)}
                      className="bg-[#4A3034] hover:bg-[#3A2024] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("add_address")}
                    </Button>
                  </div>

                  {addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`rounded-lg border p-4 ${
                            address.isDefault
                              ? "border-[#4A3034] bg-[#F9F5FF]"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-[#4A3034]">
                                  {address.name}
                                </p>
                                {address.isDefault && (
                                  <span className="ml-2 flex items-center rounded-full bg-[#4A3034] px-2 py-1 text-xs text-white">
                                    <Check className="mr-1 h-3 w-3" />
                                    {t("default")}
                                  </span>
                                )}
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                  {address.type === "shipping"
                                    ? t("shipping")
                                    : address.type === "billing"
                                    ? t("billing")
                                    : t("shipping_and_billing")}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-[#6D5D60]">
                                {address.street}
                              </p>
                              <p className="text-sm text-[#6D5D60]">
                                {address.city}, {address.state}{" "}
                                {address.postalCode}
                              </p>
                              <p className="text-sm text-[#6D5D60]">
                                {address.country}
                              </p>
                              <p className="mt-1 text-sm text-[#6D5D60]">
                                {address.phone}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {!address.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefault(address.id)}
                                  className="text-xs"
                                >
                                  {t("set_as_default")}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCurrentAddress(address);
                                  setIsEditAddressOpen(true);
                                }}
                                className="text-xs"
                              >
                                <Edit className="mr-1 h-3 w-3" />
                                {t("edit")}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
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
                      <MapPin className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-[#4A3034]">
                        {t("no_addresses")}
                      </h3>
                      <p className="mt-1 text-xs text-[#6D5D60]">
                        {t("no_addresses_description")}
                      </p>
                      <Button
                        onClick={() => setIsAddAddressOpen(true)}
                        className="mt-4 bg-[#4A3034] hover:bg-[#3A2024] text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("add_address")}
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
                    {t("about_addresses")}
                  </h3>
                  <div className="space-y-4 text-sm text-[#6D5D60]">
                    <p>{t("addresses_info_1")}</p>
                    <p>{t("addresses_info_2")}</p>
                    <p>{t("addresses_info_3")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Add Address Dialog */}
      <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("add_address")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("full_name")}</Label>
                <Input
                  id="name"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="street">{t("street_address")}</Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">{t("city")}</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">{t("state")}</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">{t("postal_code")}</Label>
                  <Input
                    id="postalCode"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        postalCode: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">{t("country")}</Label>
                  <Select
                    value={newAddress.country}
                    onValueChange={(value) =>
                      setNewAddress({ ...newAddress, country: value })
                    }
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder={t("select_country")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">
                        United States
                      </SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Vietnam">Vietnam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">{t("address_type")}</Label>
                <Select
                  value={newAddress.type}
                  onValueChange={(value: "shipping" | "billing" | "both") =>
                    setNewAddress({ ...newAddress, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={t("select_address_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">{t("shipping")}</SelectItem>
                    <SelectItem value="billing">{t("billing")}</SelectItem>
                    <SelectItem value="both">
                      {t("shipping_and_billing")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddAddressOpen(false)}
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

      {/* Edit Address Dialog */}
      <Dialog open={isEditAddressOpen} onOpenChange={setIsEditAddressOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("edit_address")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditAddress}>
            <div className="grid gap-4 py-4">
              {currentAddress && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">{t("full_name")}</Label>
                    <Input
                      id="edit-name"
                      value={currentAddress.name}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-street">{t("street_address")}</Label>
                    <Input
                      id="edit-street"
                      value={currentAddress.street}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          street: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-city">{t("city")}</Label>
                      <Input
                        id="edit-city"
                        value={currentAddress.city}
                        onChange={(e) =>
                          setCurrentAddress({
                            ...currentAddress,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-state">{t("state")}</Label>
                      <Input
                        id="edit-state"
                        value={currentAddress.state}
                        onChange={(e) =>
                          setCurrentAddress({
                            ...currentAddress,
                            state: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-postalCode">
                        {t("postal_code")}
                      </Label>
                      <Input
                        id="edit-postalCode"
                        value={currentAddress.postalCode}
                        onChange={(e) =>
                          setCurrentAddress({
                            ...currentAddress,
                            postalCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-country">{t("country")}</Label>
                      <Select
                        value={currentAddress.country}
                        onValueChange={(value) =>
                          setCurrentAddress({
                            ...currentAddress,
                            country: value,
                          })
                        }
                      >
                        <SelectTrigger id="edit-country">
                          <SelectValue placeholder={t("select_country")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Japan">Japan</SelectItem>
                          <SelectItem value="China">China</SelectItem>
                          <SelectItem value="Vietnam">Vietnam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">{t("phone")}</Label>
                    <Input
                      id="edit-phone"
                      value={currentAddress.phone}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-type">{t("address_type")}</Label>
                    <Select
                      value={currentAddress.type}
                      onValueChange={(value: "shipping" | "billing" | "both") =>
                        setCurrentAddress({ ...currentAddress, type: value })
                      }
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder={t("select_address_type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shipping">
                          {t("shipping")}
                        </SelectItem>
                        <SelectItem value="billing">{t("billing")}</SelectItem>
                        <SelectItem value="both">
                          {t("shipping_and_billing")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditAddressOpen(false)}
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
