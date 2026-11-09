"use client";

import { useState } from "react";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget: "_modal" }) => Promise<unknown>;
    };
  }
}

type Props = {
  testId: string;
  packageCode: string;
  packageName: string;
  pricePaise: number;
};

function loadCashfree(): Promise<void> {
  if (window.Cashfree) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-cashfree-sdk="true"]');
    const script = existing ?? document.createElement("script");
    const onReady = () => window.Cashfree ? resolve() : reject(new Error("Cashfree checkout could not load."));
    script.addEventListener("load", onReady, { once: true });
    script.addEventListener("error", () => reject(new Error("Secure checkout could not load. Check your connection and retry.")), { once: true });
    if (!existing) {
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.dataset.cashfreeSdk = "true";
      document.head.appendChild(script);
    }
  });
}

export default function CheckoutButton({ testId, packageCode, packageName, pricePaise }: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function beginCheckout() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await loadCashfree();
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId, packageCode }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Unable to start checkout.");
      if (!result?.paymentSessionId || !result?.orderId) throw new Error("Cashfree did not return a valid payment session. Please retry.");

      const cashfree = window.Cashfree!({
        mode: result.environment === "production" ? "production" : "sandbox",
      });
      await cashfree.checkout({
        paymentSessionId: result.paymentSessionId,
        redirectTarget: "_modal",
      });
      window.location.assign(`/payment/return?order_id=${encodeURIComponent(result.orderId)}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout could not be opened.");
      setBusy(false);
    }
  }

  return (
    <div className="vz-checkout-option">
      <div>
        <strong>{packageName}</strong>
        <span>{(pricePaise / 100).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</span>
      </div>
      <button type="button" onClick={beginCheckout} disabled={busy}>
        {busy ? "OPENING SECURE CHECKOUT…" : "CHOOSE PACKAGE ↗"}
      </button>
      {message && <p role="alert">{message}</p>}
    </div>
  );
}
