import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Toaster } from "sonner";
import NextImage from "next/image";
import ThemeInitializer from "./ThemeInitializer";
import styles from "./layout.module.css";

async function logout() {
  "use server";
  const { deleteAdminSession } = await import("@/lib/session");
  const { redirect } = await import("next/navigation");
  await deleteAdminSession();
  redirect("/admin/login");
}

export const metadata: Metadata = {
  title: "FlowerS Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <Toaster position="top-right" richColors />
      <Suspense fallback={null}>
        <ThemeInitializer />
      </Suspense>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <NextImage
              src="/intro/logo.PNG"
              alt="FlowerS"
              width={32}
              height={32}
              priority
            />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>FlowerS Admin</h1>
          </div>
          <p>Керуйте магазином квітів</p>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <svg
              className={styles.navIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Огляд
          </Link>

          <Link href="/admin/orders" className={styles.navLink}>
            <svg
              className={styles.navIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Замовлення
          </Link>

          <Link href="/admin/products" className={styles.navLink}>
            <svg
              className={styles.navIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Товари
          </Link>

          <Link href="/admin/categories" className={styles.navLink}>
            <svg
              className={styles.navIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Категорії
          </Link>

          <Link href="/admin/gallery" className={styles.navLink}>
            <svg
              className={styles.navIcon}
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
            Галерея
          </Link>

          <Link href="/admin/calculator" className={styles.navLink}>
            <svg
              className={styles.navIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Калькулятор витрат
          </Link>

          <Link href="/admin/settings" className={styles.navLink}>
            <svg
              className={styles.navIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Налаштування
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div style={{ flex: 1 }} />
          <div className={styles.headerActions}>
            <form action={logout}>
              <button type="submit" className={styles.logoutBtn}>
                Вийти
              </button>
            </form>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
