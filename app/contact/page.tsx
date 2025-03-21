"use client";

import Link from "next/link";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useLanguageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ContactPage() {
  const { t } = useLanguageStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t("message_sent"),
        description: t("we_will_get_back_to_you_soon"),
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#FFF5F2] px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-[#4A3034] md:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6D5D60]">
              We'd love to hear from you. Whether you have a question about our
              products, need beauty advice, or want to share your feedback, our
              team is here to help.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE8F0]">
                  <MapPin className="h-6 w-6 text-[#4A3034]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#4A3034]">
                  Visit Us
                </h3>
                <p className="text-[#6D5D60]">
                  123 Beauty Lane
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE8F0]">
                  <Phone className="h-6 w-6 text-[#4A3034]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#4A3034]">
                  Call Us
                </h3>
                <p className="text-[#6D5D60]">
                  Customer Service:
                  <br />
                  +1 (555) 123-4567
                  <br />
                  Mon-Fri, 9am-6pm EST
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE8F0]">
                  <Mail className="h-6 w-6 text-[#4A3034]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#4A3034]">
                  Email Us
                </h3>
                <p className="text-[#6D5D60]">
                  General Inquiries:
                  <br />
                  info@nirebeauty.com
                  <br />
                  Customer Support:
                  <br />
                  support@nirebeauty.com
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE8F0]">
                  <Clock className="h-6 w-6 text-[#4A3034]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#4A3034]">Hours</h3>
                <p className="text-[#6D5D60]">
                  Monday - Friday:
                  <br />
                  9:00 AM - 6:00 PM EST
                  <br />
                  Saturday - Sunday:
                  <br />
                  Closed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-[#4A3034]">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("full_name")}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("subject")}</Label>
                      <RadioGroup
                        value={formData.subject}
                        onValueChange={handleSubjectChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general" className="cursor-pointer">
                            {t("general_inquiry")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="product" id="product" />
                          <Label htmlFor="product" className="cursor-pointer">
                            {t("product_question")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="order" id="order" />
                          <Label htmlFor="order" className="cursor-pointer">
                            {t("order_support")}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="cursor-pointer">
                            {t("other")}
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("message")}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#4A3034] hover:bg-[#3A2024] text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("send_message")}
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Map */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-[#4A3034]">
                  Find Us
                </h2>
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Map location"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-lg bg-white p-4 shadow-lg">
                      <h3 className="text-lg font-bold text-[#4A3034]">
                        NIRE Beauty
                      </h3>
                      <p className="text-[#6D5D60]">
                        123 Beauty Lane
                        <br />
                        New York, NY 10001
                      </p>
                      <Button
                        className="mt-2 w-full bg-[#4A3034] hover:bg-[#3A2024] text-white"
                        onClick={() =>
                          window.open("https://maps.google.com", "_blank")
                        }
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-bold text-[#4A3034]">
                    Store Hours
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#6D5D60]">Monday - Friday</span>
                      <span className="font-medium text-[#4A3034]">
                        10:00 AM - 7:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6D5D60]">Saturday</span>
                      <span className="font-medium text-[#4A3034]">
                        11:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6D5D60]">Sunday</span>
                      <span className="font-medium text-[#4A3034]">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-[#F9F9F9] px-4 py-16 md:px-6 lg:px-8 xl:px-16">
          <div className="container mx-auto">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#4A3034]">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto max-w-3xl">
              <div className="space-y-6">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#4A3034]">
                    What is your return policy?
                  </h3>
                  <p className="mt-2 text-[#6D5D60]">
                    We offer a 30-day return policy for all unused and unopened
                    products. If you're not completely satisfied with your
                    purchase, you can return it for a full refund or exchange.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#4A3034]">
                    Do you offer international shipping?
                  </h3>
                  <p className="mt-2 text-[#6D5D60]">
                    Yes, we ship to over 50 countries worldwide. Shipping rates
                    and delivery times vary by location. You can view the
                    shipping options available for your country during checkout.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#4A3034]">
                    Are your products cruelty-free?
                  </h3>
                  <p className="mt-2 text-[#6D5D60]">
                    All NIRE Beauty products are 100% cruelty-free. We never
                    test on animals and do not work with suppliers who test on
                    animals.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#4A3034]">
                    How can I track my order?
                  </h3>
                  <p className="mt-2 text-[#6D5D60]">
                    Once your order ships, you'll receive a confirmation email
                    with a tracking number. You can use this number to track
                    your package on our website or the carrier's website.
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-[#6D5D60]">
                  Can't find the answer you're looking for?{" "}
                  <Link
                    href="/chat"
                    className="font-medium text-[#4A3034] hover:underline"
                  >
                    Chat with our support team
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
