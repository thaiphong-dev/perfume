"use client"

import type React from "react"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useSearchStore } from "@/lib/store"
import { useLanguageStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const { query, results, isSearching, setQuery, search, clearSearch } = useSearchStore()
  const { t } = useLanguageStore()

  useEffect(() => {
    if (open && query) {
      search(query)
    }

    return () => {
      if (!open) {
        clearSearch()
      }
    }
  }, [open, query, search, clearSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    search(query)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("search")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <Input
            placeholder={t("search_placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
            autoFocus
          />
          <Button type="submit">{t("search")}</Button>
        </form>

        <div className="mt-6">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#4A3034]" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-gray-500">
                {t("search_results")}: {results.length}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#4A3034] truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <p className="text-sm font-bold text-[#4A3034]">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : query ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("no_results_found")}</p>
              <p className="text-sm text-gray-400 mt-1">{t("search_try_again")}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {t("search_for")} {t("search_placeholder")}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

