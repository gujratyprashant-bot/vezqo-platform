import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEZQO — Don't build on a guess",
  description: "Put your idea in front of real people. Get a clear signal before you build.",
  applicationName: "VEZQO",
  themeColor: "#070708",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
