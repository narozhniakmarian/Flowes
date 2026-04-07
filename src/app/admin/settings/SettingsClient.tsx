"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface IAuthLog {
  _id: string;
  status: string;
  userAgent: string;
  ip: string;
  createdAt: string;
}

export default function SettingsClient({ initialLogs }: { initialOrders?: any, initialLogs: IAuthLog[] }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    setIsDark(savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    localStorage.setItem("admin-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "Підтверджено";
      case "denied": return "Відхилено";
      case "pending": return "Очікує";
      case "expired": return "Прострочено";
      default: return status;
    }
  };

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--color-text)' }}>
        Налаштування
      </h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🎨 Зовнішній вигляд
        </h2>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <h3>Темна тема</h3>
            <p>Увімкнути темний інтерфейс для панелі адміністратора</p>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🔐 Журнал авторизації (Telegram)
        </h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Статус</th>
                <th>IP Адреса</th>
                <th>Пристрій</th>
              </tr>
            </thead>
            <tbody>
              {initialLogs.map((log) => (
                <tr key={log._id}>
                  <td>
                    {new Date(log.createdAt).toLocaleString('uk-UA', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles['status_' + log.status]}`}>
                      {getStatusLabel(log.status)}
                    </span>
                  </td>
                  <td>{log.ip || 'Невідомо'}</td>
                  <td>
                    <div className={styles.userAgent} title={log.userAgent}>
                      {log.userAgent || 'Невідомо'}
                    </div>
                  </td>
                </tr>
              ))}
              {initialLogs.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                    Журнал порожній
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
