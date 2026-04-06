"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTranslations } from "@/lib/useTranslations";
import { useCart } from "@/providers/CartProvider";
import styles from "./Header.module.css";

type NavItem = {
  id: string;
  labelKey: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "products", labelKey: "nav.products" },
  { id: "about", labelKey: "nav.about" },
  { id: "gallery", labelKey: "nav.gallery" },
  { id: "contacts", labelKey: "nav.contacts" },
];

const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
  { id: "tiktok", label: "TikTok", href: "https://tiktok.com" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const t = useTranslations();
  const { totalItems, openCart } = useCart();

  const handleNavClick = (targetId: string) => {
    setIsOpen(false);
    if (typeof window === "undefined") return;
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLanguageToggle = () => {
    setLocale(locale === "pl" ? "ua" : "pl");
  };

  return (
    <header className={styles.siteHeader} data-open={isOpen ? "true" : "false"}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <Image
            src="/intro/logo.PNG"
            alt="FlowerS"
            width={48}
            height={48}
            priority
          />
          <span className={styles.brandName}>FlowerS</span>
        </div>

        <nav className={styles.navDesktop} aria-label={t("nav.aria")}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.navLink}
              onClick={() => handleNavClick(item.id)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          {totalItems > 0 && (
            <button
              type="button"
              className={styles.cartBtn}
              onClick={openCart}
              aria-label={t("cart.open")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className={styles.cartCount}>{totalItems}</span>
            </button>
          )}

          <button
            type="button"
            className={styles.langSwitch}
            onClick={handleLanguageToggle}
            aria-label={t("nav.language")}
          >
            {locale.toUpperCase()}
          </button>

          <button
            type="button"
            className={styles.burger}
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={t("nav.menu")}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={styles.overlay}
        data-open={isOpen ? "true" : "false"}
        onClick={closeMenu}
        aria-hidden={!isOpen}
      />
      <div
        id="mobile-menu"
        className={styles.mobileMenu}
        aria-hidden={!isOpen}
        hidden={!isOpen}
      >
        <button
          type="button"
          className={styles.mobileClose}
          onClick={closeMenu}
          aria-label={t("header.menu_close")}
        >
          ×
        </button>
        <div className={styles.mobileNav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.mobileLink}
              onClick={() => handleNavClick(item.id)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
        <div className={styles.mobileSocial}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
