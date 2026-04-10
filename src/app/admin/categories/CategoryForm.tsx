"use client";

import { useState } from "react";
import { toast } from "sonner";
import styles from "./page.module.css";

interface ICategory {
  _id?: string;
  id: string;
  name_ua: string;
  name_pl: string;
  slug: string;
  order: number;
}

interface CategoryFormProps {
  category?: ICategory;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryForm({
  category,
  onClose,
  onSuccess,
}: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ICategory>>(
    category || {
      name_ua: "",
      name_pl: "",
      slug: "",
      order: 0,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const savePromise = async () => {
      const url = category?._id
        ? `/api/admin/categories/${category._id}`
        : "/api/admin/categories";
      const method = category?._id ? "PUT" : "POST";

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
      loading: category ? "Оновлення категорії..." : "Створення категорії...",
      success: () => {
        onSuccess();
        onClose();
        return category ? "Категорію оновлено!" : "Категорію створено!";
      },
      error: (err) => err.message,
    });

    try {
      await savePromise();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {category ? "Редагувати категорію" : "Додати категорію"}
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

        <form onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>
                <span className={`${styles.langBadge} ${styles.ua}`}>UA</span>{" "}
                Назва (укр)
              </label>
              <input
                className={styles.input}
                value={formData.name_ua}
                onChange={(e) =>
                  setFormData({ ...formData, name_ua: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <span className={`${styles.langBadge} ${styles.pl}`}>PL</span>{" "}
                Назва (пол)
              </label>
              <input
                className={styles.input}
                value={formData.name_pl}
                onChange={(e) =>
                  setFormData({ ...formData, name_pl: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Slug (URL шлях)</label>
              <input
                className={styles.input}
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="наприклад: bukety-troyand"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Порядок сортування</label>
              <input
                className={styles.input}
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
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
              disabled={loading}
            >
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
