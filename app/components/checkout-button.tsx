"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget: "_self" }) => Promise<unknown>;
    };
  }
}

type Props = {
  testId: string;
  packageCode: string;
  packageName: string;
  pricePaise: number;
};

export default function CheckoutButton({ testId, packageCode, packageName, pricePaise }: Props) {
  const [sdkReady, setSdkReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function beginCheckout() {
    if (!sdkReady || !window.Cashfree || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId, packageCode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to start checkout.");
      const cashfree = window.Cashfree({ mode: result.environment === "production" ? "production" : "sandbox" });
      await cashfree.checkout({
        paymentSessionId: result.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout could not be opened.");
      setBusy(false);
    }
  }

  return (
    <div className="vz-checkout-option">
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
        onReady={() => setSdkReady(true)}
        onError={() => setMessage("Secure checkout could not load. Refresh and try again.")}
      />
      <div>
        <strong>{packageName}</strong>
        <span>{(pricePaise / 100).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</span>
      </div>
      <button type="button" onClick={beginCheckout} disabled={!sdkReady || busy}>
        {busy ? "OPENING…" : sdkReady ? "CONTINUE TO CHECKOUT ↗" : "LOADING SECURE CHECKOUT…"}
      </button>
      {message && <p role="alert">{message}</p>}
    </div>
  );
}
