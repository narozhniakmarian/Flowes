import pl from "../../locales/pl.json";
import ua from "../../locales/ua.json";

export type Locale = "pl" | "ua";

export const DEFAULT_LOCALE: Locale = "pl";

export const LOCALES: Locale[] = ["pl", "ua"];

export type DictionaryValue = string | Dictionary;
export type Dictionary = Record<string, DictionaryValue>;

const dictionaries: Record<Locale, Dictionary> = {
  pl: pl as Dictionary,
  ua: ua as Dictionary,
};

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];

export const isLocale = (value: string): value is Locale =>
  LOCALES.includes(value as Locale);

export const normalizeLocale = (value?: string): Locale =>
  value && isLocale(value) ? value : DEFAULT_LOCALE;

const getNestedValue = (
  dictionary: Dictionary,
  key: string,
): DictionaryValue | undefined => {
  return key.split(".").reduce<DictionaryValue | undefined>((acc, part) => {
    if (!acc || typeof acc === "string") return undefined;
    return acc[part];
  }, dictionary);
};

export const translate = (
  dictionary: Dictionary,
  key: string,
  fallback?: string,
): string => {
  const value = getNestedValue(dictionary, key);
  if (typeof value === "string") return value;
  return fallback ?? key;
};

export const createTranslator = (locale: Locale) => {
  const dictionary = getDictionary(locale);
  return (key: string, fallback?: string) =>
    translate(dictionary, key, fallback);
};
