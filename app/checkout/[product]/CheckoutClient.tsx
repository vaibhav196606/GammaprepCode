"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Tag, X } from "lucide-react";
import { formatCurrency, calculatePricing } from "@/lib/utils";

interface Props {
  productSlug: string;
  productName: string;
  productTagline: string;
  basePrice: number;
  showGst: boolean;
  userEmail: string;
  userName: string;
  userPhone: string;
}

declare global {
  interface Window {
    Cashfree: (opts: { mode: string }) => {
      checkout: (opts: { paymentSessionId: string; redirectTarget?: string }) => void;
    };
  }
}

export default function CheckoutClient({
  productSlug,
  productName,
  productTagline,
  basePrice,
  showGst,
  userEmail,
  userName,
  userPhone,
}: Props) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [promoLoading, setPromoLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const pricing = calculatePricing(basePrice, discountPct, showGst);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.toUpperCase(), productSlug }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setPromoCode(promoInput.toUpperCase());
        setDiscountPct(data.discountPct);
        toast.success(`Promo applied! ${data.discountPct}% off`);
      }
    } catch {
      toast.error("Failed to validate promo code.");
    }
    setPromoLoading(false);
  };

  const removePromo = () => {
    setPromoCode("");
    setPromoInput("");
    setDiscountPct(0);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      // Load Cashfree SDK dynamically
      if (!window.Cashfree) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
          document.head.appendChild(script);
        });
      }

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: productSlug.replace(/-/g, "_"),
          promoCode: promoCode || undefined,
        }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        setCheckoutLoading(false);
        return;
      }

      const cashfree = window.Cashfree({
        mode: data.isTestMode ? "sandbox" : "production",
      });
      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      toast.error("Checkout failed. Please try again.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left: Order summary */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-semibold">{productName}</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {productTagline}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base price</span>
                <span>{formatCurrency(pricing.baseAmount)}</span>
              </div>
              {showGst && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>{formatCurrency(pricing.gstAmount)}</span>
                </div>
              )}
              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo discount ({discountPct}%)</span>
                  <span>-{formatCurrency(pricing.discountAmount)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(pricing.totalAmount)}</span>
            </div>

            {/* Promo code */}
            {promoCode ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <Tag className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-700 font-medium flex-1">
                  {promoCode} - {discountPct}% off
                </span>
                <button
                  onClick={removePromo}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyPromo}
                  disabled={promoLoading || !promoInput.trim()}
                >
                  {promoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                Secure payment via Cashfree
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                UPI, cards, netbanking, wallets accepted
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                Instant access to dashboard after payment
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Checkout */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Complete your purchase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={userName} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={userEmail} readOnly className="bg-muted/50" />
              </div>
              {userPhone && (
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={userPhone} readOnly className="bg-muted/50" />
                </div>
              )}
            </div>

            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
              Payment processed securely by Cashfree. UPI, debit/credit cards,
              netbanking, and all major wallets accepted.
            </div>

            <Button
              className="w-full"
              size="xl"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay {formatCurrency(pricing.totalAmount)}</>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By completing purchase you agree to our{" "}
              <a href="/terms-and-conditions" className="underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/refund-policy" className="underline">
                Refund Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
