"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import styles from "./page.module.css";

interface IGalleryImage {
  _id: string;
  url: string;
  publicId: string;
  alt: string;
}

interface GalleryGridProps {
  initialImages: IGalleryImage[];
}

export default function GalleryGrid({ initialImages }: GalleryGridProps) {
  const [images, setImages] = useState<IGalleryImage[]>(initialImages);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newImage, setNewImage] = useState({
    url: "",
    publicId: "",
    alt: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "flowers_unsigned");

    const uploadPromise = async () => {
      setUploading(true);
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "tur";
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload failed");

        setNewImage(prev => ({ ...prev, url: data.secure_url, publicId: data.public_id }));
        return data.secure_url;
      } finally {
        setUploading(false);
      }
    };

    toast.promise(uploadPromise(), {
      loading: "Завантаження фото...",
      success: "Фото завантажено!",
      error: (err) => `Помилка: ${err.message}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.url) {
      toast.error("Будь ласка, завантажте фото");
      return;
    }

    setLoading(true);
    const savePromise = async () => {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImage),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Помилка збереження");

      setImages([data, ...images]);
      setIsAdding(false);
      setNewImage({ url: "", publicId: "", alt: "" });
      return data;
    };

    toast.promise(savePromise(), {
      loading: "Збереження в галерею...",
      success: "Фото додано до галереї!",
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

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це фото з галереї?")) return;

    const deletePromise = async () => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка видалення");
      }
      setImages(images.filter(img => img._id !== id));
      return res.json();
    };

    toast.promise(deletePromise(), {
      loading: "Видалення фото...",
      success: "Фото видалено!",
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
        <h1 className={styles.title}>Галерея</h1>
        <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
          <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Додати фото
        </button>
      </div>

      <div className={styles.grid}>
        {images.map((img) => (
          <div key={img._id} className={styles.imageCard}>
            <Image 
              src={img.url} 
              alt={img.alt || "Gallery image"} 
              fill 
              className={styles.image} 
            />
            <button className={styles.deleteBtn} onClick={() => handleDelete(img._id)}>
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {img.alt && <div className={styles.altOverlay}>{img.alt}</div>}
          </div>
        ))}
      </div>

      {isAdding && (
        <div className={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Додати фото в галерею</h2>
              <button className={styles.closeBtn} onClick={() => setIsAdding(false)}>
                <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div 
                className={styles.imageUpload} 
                onClick={() => document.getElementById("galleryInput")?.click()}
              >
                {newImage.url ? (
                  <div className={styles.imagePreview}>
                    <Image src={newImage.url} alt="Preview" fill className={styles.image} />
                  </div>
                ) : (
                  <div>
                    <svg width={48} height={48} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>{uploading ? "Завантаження..." : "Натисніть для вибору фото"}</p>
                  </div>
                )}
                <input 
                  id="galleryInput" 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Альтернативний текст (ALT)</label>
                <input 
                  className={styles.input}
                  placeholder="Опис зображення для SEO..."
                  value={newImage.alt}
                  onChange={(e) => setNewImage(prev => ({ ...prev, alt: e.target.value }))}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsAdding(false)}>Скасувати</button>
                <button type="submit" className={styles.submitBtn} disabled={loading || uploading}>Зберегти</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
