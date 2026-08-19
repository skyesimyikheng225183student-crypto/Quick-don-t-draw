import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quick Don't Draw",
  description: "A drawing social-deduction game against three AI players.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
