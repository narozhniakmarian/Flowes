import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
