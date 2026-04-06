"use client";

import styles from "./page.module.css";
import { useTranslations } from "@/lib/useTranslations";
import { ProductsSection } from "@/components/Products/ProductsSection";
import { AboutSection } from "@/components/About/AboutSection";
import { GallerySection } from "@/components/Gallery/GallerySection";

export default function Home() {
  const t = useTranslations("hero");

  return (
    <>
      <video
        id="body-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/intro/body_background.mp4" type="video/mp4" />
      </video>

      <main className={styles.main}>
        <section className={styles.hero}>
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/intro/hero_background.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.kicker}>{t("kicker")}</p>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.subtitle}>{t("subtitle")}</p>
            <button className={styles.cta} type="button">
              {t("cta")}
            </button>
          </div>
        </section>

        <ProductsSection />
        <AboutSection />
        <GallerySection />
      </main>
    </>
  );
}
