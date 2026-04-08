"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCart } from "@/providers/CartProvider";
import { useToast } from "@/components/Toast/Toast";
import type { Product } from "@/types/product";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
  view: "grid" | "list";
  onClick: (id: string) => void;
};

export function ProductCard({ product, view, onClick }: ProductCardProps) {
  const { locale } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const name = locale === "pl" ? product.name_pl : product.name_ua;
  const category = locale === "pl" ? product.category_pl : product.category_ua;
  const description =
    locale === "pl" ? product.description_pl : product.description_ua;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.75 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={[
        styles.card,
        view === "list" ? styles.cardList : styles.cardGrid,
        isVisible ? styles.cardActive : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => router.push(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && router.push(`/product/${product.id}`)
      }
      aria-label={name}
    >
      <div className={styles.imageWrap}>
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        <div className={styles.badge}>{category}</div>
      </div>

      <div className={styles.cardInfo}>
        <div className={styles.cardInfoTop}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.category}>{category}</span>
          {view === "list" && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>{product.price} zł</span>
          <button
            type="button"
            className={styles.addBtn}
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
              showToast(`${name} додано до кошика`, 'success');
            }}
            aria-label={name}
          >
            <Image src="/to_cart.svg" alt="" width={32} height={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
