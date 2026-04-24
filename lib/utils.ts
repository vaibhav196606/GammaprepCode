import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function calculatePricing(
  basePrice: number,
  discountPct: number = 0,
  showGst: boolean = true
): {
  baseAmount: number;
  gstAmount: number;
  discountAmount: number;
  totalAmount: number;
} {
  const baseAmount = basePrice;
  const gstAmount = showGst ? Math.round(baseAmount * 0.18) : 0;
  const subtotal = baseAmount + gstAmount;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const totalAmount = subtotal - discountAmount;
  return { baseAmount, gstAmount, discountAmount, totalAmount };
}
