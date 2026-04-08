"use client";
import { useState } from "react";

import styles from "./page.module.css";
import { useTranslations } from "@/lib/useTranslations";
import { ProductsSection } from "@/components/Products/ProductsSection";
import { AboutSection } from "@/components/About/AboutSection";
import { GallerySection } from "@/components/Gallery/GallerySection";

export default function Home() {
  const t = useTranslations("hero");
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);
  const [bgVideoLoaded, setBgVideoLoaded] = useState(false);

  return (
    <>
      <video
        id="body-bg-video"
        className={bgVideoLoaded ? styles.heroVideoVisible : ""}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlayThrough={() => setBgVideoLoaded(true)}
      >
        <source src="/intro/body_background.mp4" type="video/mp4" />
      </video>

      <main className={styles.main}>
        <section className={styles.hero}>
          <video
            className={[
              styles.heroVideo,
              heroVideoLoaded ? styles.heroVideoVisible : "",
            ].join(" ")}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlayThrough={() => setHeroVideoLoaded(true)}
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
