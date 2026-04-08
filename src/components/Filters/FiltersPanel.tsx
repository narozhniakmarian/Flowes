"use client";

import { useState, useEffect } from "react";
import { Slider } from "@mui/material";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTranslations } from "@/lib/useTranslations";
import styles from "./FiltersPanel.module.css";

export type FilterState = {
  categories: string[];
  priceRange: [number, number];
};

type Category = {
  _id: string;
  id: string;
  name_pl: string;
  name_ua: string;
  slug: string;
};

const PRICE_MIN = 0;
const PRICE_MAX = 3000;

type FiltersPanelProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const { locale } = useLanguage();
  const t = useTranslations("filters");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));

    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onChange({ ...filters, categories: next });
  };

  const handlePriceChange = (_: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      onChange({ ...filters, priceRange: [value[0], value[1]] });
    }
  };

  const clearAll = () => {
    onChange({ categories: [], priceRange: [PRICE_MIN, PRICE_MAX] });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] !== PRICE_MIN ||
    filters.priceRange[1] !== PRICE_MAX;

  const panelContent = (
    <div className={styles.panel}>
      <div className={styles.priceRow}>
        <span className={styles.panelTitle}>{t("title")}</span>
        {hasActiveFilters && (
          <button type="button" className={styles.resetBtn} onClick={clearAll}>
            {t("clear")}
          </button>
        )}
      </div>

      <div className={styles.categoryGroup}>
        <button
          type="button"
          className={styles.categoryGroupHeader}
          onClick={() => setCategoriesOpen((v) => !v)}
          aria-expanded={categoriesOpen}
        >
          <span className={styles.categoryGroupLabel}>{t("categories")}</span>
          <svg
            className={[
              styles.categoryGroupIcon,
              categoriesOpen ? styles.categoryGroupIconOpen : "",
            ].join(" ")}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <ul
          className={[
            styles.categoryList,
            categoriesOpen ? styles.categoryListOpen : "",
          ].join(" ")}
          role="list"
        >
          {categories.map((cat) => {
            const label = locale === "pl" ? cat.name_pl : cat.name_ua;
            const checked = filters.categories.includes(cat.slug);
            return (
              <li key={cat._id}>
                <button
                  type="button"
                  className={[
                    styles.categoryItem,
                    checked ? styles.categoryItemActive : "",
                  ].join(" ")}
                  onClick={() => toggleCategory(cat.slug)}
                  aria-pressed={checked}
                >
                  <span
                    className={[
                      styles.categoryCheckbox,
                      checked ? styles.categoryCheckboxActive : "",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {checked && (
                      <svg
                        className={styles.categoryCheckboxTick}
                        viewBox="0 0 8 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 4l2 2 4-4"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className={styles.categoryLabel}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <hr className={styles.divider} />

      <div className={styles.priceBlock}>
        <div className={styles.priceRow}>
          <span className={styles.categoryGroupLabel}>{t("price")}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceValue}>{filters.priceRange[0]} zł</span>
          <span className={styles.priceLabel}>—</span>
          <span className={styles.priceValue}>{filters.priceRange[1]} zł</span>
        </div>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          disableSwap
          sx={{
            color: "var(--color-accent)",
            padding: "10px 0",
            "& .MuiSlider-thumb": {
              width: 18,
              height: 18,
              backgroundColor: "#fff",
              border: "2px solid var(--color-accent)",
              "&:hover": {
                boxShadow: "0 0 0 6px rgba(245,89,70,0.16)",
              },
            },
            "& .MuiSlider-track": { height: 4, border: "none" },
            "& .MuiSlider-rail": { height: 4, opacity: 0.25 },
          }}
        />
      </div>

      <hr className={styles.divider} />

      <div className={styles.promoBanner}>
        <p className={styles.promoBannerTag}>{t("promo_tag")}</p>
        <p className={styles.promoBannerTitle}>{t("promo_title")}</p>
        <p className={styles.promoBannerText}>{t("promo_text")}</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className={styles.sidebar} aria-label={t("title")}>
        {panelContent}
      </aside>

      <button
        type="button"
        className={[
          styles.mobileToggle,
          isVisible ? styles.mobileToggleVisible : "",
        ].join(" ")}
        onClick={() => setMobileOpen(true)}
        aria-label={t("open")}
      >
        {"»"}
      </button>

      <div
        className={[
          styles.mobileOverlay,
          mobileOpen ? styles.mobileOverlayOpen : "",
        ].join(" ")}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      >
        <div
          className={[
            styles.mobilePanel,
            mobileOpen ? styles.mobilePanelOpen : "",
          ].join(" ")}
          role="dialog"
          aria-label={t("title")}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.mobilePanelHeader}>
            <h2 className={styles.mobilePanelTitle}>{t("title")}</h2>
            <button
              type="button"
              className={styles.mobilePanelClose}
              onClick={() => setMobileOpen(false)}
              aria-label={t("close")}
            >
              ×
            </button>
          </div>
          {panelContent}
        </div>
      </div>
    </>
  );
}
