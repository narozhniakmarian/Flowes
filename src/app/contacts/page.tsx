"use client";

import styles from "./page.module.css";
import { useTranslations } from "@/lib/useTranslations";

function PhoneIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.12 12.7 19.79 19.79 0 012.1 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function ContactsPage() {
  const t = useTranslations("contacts");

  const mapTitle = t("map_title", "Znajdź nas");

  return (
    <main id="contacts" className={styles.page}>
      <div className={styles.container}>

        {/* ── Section header ── */}
        <header className={styles.sectionHeader}>
          <h1 className={styles.title}>{t("title", "Kontakt")}</h1>
          <p className={styles.subtitle}>
            {t("subtitle", "Skontaktuj się z nami")}
          </p>
        </header>

        {/* ── Contact cards grid ── */}
        <div className={styles.grid}>

          {/* Card 1 – Phone */}
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <PhoneIcon />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.label}>
                {t("phone_label", "Telefon")}
              </span>
              <a
                href="tel:+48123456789"
                className={`${styles.value} ${styles.link}`}
              >
                {t("phone_value", "+48 123 456 789")}
              </a>
            </div>
          </div>

          {/* Card 2 – Email */}
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <EmailIcon />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.label}>
                {t("email_label", "E-mail")}
              </span>
              <a
                href="mailto:flowers@opole.pl"
                className={`${styles.value} ${styles.link}`}
              >
                {t("email_value", "flowers@opole.pl")}
              </a>
            </div>
          </div>

          {/* Card 3 – Address */}
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <MapPinIcon />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.label}>
                {t("address_label", "Adres")}
              </span>
              <span className={styles.value}>
                {t("address_value", "Opole, ul. Przykładowa 1, Polska")}
              </span>
            </div>
          </div>

          {/* Card 4 – Hours */}
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <ClockIcon />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.label}>
                {t("hours_label", "Godziny otwarcia")}
              </span>
              <span className={styles.value}>
                {t("hours_value", "Pon-Sob: 9:00–20:00, Ndz: 10:00–18:00")}
              </span>
            </div>
          </div>

        </div>

        {/* ── Map section ── */}
        <section className={styles.mapSection} aria-label={mapTitle}>
          <h2 className={styles.mapTitle}>{mapTitle}</h2>
          <div className={styles.mapWrap}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39756.74!2d17.92!3d50.67!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711b84be3476427%3A0x7f27ab640e0e7456!2sOpole%2C%20Poland!5e0!3m2!1sen!2spl!4v1"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={mapTitle}
            />
          </div>
        </section>

      </div>
    </main>
  );
}
