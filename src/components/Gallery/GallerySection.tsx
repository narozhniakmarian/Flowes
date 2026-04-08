"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "@/lib/useTranslations";
import { useLanguage } from "@/providers/LanguageProvider";
import { Lightbox } from "./Lightbox";
import styles from "./GallerySection.module.css";

interface IGalleryImage {
  _id: string;
  url: string;
  alt: string;
}

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export function GallerySection() {
  const t = useTranslations("gallery");
  const { locale } = useLanguage();

  const [allImages, setAllImages] = useState<IGalleryImage[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllImages(data);
        }
      })
      .catch((err) => console.error("Failed to load gallery:", err));
  }, []);

  const visibleImages = allImages.slice(0, visibleCount);
  const hasMore = visibleCount < allImages.length;

  const lightboxUrls = visibleImages.map((img) => img.url);

  const altBase = locale === "pl" ? "Zdjęcie w galerii" : "Фото галереї";

  const handleLoadMore = () => {
    setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, allImages.length));
  };

  const handleOpenLightbox = (i: number) => {
    setLightboxIndex(i);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(-1);
  };

  const handlePrev = () => {
    setLightboxIndex(
      (i) => (i - 1 + visibleImages.length) % visibleImages.length,
    );
  };

  const handleNext = () => {
    setLightboxIndex((i) => (i + 1) % visibleImages.length);
  };

  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("title", "Galeria")}</h2>
          <p className={styles.subtitle}>
            {t("subtitle", "Nasze bukiety w obiektywie")}
          </p>
        </div>

        <div className={styles.grid}>
          {visibleImages.map((img, i) => (
            <div
              key={img._id}
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
              aria-label={img.alt || `${altBase} ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${altBase} ${i + 1}`}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                className={styles.image}
              />
            </div>
          ))}
        </div>

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

      {lightboxIndex >= 0 && (
        <Lightbox
          images={lightboxUrls}
          index={lightboxIndex}
          onClose={handleCloseLightbox}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
