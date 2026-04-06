"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "@/lib/useTranslations";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  const t = useTranslations("about");

  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refs = [block1Ref, block2Ref, block3Ref];
    const observers: IntersectionObserver[] = [];

    refs.forEach((ref) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.blockVisible);
          } else {
            entry.target.classList.remove(styles.blockVisible);
          }
        },
        { threshold: 0.4 },
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </header>

        <div className={styles.blocks}>
          {/* Block 1 — odd: text LEFT, blob RIGHT — slides in from left */}
          <div
            ref={block1Ref}
            className={`${styles.block} ${styles.blockOdd}`}
          >
            <div className={styles.textSide}>
              <span className={styles.kicker}>01</span>
              <h3 className={styles.blockTitle}>{t("block1_title")}</h3>
              <p className={styles.blockText}>{t("block1_text")}</p>
            </div>
            <div
              className={`${styles.blobSide} ${styles.blob1}`}
              aria-hidden="true"
            >
              <span className={styles.blobEmoji}>🌸</span>
            </div>
          </div>

          {/* Block 2 — even: blob LEFT, text RIGHT — slides in from right */}
          <div
            ref={block2Ref}
            className={`${styles.block} ${styles.blockEven}`}
          >
            <div
              className={`${styles.blobSide} ${styles.blob2}`}
              aria-hidden="true"
            >
              <span className={styles.blobEmoji}>🌺</span>
            </div>
            <div className={styles.textSide}>
              <span className={styles.kicker}>02</span>
              <h3 className={styles.blockTitle}>{t("block2_title")}</h3>
              <p className={styles.blockText}>{t("block2_text")}</p>
            </div>
          </div>

          {/* Block 3 — odd: text LEFT, blob RIGHT — slides in from left */}
          <div
            ref={block3Ref}
            className={`${styles.block} ${styles.blockOdd}`}
          >
            <div className={styles.textSide}>
              <span className={styles.kicker}>03</span>
              <h3 className={styles.blockTitle}>{t("block3_title")}</h3>
              <p className={styles.blockText}>{t("block3_text")}</p>
            </div>
            <div
              className={`${styles.blobSide} ${styles.blob3}`}
              aria-hidden="true"
            >
              <span className={styles.blobEmoji}>💐</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
