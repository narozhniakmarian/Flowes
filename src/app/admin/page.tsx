import { verifyAdminSession, deleteAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import styles from "./page.module.css";

async function logout() {
  "use server";
  await deleteAdminSession();
  redirect("/admin/login");
}

async function getDashboardStats() {
  await dbConnect();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    monthlyOrders,
    monthlyRevenue,
    ordersByMonth,
    revenueByMonth
  ] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]).then(res => res[0]?.total || 0),
    Order.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    }),
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]).then(res => res[0]?.total || 0),
    Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]),
    Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ])
  ]);

  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    monthlyOrders,
    monthlyRevenue,
    ordersByMonth,
    revenueByMonth
  };
}

export default async function AdminDashboard() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const stats = await getDashboardStats();

  const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", 
                      "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

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
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Всього товарів</div>
            <div className={styles.statValue}>{stats.totalProducts}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Всього замовлень</div>
            <div className={styles.statValue}>{stats.totalOrders}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Замовлень цього місяця</div>
            <div className={styles.statValue}>{stats.monthlyOrders}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Дохід за місяць</div>
            <div className={styles.statValue}>{stats.monthlyRevenue} грн</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Загальний дохід</div>
            <div className={styles.statValue}>{stats.totalRevenue} грн</div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Замовлення за місяцями</h2>
          <div className={styles.statsGrid}>
            {stats.ordersByMonth.map((item: any) => (
              <div key={`orders-${item._id.year}-${item._id.month}`} className={styles.statCard}>
                <div className={styles.statLabel}>{monthNames[item._id.month - 1]} {item._id.year}</div>
                <div className={styles.statValue}>{item.count} замовлень</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Дохід за місяцями</h2>
          <div className={styles.statsGrid}>
            {stats.revenueByMonth.map((item: any) => (
              <div key={`revenue-${item._id.year}-${item._id.month}`} className={styles.statCard}>
                <div className={styles.statLabel}>{monthNames[item._id.month - 1]} {item._id.year}</div>
                <div className={styles.statValue}>{item.total} грн</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
