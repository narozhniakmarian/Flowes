"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/types/product";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTranslations } from "@/lib/useTranslations";
import { useCart } from "@/providers/CartProvider";
import { useToast } from "@/components/Toast/Toast";
import { InfoModal } from "@/components/ProductPage/InfoModal";
import { UpsellSection } from "@/components/ProductPage/UpsellSection";
import { AdvantagesSection } from "@/components/ProductPage/AdvantagesSection";
import styles from "./page.module.css";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalKey = "delivery" | "photo" | "discount";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useLanguage();
  const t = useTranslations("product");
  const { addItem } = useCart();

  const id = params.id ?? "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [modal, setModal] = useState<ModalKey | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const p = data.find((item: Product) => item.id === id);
          setProduct(p || null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Update browser tab title
  useEffect(() => {
    if (!product) return;
    const name = locale === "pl" ? product.name_pl : product.name_ua;
    const prev = document.title;
    document.title = `${name} | FlowerS`;
    return () => {
      document.title = prev;
    };
  }, [product, locale]);

  // ─── Not found ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.notFound}>
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>Produkt nie został znaleziony.</p>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.back()}
        >
          ← {t("back")}
        </button>
      </div>
    );
  }

  // ─── Derived values ────────────────────────────────────────────────────────

  const name = locale === "pl" ? product.name_pl : product.name_ua;
  const category = locale === "pl" ? product.category_pl : product.category_ua;

  const { showToast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    showToast(`${name} додано до кошика`, 'success');
    setTimeout(() => setAdded(false), 1600);
  };

  const infoButtons: { key: ModalKey; icon: React.ReactNode; label: string }[] =
    [
      { key: "delivery", icon: <TruckIcon />, label: t("delivery_btn") },
      { key: "photo", icon: <CameraIcon />, label: t("photo_btn") },
      { key: "discount", icon: <TagIcon />, label: t("discount_btn") },
    ];

  const modalContent: Record<ModalKey, { title: string; text: string }> = {
    delivery: {
      title: t("delivery_modal_title"),
      text: t("delivery_modal_text"),
    },
    photo: {
      title: t("photo_modal_title"),
      text: t("photo_modal_text"),
    },
    discount: {
      title: t("discount_modal_title"),
      text: t("discount_modal_text"),
    },
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <main className={styles.page}>
      {/* ── Back button ──────────────────────────────────────────────────── */}
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => router.back()}
      >
        ←&nbsp;{t("back")}
      </button>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <section className={styles.layout}>
        {/* Left — image */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrap}>
            <Image
              src={product.image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className={styles.image}
              priority
            />
          </div>
        </div>

        {/* Right — info */}
        <div className={styles.infoCol}>
          <span className={styles.categoryBadge}>{category}</span>
          <h1 className={styles.productName}>{name}</h1>

          {/* Ingredients */}
          <div className={styles.ingredients}>
            <p className={styles.sectionLabel}>{t("composition")}</p>
            <ul className={styles.ingredientList}>
              {product.ingredients.map((ing, i) => (
                <li key={i} className={styles.ingredientItem}>
                  <span className={styles.ingredientName}>
                    {locale === "pl" ? ing.name_pl : ing.name_ua}
                  </span>
                  <span className={styles.ingredientAmount}>{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price + CTA */}
          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>{t("price")}</span>
              <span className={styles.price}>{product.price}&nbsp;zł</span>
            </div>
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? t("added") : t("add_to_cart")}
            </button>
          </div>

          {/* Info buttons */}
          <div className={styles.infoButtons}>
            {infoButtons.map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                className={styles.infoBtn}
                onClick={() => setModal(key)}
              >
                <span className={styles.infoBtnIcon}>{icon}</span>
                <span className={styles.infoBtnLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upsell ───────────────────────────────────────────────────────── */}
      <UpsellSection currentId={id} />

      {/* ── Advantages ───────────────────────────────────────────────────── */}
      <AdvantagesSection />

      {/* ── Info modal ───────────────────────────────────────────────────── */}
      {modal && (
        <InfoModal
          title={modalContent[modal].title}
          text={modalContent[modal].text}
          onClose={() => setModal(null)}
        />
      )}
    </main>
  );
}
