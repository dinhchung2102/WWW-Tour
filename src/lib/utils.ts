import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Promotion } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate the final price after applying promotion discount
 * @param originalPrice - Original price of the tour
 * @param promotion - Promotion object (optional)
 * @returns Final price after discount
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  promotion?: Promotion | null
): number {
  if (!promotion) return originalPrice;

  // Check if promotion is active
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);
  const isActive = now >= startDate && now <= endDate && promotion.active;

  if (!isActive) return originalPrice;

  // Apply discount
  if (promotion.discountPercent) {
    const discounted = originalPrice * (1 - promotion.discountPercent / 100);
    // Apply max discount limit if exists
    if (promotion.maxDiscountAmount) {
      const discountAmount = originalPrice - discounted;
      if (discountAmount > promotion.maxDiscountAmount) {
        return originalPrice - promotion.maxDiscountAmount;
      }
    }
    return discounted;
  }

  if (promotion.discountAmount) {
    return Math.max(0, originalPrice - promotion.discountAmount);
  }

  return originalPrice;
}

/**
 * Format price to Vietnamese currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
