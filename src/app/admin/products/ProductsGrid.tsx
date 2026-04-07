"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import styles from "./page.module.css";
import ProductForm from "./ProductForm";

interface IIngredient {
  name_ua: string;
  name_pl: string;
  amount: string;
}

interface IProduct {
  _id: string;
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

interface ProductsGridProps {
  initialProducts: IProduct[];
}

export default function ProductsGrid({ initialProducts }: ProductsGridProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const refreshProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to refresh products:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей товар?")) return;

    const deletePromise = async () => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка видалення");
      }
      return res.json();
    };

    toast.promise(deletePromise(), {
      loading: "Видалення товару...",
      success: () => {
        setProducts(products.filter((p) => p._id !== id));
        return "Товар видалено!";
      },
      error: (err) => err.message || "Помилка при видаленні",
    });

    try {
      await deletePromise();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Товари</h1>
          <p className={styles.subtitle}>Керування асортиментом магазину</p>
        </div>
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
          Додати товар
        </button>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product._id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name_ua}
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{product.name_ua}</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                  marginBottom: "0.5rem",
                }}
              >
                {product.name_pl}
              </div>
              <div className={styles.cardPrice}>{product.price} грн</div>
              <div className={styles.cardActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => setEditingProduct(product)}
                >
                  <svg
                    width={16}
                    height={16}
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
                  Редагувати
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(product._id)}
                >
                  <svg
                    width={16}
                    height={16}
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
                  Видалити
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isAdding || editingProduct) && (
        <ProductForm
          product={editingProduct || undefined}
          onClose={() => {
            setIsAdding(false);
            setEditingProduct(null);
          }}
          onSuccess={refreshProducts}
        />
      )}
    </div>
  );
}
