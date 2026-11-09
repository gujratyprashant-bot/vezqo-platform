"use client";

import { useState } from "react";

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
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function beginCheckout() {
    if (busy) return;
    if (!window.Cashfree) {
      setMessage("Secure checkout is still loading. Wait a moment and try again.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId, packageCode }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Unable to start checkout.");
      if (!result?.paymentSessionId) throw new Error("Cashfree did not return a payment session. Please retry.");

      const cashfree = window.Cashfree({
        mode: result.environment === "production" ? "production" : "sandbox",
      });
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
      <div>
        <strong>{packageName}</strong>
        <span>{(pricePaise / 100).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</span>
      </div>
      <button type="button" onClick={beginCheckout} disabled={busy}>
        {busy ? "OPENING SECURE CHECKOUT…" : "CONTINUE TO CHECKOUT ↗"}
      </button>
      {message && <p role="alert">{message}</p>}
    </div>
  );
}
