"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "@/lib/useTranslations";
import styles from "./Lightbox.module.css";

type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const t = useTranslations("gallery");
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const currentImage = images[index];

  /* ── Body scroll lock ── */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  /* ── Touch / swipe ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger swipe if horizontal movement dominates
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) onNext();
      else onPrev();
    }
  };

  if (!currentImage) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={t("title", "Galeria")}
    >
      {/* ── Close ── */}
      <button
        type="button"
        className={styles.closeBtn}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label={t("close", "Zamknij")}
      >
        ×
      </button>

      {/* ── Prev ── */}
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navBtnPrev}`}
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label={t("prev", "Poprzedni")}
      >
        ‹
      </button>

      {/* ── Image ── */}
      <div
        className={styles.imageContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* key change forces remount → re-triggers CSS fadeIn animation */}
        <img
          key={`lightbox-${index}`}
          src={currentImage}
          alt={`Gallery ${index + 1} / ${images.length}`}
          className={styles.image}
          draggable={false}
        />
      </div>

      {/* ── Next ── */}
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navBtnNext}`}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label={t("next", "Następny")}
      >
        ›
      </button>

      {/* ── Counter ── */}
      <div
        className={styles.counter}
        onClick={(e) => e.stopPropagation()}
        aria-live="polite"
        aria-atomic="true"
      >
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
