"use client";

import { useMemo } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { createTranslator } from "@/lib/i18n";

type TranslateFn = (key: string, fallback?: string) => string;

export function useTranslations(namespace?: string): TranslateFn {
  const { locale } = useLanguage();
  const translate = useMemo(() => createTranslator(locale), [locale]);

  return useMemo(() => {
    if (!namespace) {
      return (key: string, fallback?: string) => translate(key, fallback);
    }

    return (key: string, fallback?: string) =>
      translate(`${namespace}.${key}`, fallback);
  }, [namespace, translate]);
}
