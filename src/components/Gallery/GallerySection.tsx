"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
import { useLanguage } from "@/providers/LanguageProvider";
import { Lightbox } from "./Lightbox";
import styles from "./GallerySection.module.css";

const ALL_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1487530811015-780e7e0fe7fa?w=600&q=80",
  "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=600&q=80",
  "https://images.unsplash.com/photo-1523694576729-96e9e1e52e07?w=600&q=80",
  "https://images.unsplash.com/photo-1563241527-3034482246c7?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
  "https://images.unsplash.com/photo-1573461160327-f94e37bb0b94?w=600&q=80",
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80",
  "https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600&q=80",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=80",
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80",
  "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  "https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=600&q=80",
  "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&q=80",
  "https://images.unsplash.com/photo-1487530811015-780e7e0fe7fa?w=600&q=80",
  "https://images.unsplash.com/photo-1490750967868-88df5691cc4b?w=600&q=80",
  "https://images.unsplash.com/photo-1523694576729-96e9e1e52e07?w=600&q=80",
  "https://images.unsplash.com/photo-1563241527-3034482246c7?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
  "https://images.unsplash.com/photo-1573461160327-f94e37bb0b94?w=600&q=80",
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80",
  "https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600&q=80",
];

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;

export function GallerySection() {
  const t = useTranslations("gallery");
  const { locale } = useLanguage();

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const visibleImages = ALL_IMAGES.slice(0, visibleCount);
  const hasMore = visibleCount < ALL_IMAGES.length;

  const altBase =
    locale === "pl" ? "Zdjęcie w galerii" : "Фото галереї";

  const handleLoadMore = () => {
    setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, ALL_IMAGES.length));
  };

  const handleOpenLightbox = (i: number) => {
    setLightboxIndex(i);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(-1);
  };

  const handlePrev = () => {
    setLightboxIndex((i) =>
      (i - 1 + visibleImages.length) % visibleImages.length
    );
  };

  const handleNext = () => {
    setLightboxIndex((i) => (i + 1) % visibleImages.length);
  };

  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.card}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>{t("title", "Galeria")}</h2>
          <p className={styles.subtitle}>
            {t("subtitle", "Nasze bukiety w obiektywie")}
          </p>
        </div>

        {/* ── Grid ── */}
        <div className={styles.grid}>
          {visibleImages.map((src, i) => (
            <div
              key={`gallery-img-${i}`}
              className={styles.imageWrapper}
              onClick={() => handleOpenLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenLightbox(i);
                }
              }}
              aria-label={`${altBase} ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${altBase} ${i + 1}`}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                className={styles.image}
              />
            </div>
          ))}
        </div>

        {/* ── Load more ── */}
        {hasMore && (
          <div className={styles.loadMoreWrapper}>
            <button
              type="button"
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
            >
              {t("load_more", "Załaduj więcej")}
            </button>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex >= 0 && (
        <Lightbox
          images={visibleImages}
          index={lightboxIndex}
          onClose={handleCloseLightbox}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
