import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use - FlowerS",
};

export default function TermsOfUse() {
  return (
    <main
      style={{
        padding: "160px 24px 80px",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "75vh",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "24px", color: "var(--color-text)" }}>
        Regulamin / Terms of Use
      </h1>
      <div style={{ lineHeight: "1.7", color: "rgba(100, 86, 67, 0.8)", fontSize: "16px" }}>
        <p style={{ marginBottom: "16px" }}>
          Korzystając ze sklepu FlowerS, zgadzasz się z naszym regulaminem zakupów i dostawy.
        </p>
        <p style={{ marginBottom: "16px" }}>
          Wszystkie zamówienia podlegają weryfikacji. Ceny kwiatów oraz koszty dostawy mogą
          ulec zmianie w zależności od dostępności sezonowej.
        </p>
        <p style={{ marginBottom: "24px" }}>
          Więcej szczegółów wkrótce...
        </p>
        <Link href="/" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "underline" }}>
          &larr; Wróć do strony głównej
        </Link>
      </div>
    </main>
  );
}
