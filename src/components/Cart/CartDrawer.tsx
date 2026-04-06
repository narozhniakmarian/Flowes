"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/providers/CartProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTranslations } from "@/lib/useTranslations";
import styles from "./CartDrawer.module.css";

// ─── Sanitize input (strip HTML tags and script content) ──────────────────────
function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

// ─── Confirm remove modal ─────────────────────────────────────────────────────
function ConfirmModal({
  name,
  onConfirm,
  onCancel,
  t,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className={styles.confirmOverlay} onClick={onCancel}>
      <div
        className={styles.confirmModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <p className={styles.confirmText}>
          {t("confirm_remove")} <strong>{name}</strong>?
        </p>
        <div className={styles.confirmActions}>
          <button
            type="button"
            className={styles.confirmCancel}
            onClick={onCancel}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className={styles.confirmDelete}
            onClick={onConfirm}
          >
            {t("remove")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Form types ───────────────────────────────────────────────────────────────
type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  comment: string;
  date: string;
  time: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  comment: "",
  date: "",
  time: "",
};

// ─── CartDrawer ────────────────────────────────────────────────────────────────
export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    totalItems,
    totalPrice,
    deliveryType,
    setDeliveryType,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  const { locale } = useLanguage();
  const t = useTranslations("cart");

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Focus trap and scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      firstFocusRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closeCart]);

  // ─── Decrement logic ──────────────────────────────────────────────────────
  const handleDecrement = (productId: string, name: string, qty: number) => {
    if (qty === 1) {
      setConfirmId(productId);
      setConfirmName(name);
    } else {
      decrementItem(productId);
    }
  };

  const handleConfirmRemove = () => {
    if (confirmId) removeItem(confirmId);
    setConfirmId(null);
  };

  // ─── Form ─────────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = t("error_required");
    if (!form.lastName.trim()) errs.lastName = t("error_required");
    if (!form.phone.trim()) {
      errs.phone = t("error_required");
    } else if (!/^\+?[\d\s\-().]{7,20}$/.test(form.phone)) {
      errs.phone = t("error_phone");
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product._id,
            name_pl: i.product.name_pl,
            name_ua: i.product.name_ua,
            price: i.product.price,
            quantity: i.quantity,
          })),
          deliveryType,
          totalPrice,
          customer: {
            firstName: sanitize(form.firstName),
            lastName: sanitize(form.lastName),
            phone: sanitize(form.phone),
            comment: sanitize(form.comment),
          },
          deliveryDate: form.date || null,
          deliveryTime: form.time || null,
        }),
      });
      setSubmitted(true);
      clearCart();
      setForm(EMPTY_FORM);
    } catch {
      // error handling — form preserved
    } finally {
      setSubmitting(false);
    }
  };

  const productName = (item: (typeof items)[number]) =>
    locale === "pl" ? item.product.name_pl : item.product.name_ua;

  return (
    <>
      {/* Backdrop */}
      <div
        className={[styles.overlay, isOpen ? styles.overlayOpen : ""].join(" ")}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={[styles.drawer, isOpen ? styles.drawerOpen : ""].join(" ")}
        role="dialog"
        aria-label={t("title")}
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.title}>{t("title")}</span>
            {totalItems > 0 && (
              <span className={styles.count}>{totalItems}</span>
            )}
          </div>
          <button
            ref={firstFocusRef}
            type="button"
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label={t("close")}
          >
            ×
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>🌸</div>
            <h3 className={styles.successTitle}>{t("success_title")}</h3>
            <p className={styles.successText}>{t("success_text")}</p>
            <button
              type="button"
              className={styles.successBtn}
              onClick={() => {
                setSubmitted(false);
                closeCart();
              }}
            >
              {t("success_close")}
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <p className={styles.emptyText}>{t("empty")}</p>
          </div>
        ) : (
          /* Cart content */
          <form
            onSubmit={handleSubmit}
            noValidate
            className={styles.form}
          >
            {/* Items */}
            <ul className={styles.items} role="list">
              {items.map((item) => {
                const name = productName(item);
                return (
                  <li key={item.product._id} className={styles.item}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.product.image}
                        alt={name}
                        fill
                        sizes="72px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{name}</p>
                      <p className={styles.itemPrice}>
                        {item.product.price * item.quantity} zł
                      </p>
                    </div>
                    <div className={styles.qty}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() =>
                          handleDecrement(item.product._id, name, item.quantity)
                        }
                        aria-label={t("decrement")}
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => incrementItem(item.product._id)}
                        aria-label={t("increment")}
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Delivery + totals + form */}
            <div className={styles.footer}>
              {/* Delivery type */}
              <div className={styles.delivery}>
                <p className={styles.deliveryLabel}>{t("delivery_type")}</p>
                <div className={styles.deliveryOptions}>
                  <label className={styles.deliveryOption}>
                    <input
                      type="radio"
                      className={styles.deliveryInput}
                      name="deliveryType"
                      checked={deliveryType === "delivery"}
                      onChange={() => setDeliveryType("delivery")}
                    />
                    <span className={styles.deliveryOptionLabel}>
                      <span className={styles.deliveryOptionTitle}>
                        {t("delivery")}
                      </span>
                      <span className={styles.deliveryOptionNote}>
                        Opole +30 zł
                      </span>
                    </span>
                  </label>
                  <label className={styles.deliveryOption}>
                    <input
                      type="radio"
                      className={styles.deliveryInput}
                      name="deliveryType"
                      checked={deliveryType === "pickup"}
                      onChange={() => setDeliveryType("pickup")}
                    />
                    <span className={styles.deliveryOptionLabel}>
                      <span className={styles.deliveryOptionTitle}>
                        {t("pickup")}
                      </span>
                      <span className={styles.deliveryOptionNote}>
                        {t("pickup_note")}
                      </span>
                    </span>
                  </label>
                </div>
                {deliveryType === "delivery" && (
                  <p className={styles.deliveryOptionNote}>
                    {t("delivery_note")}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>
                    {t("total_items")}: {totalItems}
                  </span>
                  <span>{totalPrice} zł</span>
                </div>
                {deliveryType === "delivery" && (
                  <div className={styles.totalRow}>
                    <span>{t("delivery_fee")}</span>
                    <span className={styles.totalDeliveryNote}>
                      {t("delivery_fee_note")}
                    </span>
                  </div>
                )}
                <div
                  className={[styles.totalRow, styles.totalRowFinal].join(" ")}
                >
                  <span>{t("total")}</span>
                  <span>{totalPrice} zł</span>
                </div>
              </div>

              {/* Checkout form fields */}
              <div className={styles.checkoutFields}>
                <p className={styles.checkoutTitle}>{t("your_details")}</p>
                <div className={styles.formRow}>
                  <div className={styles.fieldWrap}>
                    <input
                      className={[
                        styles.field,
                        errors.firstName ? styles.fieldError : "",
                      ].join(" ")}
                      type="text"
                      name="firstName"
                      placeholder={t("first_name")}
                      value={form.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                      maxLength={60}
                    />
                    {errors.firstName && (
                      <span className={styles.errorMsg}>
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className={styles.fieldWrap}>
                    <input
                      className={[
                        styles.field,
                        errors.lastName ? styles.fieldError : "",
                      ].join(" ")}
                      type="text"
                      name="lastName"
                      placeholder={t("last_name")}
                      value={form.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                      maxLength={60}
                    />
                    {errors.lastName && (
                      <span className={styles.errorMsg}>{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className={styles.fieldWrap}>
                  <input
                    className={[
                      styles.field,
                      errors.phone ? styles.fieldError : "",
                    ].join(" ")}
                    type="tel"
                    name="phone"
                    placeholder={t("phone")}
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    maxLength={20}
                  />
                  {errors.phone && (
                    <span className={styles.errorMsg}>{errors.phone}</span>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.fieldWrap}>
                    <input
                      className={styles.field}
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      aria-label={t("date")}
                    />
                  </div>
                  <div className={styles.fieldWrap}>
                    <input
                      className={styles.field}
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      aria-label={t("time")}
                    />
                  </div>
                </div>

                <div className={styles.fieldWrap}>
                  <textarea
                    className={[styles.field, styles.textarea].join(" ")}
                    name="comment"
                    placeholder={t("comment")}
                    value={form.comment}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={styles.checkoutBtn}
                disabled={submitting}
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            </div>
            {/* end footer */}
          </form>
        )}
      </div>

      {/* Confirm remove modal */}
      {confirmId && (
        <ConfirmModal
          name={confirmName}
          onConfirm={handleConfirmRemove}
          onCancel={() => setConfirmId(null)}
          t={t}
        />
      )}
    </>
  );
}
