"use client";

import { useTranslations } from "@/lib/useTranslations";
import styles from "./page.module.css";

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.19 12.9 19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function ContactsPage() {
  const t = useTranslations();

  return (
    <main className={styles.main}>
      <h1 className={styles.pageTitle}>{t("contacts.title", "Контакти")}</h1>
      <div className={styles.container}>
        <div className={styles.info}>
          <p className={styles.subtitle}>{t("contacts.subtitle", "Зв'яжіться з нами для замовлення або запитань.")}</p>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <div className={styles.iconBox}><PhoneIcon /></div>
              <div className={styles.itemContent}>
                <span className={styles.itemLabel}>{t("contacts.phone", "Телефон")}</span>
                <a href="tel:+48123456789" className={styles.itemValue}>+48 123 456 789</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconBox}><EmailIcon /></div>
              <div className={styles.itemContent}>
                <span className={styles.itemLabel}>{t("contacts.email", "Email")}</span>
                <a href="mailto:flowers@opole.pl" className={styles.itemValue}>flowers@opole.pl</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconBox}><PinIcon /></div>
              <div className={styles.itemContent}>
                <span className={styles.itemLabel}>{t("contacts.address_label", "Адреса")}</span>
                <span className={styles.itemValue}>{t("contacts.address", "Opole, Polska")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d161173.2084654924!2d17.84279532585292!3d50.6723223126744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4710530b3558f3fb%3A0x6794d016913c590b!2sOpole%2C%20Poland!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.map}
            title="Google Map Opole"
            suppressHydrationWarning
          ></iframe>
        </div>
      </div>
    </main>
  );
}
