"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import styles from "./page.module.css";

interface IIngredient {
  name_ua: string;
  name_pl: string;
  amount: string;
}

interface IProduct {
  _id?: string;
  id: string;
  image: string;
  name_ua: string;
  name_pl: string;
  category_ua: string;
  category_pl: string;
  price: number;
  ingredients: IIngredient[];
  tags_ua: string[];
  tags_pl: string[];
  description_ua: string;
  description_pl: string;
  seo_ua: string;
  seo_pl: string;
}

interface ICategory {
  _id: string;
  name_ua: string;
  name_pl: string;
}

interface ProductFormProps {
  product?: IProduct;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_PRODUCT: Omit<IProduct, "_id"> = {
  id: "",
  image: "",
  name_ua: "",
  name_pl: "",
  category_ua: "",
  category_pl: "",
  price: 0,
  ingredients: [],
  tags_ua: [],
  tags_pl: [],
  description_ua: "",
  description_pl: "",
  seo_ua: "",
  seo_pl: "",
};

export default function ProductForm({
  product,
  onClose,
  onSuccess,
}: ProductFormProps) {
  const [formData, setFormData] =
    useState<Omit<IProduct, "_id">>(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
    fetchCategories();
  }, [product]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCategoryChange = (lang: "ua" | "pl", value: string) => {
    const category = categories.find(
      (c) => (lang === "ua" ? c.name_ua : c.name_pl) === value,
    );
    if (category) {
      setFormData((prev) => ({
        ...prev,
        category_ua: category.name_ua,
        category_pl: category.name_pl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [lang === "ua" ? "category_ua" : "category_pl"]: value,
      }));
    }
  };

  const generateSEO = () => {
    if (!formData.name_ua && !formData.name_pl) {
      toast.error("Спершу введіть назву товару");
      return;
    }

    const seo_ua = formData.name_ua
      ? `${formData.name_ua} — купити в Ополе. ${formData.category_ua || "Квіти"} з доставкою. ${formData.description_ua.slice(0, 120)}...`
      : "";

    const seo_pl = formData.name_pl
      ? `${formData.name_pl} — kup w Opolu. ${formData.category_pl || "Kwiaty"} z dostawą. ${formData.description_pl.slice(0, 120)}...`
      : "";

    setFormData((prev) => ({
      ...prev,
      seo_ua: seo_ua || prev.seo_ua,
      seo_pl: seo_pl || prev.seo_pl,
    }));

    toast.success("SEO-описи згенеровано");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTagsChange = (lang: "ua" | "pl", value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      [`tags_${lang}`]: tags,
    }));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof IIngredient,
    value: string,
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name_ua: "", name_pl: "", amount: "" },
      ],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "flowers_unsigned");

    const uploadPromise = async () => {
      setUploading(true);
      try {
        const cloudName =
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "tur";
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formDataUpload,
          },
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Cloudinary error:", data);
          throw new Error(data.error?.message || "Upload failed");
        }

        if (data.secure_url) {
          setFormData((prev) => ({ ...prev, image: data.secure_url }));
          return data.secure_url;
        }
        throw new Error("No secure_url in response");
      } finally {
        setUploading(false);
      }
    };

    toast.promise(uploadPromise(), {
      loading: "Завантаження зображення...",
      success: "Зображення завантажено!",
      error: (err) => `Помилка: ${err.message}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Будь ласка, завантажте зображення товару");
      return;
    }

    setLoading(true);

    // Auto-generate ID if missing (for new products)
    if (!formData.id && formData.name_pl) {
      formData.id = formData.name_pl
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const savePromise = async () => {
      const url = product?._id
        ? `/api/products/${product._id}`
        : "/api/products";
      const method = product?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Помилка збереження");

      return data;
    };

    toast.promise(savePromise(), {
      loading: product ? "Оновлення товару..." : "Створення товару...",
      success: () => {
        onSuccess();
        onClose();
        return product ? "Товар оновлено!" : "Товар створено!";
      },
      error: (err) => err.message || "Помилка при збереженні",
    });

    try {
      await savePromise();
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {product ? "Редагувати товар" : "Додати новий товар"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg
              width={24}
              height={24}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className={styles.formSection}>
            <span className={styles.sectionLabel}>Зображення</span>
            <div
              className={styles.imageUpload}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {formData.image ? (
                <div className={styles.imagePreview}>
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className={styles.image}
                  />
                </div>
              ) : (
                <div style={{ padding: "2rem" }}>
                  <svg
                    style={{ marginBottom: "1rem", color: "#9ca3af" }}
                    width={48}
                    height={48}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>
                    {uploading
                      ? "Завантаження..."
                      : "Натисніть або перетягніть фото"}
                  </p>
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* UA Side */}
            <div>
              <span className={`${styles.sectionLabel} ${styles.langUA}`}>
                Українська версія (UA)
              </span>

              <div className={styles.field}>
                <label className={styles.label}>Назва</label>
                <input
                  className={styles.input}
                  name="name_ua"
                  value={formData.name_ua}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Категорія</label>
                <select
                  className={styles.select}
                  name="category_ua"
                  value={formData.category_ua}
                  onChange={(e) => handleCategoryChange("ua", e.target.value)}
                  required
                >
                  <option value="">Оберіть категорію</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name_ua}>
                      {cat.name_ua}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Теги (через кому)</label>
                <input
                  className={styles.input}
                  value={formData.tags_ua.join(", ")}
                  onChange={(e) => handleTagsChange("ua", e.target.value)}
                  placeholder="букет, троянди, весна"
                />
              </div>
            </div>

            {/* PL Side */}
            <div>
              <span className={`${styles.sectionLabel} ${styles.langPL}`}>
                Polska wersja (PL)
              </span>

              <div className={styles.field}>
                <label className={styles.label}>Nazwa</label>
                <input
                  className={styles.input}
                  name="name_pl"
                  value={formData.name_pl}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Kategoria</label>
                <select
                  className={styles.select}
                  name="category_pl"
                  value={formData.category_pl}
                  onChange={(e) => handleCategoryChange("pl", e.target.value)}
                  required
                >
                  <option value="">Wybierz kategorię</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name_pl}>
                      {cat.name_pl}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Tagi (po przecinku)</label>
                <input
                  className={styles.input}
                  value={formData.tags_pl.join(", ")}
                  onChange={(e) => handleTagsChange("pl", e.target.value)}
                  placeholder="bukiet, róże, wiosna"
                />
              </div>
            </div>
          </div>

          {/* Description & SEO Section */}
          <div className={styles.formSection}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                borderBottom: "2px solid rgba(245, 89, 70, 0.1)",
                paddingBottom: "0.5rem",
              }}
            >
              <span
                className={styles.sectionLabel}
                style={{ margin: 0, border: 0 }}
              >
                Опис та SEO
              </span>
              <button
                type="button"
                onClick={generateSEO}
                className={styles.addBtn}
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.8rem",
                  boxShadow: "none",
                }}
              >
                ✨ Генерувати SEO для обох мов
              </button>
            </div>

            <div className={styles.formGrid}>
              {/* UA Description/SEO */}
              <div>
                <span
                  className={`${styles.langBadge} ${styles.ua}`}
                  style={{ marginBottom: "1rem" }}
                >
                  UA
                </span>

                <div className={styles.field}>
                  <label className={styles.label}>Опис</label>
                  <textarea
                    className={styles.textarea}
                    name="description_ua"
                    value={formData.description_ua}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>SEO (опис для пошуку)</label>
                  <textarea
                    className={styles.textarea}
                    name="seo_ua"
                    value={formData.seo_ua}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* PL Description/SEO */}
              <div>
                <span
                  className={`${styles.langBadge} ${styles.pl}`}
                  style={{ marginBottom: "1rem" }}
                >
                  PL
                </span>

                <div className={styles.field}>
                  <label className={styles.label}>Opis</label>
                  <textarea
                    className={styles.textarea}
                    name="description_pl"
                    value={formData.description_pl}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    SEO (opis wyszukiwania)
                  </label>
                  <textarea
                    className={styles.textarea}
                    name="seo_pl"
                    value={formData.seo_pl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Common Settings */}
          <div className={styles.formSection}>
            <span className={styles.sectionLabel}>Загальні налаштування</span>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Ціна (грн)</label>
                <input
                  className={styles.input}
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Унікальний ID (slug)</label>
                <input
                  className={styles.input}
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="наприклад: bouquet-red-roses"
                  disabled={!!product}
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className={styles.formSection}>
            <span className={styles.sectionLabel}>Інгредієнти / Склад</span>
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className={styles.ingredientRow}>
                <input
                  className={styles.input}
                  placeholder="UA: Назва"
                  value={ing.name_ua}
                  onChange={(e) =>
                    handleIngredientChange(idx, "name_ua", e.target.value)
                  }
                />
                <input
                  className={styles.input}
                  placeholder="PL: Nazwa"
                  value={ing.name_pl}
                  onChange={(e) =>
                    handleIngredientChange(idx, "name_pl", e.target.value)
                  }
                />
                <input
                  className={styles.input}
                  placeholder="К-сть"
                  value={ing.amount}
                  onChange={(e) =>
                    handleIngredientChange(idx, "amount", e.target.value)
                  }
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeIngredient(idx)}
                >
                  <svg
                    width={20}
                    height={20}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addIngredientBtn}
              onClick={addIngredient}
            >
              + Додати інгредієнт
            </button>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || uploading}
            >
              {loading
                ? "Збереження..."
                : product
                  ? "Оновити товар"
                  : "Створити товар"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
