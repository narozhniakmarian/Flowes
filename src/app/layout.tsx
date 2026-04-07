import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/providers/CartProvider";
import { ToastProvider } from "@/components/Toast/Toast";

export const metadata: Metadata = {
  title: "FlowerS",
  description: "Bilingual flower shop for Opole delivery and pickup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
