"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCart } from "@/providers/CartProvider";
import styles from "./ProductCard.module.css";

type Ingredient = {
  name_ua: string;
  name_pl: string;
  amount: string;
};

type Product = {
  _id: string;
  id: string;
  image: string;
  name_ua: string;
  name_pl: string;
  category_ua: string;
  category_pl: string;
  price: number;
  ingredients: Ingredient[];
  description_ua: string;
  description_pl: string;
};

type ProductCardProps = {
  product: Product;
  view: "grid" | "list";
  onClick: (id: string) => void;
};

export function ProductCard({ product, view, onClick }: ProductCardProps) {
  const { locale } = useLanguage();
  const { addItem } = useCart();
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
            }}
            aria-label={name}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
