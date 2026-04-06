"use client";

import { useTranslations } from "@/lib/useTranslations";
import styles from "./AdvantagesSection.module.css";

const advantages = [
  { titleKey: "adv_1_title", textKey: "adv_1_text" },
  { titleKey: "adv_2_title", textKey: "adv_2_text" },
  { titleKey: "adv_3_title", textKey: "adv_3_text" },
  { titleKey: "adv_4_title", textKey: "adv_4_text" },
] as const;

export function AdvantagesSection() {
  const t = useTranslations("product");

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t("advantages_title")}</h2>
      <div className={styles.grid}>
        {advantages.map(({ titleKey, textKey }, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.iconWrap}>
              <img
                src="/intro/section%20svg.svg"
                alt=""
                className={styles.icon}
                aria-hidden="true"
              />
            </div>
            <h3 className={styles.cardTitle}>{t(titleKey)}</h3>
            <p className={styles.cardText}>{t(textKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
