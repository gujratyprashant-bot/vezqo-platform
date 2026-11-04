"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/app/components/logo";

function PaymentReturnContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id") ?? "";
  const [status, setStatus] = useState("Checking payment status…");

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!orderId) {
        setStatus("No order reference was received.");
        return;
      }

      try {
        const response = await fetch(
          `/api/payments/status?order_id=${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Could not verify payment.");
        }
        if (active) {
          setStatus(
            result.order.status === "paid"
              ? "Payment confirmed. Your test is being prepared."
              : "Payment is not confirmed yet. This page will not treat a redirect as proof of payment.",
          );
        }
      } catch (error) {
        if (active) {
          setStatus(
            error instanceof Error ? error.message : "Unable to check payment.",
          );
        }
      }
    };

    check();
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <main className="auth-page">
      <header>
        <Logo />
        <a href="/">← BACK TO VEZQO</a>
      </header>
      <section className="auth-layout">
        <div className="auth-editorial">
          <span>VEZQO / CHECKOUT</span>
          <h1>
            THE SIGNAL
            <br />
            IS WORTH
            <br />
            <em>VERIFYING.</em>
          </h1>
          <p>
            Payment confirmation comes from the payment server, not the browser
            redirect.
          </p>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form-kicker">
            <i /> PAYMENT STATUS
          </div>
          <h2>
            One
            <br />
            moment.
          </h2>
          <p className="auth-lead" role="status">
            {status}
          </p>
          <a className="auth-home" href="/">
            ← RETURN TO VEZQO
          </a>
        </div>
      </section>
    </main>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-page">
          <section className="auth-form-wrap">
            <p className="auth-lead" role="status">
              Loading payment status…
            </p>
          </section>
        </main>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
