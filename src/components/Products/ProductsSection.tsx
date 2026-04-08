"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "@/lib/useTranslations";
import { useLanguage } from "@/providers/LanguageProvider";
import { ProductCard } from "./ProductCard";
import {
  FiltersPanel,
  type FilterState,
} from "@/components/Filters/FiltersPanel";
import type { Product } from "@/types/product";
import styles from "./ProductsSection.module.css";

type View = "grid" | "list";

const PRICE_MIN = 0;
const PRICE_MAX = 3000;

export function ProductsSection() {
  const t = useTranslations("products");
  const { locale } = useLanguage();
  const [view, setView] = useState<View>("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [PRICE_MIN, PRICE_MAX],
  });
  const [visibleCount, setVisibleCount] = useState(9);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    // Load products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProducts(data);
      })
      .catch((err) => console.error("Failed to load products:", err));

    // Load categories for mapping
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDbCategories(data);
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category filter
      let categoryMatch = filters.categories.length === 0;

      if (!categoryMatch) {
        // Find the slug(s) for the product's category
        const productCategoryPl = p.category_pl.toLowerCase().trim();
        const productCategoryUa = p.category_ua.toLowerCase().trim();

        // Check if any selected category slug matches this product
        categoryMatch = filters.categories.some((selectedSlug) => {
          // Find the category object in our DB categories
          const catObj = dbCategories.find((c) => c.slug === selectedSlug);
          if (catObj) {
            return (
              catObj.name_pl.toLowerCase().trim() === productCategoryPl ||
              catObj.name_ua.toLowerCase().trim() === productCategoryUa
            );
          }

          // Fallback: try to generate slug from product category name and compare
          const generatedSlug = productCategoryPl
            .replace(/\s+/g, "-")
            .replace(
              /[ąćęłńóśźż]/g,
              (c: string) =>
                ({
                  ą: "a",
                  ć: "c",
                  ę: "e",
                  ł: "l",
                  ń: "n",
                  ó: "o",
                  ś: "s",
                  ź: "z",
                  ż: "z",
                })[c] || c,
            )
            .replace(/[^a-z0-9-]/g, "");

          return (
            generatedSlug === selectedSlug ||
            selectedSlug.includes(generatedSlug) ||
            generatedSlug.includes(selectedSlug)
          );
        });
      }

      // 2. Price filter
      const priceMatch =
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];

      return categoryMatch && priceMatch;
    });
  }, [filters, locale, products, dbCategories]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <>
      <FiltersPanel filters={filters} onChange={setFilters} />
      <section id="products" className={styles.section}>
        <div className={styles.sectionWrapper}>

          <div className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <h2 className={styles.sectionTitle}>{t("title")}</h2>
              </div>

              <div className={styles.controls}>
                <div
                  className={styles.toggleGroup}
                  role="group"
                  aria-label={t("view_toggle")}
                >
                  <button
                    type="button"
                    className={[
                      styles.toggleBtn,
                      view === "grid" ? styles.toggleBtnActive : "",
                    ].join(" ")}
                    onClick={() => setView("grid")}
                    aria-pressed={view === "grid"}
                    aria-label={t("view_grid")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="6"
                        height="6"
                        rx="1.5"
                        fill="currentColor"
                      />
                      <rect
                        x="9"
                        y="1"
                        width="6"
                        height="6"
                        rx="1.5"
                        fill="currentColor"
                      />
                      <rect
                        x="1"
                        y="9"
                        width="6"
                        height="6"
                        rx="1.5"
                        fill="currentColor"
                      />
                      <rect
                        x="9"
                        y="9"
                        width="6"
                        height="6"
                        rx="1.5"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={[
                      styles.toggleBtn,
                      view === "list" ? styles.toggleBtnActive : "",
                    ].join(" ")}
                    onClick={() => setView("list")}
                    aria-pressed={view === "list"}
                    aria-label={t("view_list")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="1"
                        y="2"
                        width="14"
                        height="2.5"
                        rx="1.25"
                        fill="currentColor"
                      />
                      <rect
                        x="1"
                        y="6.75"
                        width="14"
                        height="2.5"
                        rx="1.25"
                        fill="currentColor"
                      />
                      <rect
                        x="1"
                        y="11.5"
                        width="14"
                        height="2.5"
                        rx="1.25"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={view === "list" ? styles.list : styles.grid}>
              {displayedProducts.length === 0 ? (
                <p className={styles.empty}>{t("empty")}</p>
              ) : (
                displayedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    view={view}
                    onClick={() => { }}
                  />
                ))
              )}
            </div>

            {hasMore && (
              <div className={styles.loadMore}>
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={loadMore}
                >
                  {t("load_more") || "Показати ще"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
