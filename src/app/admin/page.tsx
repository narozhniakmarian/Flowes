import { verifyAdminSession, deleteAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

async function logout() {
  "use server";
  await deleteAdminSession();
  redirect("/admin/login");
}

export default async function AdminDashboard() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>🌸 FlowerS Admin</h1>
        <form action={logout}>
          <button type="submit" className={styles.logoutBtn}>
            Logout
          </button>
        </form>
      </header>

      <main className={styles.main}>
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🚧</span>
          <h2>Dashboard coming soon</h2>
          <p>Products · Orders · Gallery · Categories</p>
        </div>
      </main>
    </div>
  );
}
