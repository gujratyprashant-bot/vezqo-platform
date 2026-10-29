import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "VEZQO — Validate before you build", description: "Put your idea in front of people. Learn what they want before you build." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
