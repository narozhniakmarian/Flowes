"use client";

import { useState } from "react";
import { toast } from "sonner";
import styles from "./page.module.css";
import CategoryForm from "./CategoryForm";

interface ICategory {
  _id: string;
  id: string;
  name_ua: string;
  name_pl: string;
  slug: string;
  order: number;
}

interface CategoriesTableProps {
  initialCategories: ICategory[];
}

export default function CategoriesTable({
  initialCategories,
}: CategoriesTableProps) {
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null,
  );
  const [isAdding, setIsAdding] = useState(false);

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю категорію?")) return;

    const deletePromise = async () => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка видалення");
      }
      return res.json();
    };

    toast.promise(deletePromise(), {
      loading: "Видалення категорії...",
      success: () => {
        setCategories(categories.filter((c) => c._id !== id));
        return "Категорію видалено!";
      },
      error: (err) => err.message,
    });

    try {
      await deletePromise();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Категорії</h1>
        <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Додати категорію
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Порядок</th>
              <th className={styles.th}>Українська (UA)</th>
              <th className={styles.th}>Польська (PL)</th>
              <th className={styles.th}>Slug</th>
              <th className={styles.th}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className={styles.tr}>
                <td className={styles.td}>{cat.order}</td>
                <td className={styles.td}>{cat.name_ua}</td>
                <td className={styles.td}>{cat.name_pl}</td>
                <td className={styles.td}>
                  <code>{cat.slug}</code>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => setEditingCategory(cat)}
                    >
                      <svg
                        width={18}
                        height={18}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(cat._id)}
                    >
                      <svg
                        width={18}
                        height={18}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(isAdding || editingCategory) && (
        <CategoryForm
          category={editingCategory || undefined}
          onClose={() => {
            setIsAdding(false);
            setEditingCategory(null);
          }}
          onSuccess={refreshCategories}
        />
      )}
    </div>
  );
}
