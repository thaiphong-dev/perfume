"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useLanguageStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

// Sample payment methods
const samplePaymentMethods = [
  {
    id: 1,
    type: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
  },
  {
    id: 2,
    type: "mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2024,
    isDefault: false,
  },
]

export default function PaymentMethodsPage() {
  const { isAuthenticated } = useAuthStore()
  const { t } = useLanguageStore()
  const { toast } = useToast()
  const router = useRouter()
  
  const [paymentMethods, setPaymentMethods] = useState(samplePaymentMethods)
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardholderName: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  })
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])
  
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!newCard.cardNumber || !newCard.cardholderName || !newCard.expMonth || !newCard.expYear || !newCard.cvv) {
      toast({
        title: t('error'),
        description: t('please_fill_all_fields'),
        variant: "destructive",
      })
      return
    }
    
    // Add new card
    const newPaymentMethod = {
      id: paymentMethods.length + 1,
      type: newCard.cardNumber.startsWith("4") ? "visa" : "mastercard",
      last4: newCard.cardNumber.slice(-4),
      expMonth: Number.parseInt(newCard.expMonth),
      expYear: Number.parseInt(newCard.expYear),
      isDefault: paymentMethods.length === 0,
    }
    
    setPaymentMethods([...paymentMethods, newPaymentMethod])
    
    // Reset form
    setNewCard({
      cardNumber: "",
      cardholderName: "",
      expMonth: "",
      expYear: "",
      cvv: "",
    })
    
    setIsAddCardOpen(false)
    
    toast({
      title: t('success'),
      description: t('payment_method_added'),
    })
  }
  
  const handleRemoveCard = (id: number) => {
    const updatedPaymentMethods = paymentMethods.filter(method => method.id !== id)
    
    // If we removed the default card, set the first remaining card as default
    if (paymentMethods.find(method => method.id === id)?.isDefault && updatedPaymentMethods.length > 0) {
      updatedPaymentMethods[0].isDefault = true
    }
    
    setPaymentMethods(updatedPaymentMethods)
    
    toast({
      title: t('success'),
      description: t('payment_method_removed'),
    })
  }
  
  const handleSetDefault = (id: number) => {
    const updatedPaymentMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }))
    
    setPaymentMethods(updatedPaymentMethods)
    
    toast({
      title: t('success'),
      description: t('default_payment_method_updated'),
    })
  }
  
  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return (
          <svg className="h-6 w-8" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="white"/>
            <path d="M18.7863 21.7773H15.3738L17.4888 10.2227H20.9013L18.7863 21.7773Z" fill="#00579F"/>
            <path d="M30.4863 10.4414C29.7863 10.1602 28.6988 9.85938 27.3738 9.85938C24.1113 9.85938 21.8113 11.5977 21.7988 14.0977C21.7863 15.9727 23.4613 17.0352 24.7113 17.6602C25.9988 18.2977 26.4113 18.7227 26.4113 19.3102C26.4113 20.2227 25.2863 20.6352 24.2363 20.6352C22.8113 20.6352 22.0613 20.4102 20.8863 19.8852L20.4238 19.6602L19.9238 22.6602C20.7488 23.0352 22.2988 23.3727 23.9113 23.3852C27.3863 23.3852 29.6363 21.6602 29.6613 19.0102C29.6738 17.5352 28.7988 16.3977 26.8738 15.4727C25.6988 14.8602 24.9863 14.4477 24.9863 13.8227C24.9988 13.2602 25.6363 12.6727 26.9863 12.6727C28.0988 12.6477 28.9113 12.9352 29.5363 13.2227L29.8613 13.3852L30.4863 10.4414Z" fill="#00579F"/>
            <path d="M34.9613 17.8477C35.2863 17.0227 36.4113 14.0352 36.4113 14.0352C36.3988 14.0602 36.6988 13.2227 36.8738 12.7227L37.1113 13.9102C37.1113 13.9102 37.7988 17.1602 37.9613 17.8477C37.4613 17.8477 35.6363 17.8477 34.9613 17.8477ZM39.4863 10.2227H36.8738C36.0863 10.2227 35.4863 10.4727 35.1363 11.3477L30.1988 21.7773H33.6738C33.6738 21.7773 34.2988 20.1602 34.4363 19.8102C34.8113 19.8102 38.1363 19.8102 38.6113 19.8102C38.7238 20.2602 39.0488 21.7773 39.0488 21.7773H42.1363L39.4863 10.2227Z" fill="#00579F"/>
            <path d="M14.0613 10.2227L10.8113 18.0352L10.4613 16.3102C9.83633 14.3852 8.06133 12.2852 6.06133 11.1602L8.99883 21.7727H12.4988L17.5613 10.2227H14.0613Z" fill="#00579F"/>
            <path d="M8.01133 10.2227H2.76133L2.69883 10.5352C7.01133 11.5977 9.76133 13.7227 10.4613 16.3102L9.26133 11.3602C9.07383 10.5102 8.61133 10.2477 8.01133 10.2227Z" fill="#FAA61A"/>
          </svg>
        )
      case "mastercard":
        return (
          <svg className="h-6 w-8" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="white"/>
            <path d="M30 21H18V11H30V21Z" fill="#DEDDDE"/>
            <path d="M19.6875 16C19.6875 18.6498 21.8377 20.8 24.4875 20.8C25.7998 20.8 27.0123 20.2859 27.9 19.4H27.9125C28.8002 18.5141 29.3125 17.3002 29.3125 16C29.3125 14.6998 28.8002 13.4859 27.9125 12.6H27.9C27.0123 11.7141 25.7998 11.2 24.4875 11.2C21.8377 11.2 19.6875 13.3502 19.6875 16Z" fill="#DEDDDE"/>
            <path d="M24.5 20.8C25.8123 20.8 27.0248 20.2859 27.9125 19.4C28.8002 18.5141 29.3125 17.3002 29.3125 16C29.3125 14.6998 28.8002 13.4859 27.9125 12.6C27.0248 11.7141 25.8123 11.2 24.5 11.2C23.1877 11.2 21.9752 11.7141 21.0875 12.6C20.1998 13.4859 19.6875 14.6998 19.6875 16C19.6875 17.3002 20.1998 18.5141 21.0875 19.4C21.9752 20.2859 23.1877 20.8 24.5 20.8Z" fill="#DEDDDE"/>
            <path d="M34.5 11.2C33.1877 11.2 31.9752 11.7141 31.0875 12.6C30.1998 13.4859 29.6875 14.6998 29.6875 16C29.6875 17.3002 30.1998 18.5141 31.0875 19.4C31.9752 20.2859 33.1877 20.8 34.5 20.8C35.8123 20.8 37.0248 20.2859 37.9125 19.4C38.8002 18.5141 39.3125 17.3002 39.3125 16C39.3125 14.6998 38.8002 13.4859 37.9125 12.6C37.0248 11.7141 35.8123 11.2 34.5 11.2Z" fill="#EB001B"/>
            <path d="M14.5 11.2C13.1877 11.2 11.9752 11.7141 11.0875 12.6C10.1998 13.4859 9.6875 14.6998 9.6875 16C9.6875 17.3002 10.1998 18.5141 11.0875 19.4C11.9752 20.2859 13.1877 20.8 14.5 20.8C15.8123 20.8 17.0248 20.2859 17.9125 19.4C18.8002 18.5141 19.3125 17.3002 19.3125 16C19.3125 14.6998 18.8002 13.4859 17.9125 12.6C17.0248 11.7141 15.8123 11.2 14.5 11.2Z" fill="#0099DF"/>
            <path d="M24.5 20.8C25.8123 20.8 27.0248 20.2859 27.9125 19.4H27.9C28.7877 18.5141 29.3 17.3002 29.3 16C29.3 14.6998 28.7877 13.4859 27.9 12.6H27.9125C27.0248 11.7141 25.8123 11.2 24.5 11.2C23.1877 11.2 21.9752 11.7141 21.0875 12.6C20.1998 13.4859 19.6875 14.6998 19.6875 16C19.6875 17.3002 20.1998 18.5141 21.0875 19.4C21.9752 20.2859 23.1877 20.8 24.5 20.8Z" fill="#DEDDDE"/>
            <path d="M24.5 20.8C25.8123 20.8 27.0248 20.2859 27.9125 19.4C28.8002 18.5141 29.3125 17.3002 29.3125 16C29.3125 14.6998 28.8002 13.4859 27.9125 12.6C27.0248 11.7141 25.8123 11.2 24.5 11.2C23.1877 11.2 21.9752 11.7141 21.0875 12.6C20.1998 13.4859 19.6875 14.6998 19.6875 16C19.6875 17.3002 20.1998 18.5141 21.0875 19.4C21.9752 20.2859 23.1877 20.8 24.5 20.8Z" fill="#FCF5F5"/>
            <path d="M24.5 11.2C23.1877 11.2 21.9752 11.7141 21.0875 12.6C20.1998 13.4859 19.6875 14.6998 19.6875 16C19.6875 17.3002 20.1998 18.5141 21.0875 19.4C21.9752 20.2859 23.1877 20.8 24.5 20.8C25.8123 20.8 27.0248 20.2859 27.9125 19.4C28.8002 18.5141 29.3125 17.3002\

