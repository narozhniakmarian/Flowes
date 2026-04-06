"use client";

import { useEffect } from "react";
import styles from "./InfoModal.module.css";

type InfoModalProps = {
  title: string;
  text: string;
  onClose: () => void;
};

export function InfoModal({ title, text, onClose }: InfoModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal={true}
        aria-labelledby="modal-title"
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
