import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { CartProvider } from "@/providers/CartProvider";
import { CartDrawer } from "@/components/Cart/CartDrawer";
import { Header } from "@/components/Header/Header";

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
        <LanguageProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
