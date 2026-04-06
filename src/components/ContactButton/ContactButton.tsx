"use client";

import { useState } from "react";
import styles from "./ContactButton.module.css";

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.19 12.9 19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.5 2.5L2.5 9.5l7 2.5 2.5 7 3-5 5 4 1.5-15z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.19 12.9 19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

type ContactOption = {
  id: string;
  href: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  external: boolean;
};

const CONTACT_OPTIONS: ContactOption[] = [
  {
    id: "phone",
    href: "tel:+48123456789",
    label: "Phone",
    color: "#0088cc",
    icon: <PhoneIcon />,
    external: false,
  },
  {
    id: "telegram",
    href: "https://t.me/flowersopole",
    label: "Telegram",
    color: "#0088cc",
    icon: <TelegramIcon />,
    external: true,
  },
  {
    id: "viber",
    href: "viber://chat?number=+48123456789",
    label: "Viber",
    color: "#7360f2",
    icon: <ViberIcon />,
    external: false,
  },
  {
    id: "whatsapp",
    href: "https://wa.me/48123456789",
    label: "WhatsApp",
    color: "#25d366",
    icon: <WhatsAppIcon />,
    external: true,
  },
];

export function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu} aria-hidden={!isOpen}>
        {CONTACT_OPTIONS.map((option, i) => (
          <a
            key={option.id}
            href={option.href}
            target={option.external ? "_blank" : undefined}
            rel={option.external ? "noreferrer" : undefined}
            aria-label={option.label}
            className={`${styles.menuItem} ${isOpen ? styles.menuItemVisible : ""}`}
            style={{
              backgroundColor: option.color,
              transitionDelay: isOpen
                ? `${i * 50}ms`
                : `${(CONTACT_OPTIONS.length - 1 - i) * 30}ms`,
            }}
          >
            {option.icon}
          </a>
        ))}


      </div>

      <button
        type="button"
        className={`${styles.mainBtn} ${!isOpen ? styles.mainBtnPulse : ""}`}
        onClick={toggle}
        aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: "56px", 
            height: "56px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #f55946 0%, #f6525c 100%)" 
          }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <PhoneIcon />
        )}
      </button>
    </div>
  );
}
