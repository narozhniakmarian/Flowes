import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - FlowerS",
};

export default function PrivacyPolicy() {
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
        Polityka Prywatności / Privacy Policy
      </h1>
      <div style={{ lineHeight: "1.7", color: "rgba(100, 86, 67, 0.8)", fontSize: "16px" }}>
        <p style={{ marginBottom: "16px" }}>
          Witamy w polityce prywatności FlowerS. Twoja prywatność jest dla nas ważna.
          Wszelкі дані використовуються виключно для обробки та доставки ваших замовлень.
        </p>
        <p style={{ marginBottom: "16px" }}>
          Nie udostępniamy Twoich danych osobowych stronom trzecim bez Twojej wyraźnej zgody,
          z wyjątkiem sytuacji wymaganych przez prawo.
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
