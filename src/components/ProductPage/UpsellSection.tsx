"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTranslations } from "@/lib/useTranslations";
import { useCart } from "@/providers/CartProvider";
import styles from "./UpsellSection.module.css";

type UpsellSectionProps = {
  currentId: string;
};

export function UpsellSection({ currentId }: UpsellSectionProps) {
  const { locale } = useLanguage();
  const t = useTranslations("product");
  const { addItem } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const touchStartX = useRef(0);
  const touchStartScrollLeft = useRef(0);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const others = data.filter((p: Product) => p.id !== currentId);
        const shuffled = [...others].sort(() => Math.random() - 0.5);
        setProducts(shuffled.slice(0, 4));
      });
  }, [currentId]);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t("you_may_like")}</h2>

      <div className={styles.carouselWrap}>
        <button
          type="button"
          className={[styles.arrow, styles.arrowLeft, !canScrollLeft ? styles.arrowHidden : ""].join(" ")}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          tabIndex={canScrollLeft ? 0 : -1}
        >
          ‹
        </button>

        <div
          ref={scrollRef}
          className={styles.carousel}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartScrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
          }}
          onTouchMove={(e) => {
            const el = scrollRef.current;
            if (!el) return;
            const delta = touchStartX.current - e.touches[0].clientX;
            el.scrollLeft = touchStartScrollLeft.current + delta;
          }}
        >
          {products.map((product) => {
            const name = locale === "pl" ? product.name_pl : product.name_ua;
            return (
              <div key={product.id} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <Image
                    src={product.image}
                    alt={name}
                    fill
                    sizes="260px"
                    className={styles.cardImage}
                  />
                  <span className={styles.cardBadge}>
                    {locale === "pl" ? product.category_pl : product.category_ua}
                  </span>
                </div>
                <div className={styles.cardInfo}>
                  <p className={styles.cardName}>{name}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{product.price} zł</span>
                    <button
                      type="button"
                      className={styles.cardAddBtn}
                      onClick={() => addItem(product)}
                      aria-label={`Add ${name} to cart`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={[styles.arrow, styles.arrowRight, !canScrollRight ? styles.arrowHidden : ""].join(" ")}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          tabIndex={canScrollRight ? 0 : -1}
        >
          ›
        </button>
      </div>
    </section>
  );
}
