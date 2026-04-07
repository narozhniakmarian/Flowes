import { verifyAdminSession, deleteAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import styles from "./page.module.css";
import { Calendar } from "./calendar";

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
    revenueByMonth,
    ordersByDate,
    allOrders
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
    ]),
    Order.aggregate([
      {
        $group: {
          _id: "$deliveryDate",
          count: { $sum: 1 }
        }
      }
    ]),
    Order.find({}).select('orderNumber deliveryDate items').lean()
  ]);

  const orderDates: Record<string, number> = {};
  const ordersByDateFull: Record<string, any[]> = {};
  
  ordersByDate.forEach((item: any) => {
    if (item._id) {
      orderDates[item._id] = item.count;
    }
  });

  allOrders.forEach((order: any) => {
    if (order.deliveryDate) {
      if (!ordersByDateFull[order.deliveryDate]) {
        ordersByDateFull[order.deliveryDate] = [];
      }
      ordersByDateFull[order.deliveryDate].push({
        orderNumber: order.orderNumber,
        items: order.items.map((item: any) => ({
          name_ua: item.name_ua,
          name_pl: item.name_pl
        }))
      });
    }
  });

  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    monthlyOrders,
    monthlyRevenue,
    ordersByMonth,
    revenueByMonth,
    orderDates,
    ordersByDate: ordersByDateFull
  };
}

export default async function AdminDashboard() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const stats = await getDashboardStats();

  const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", 
                      "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--color-text)' }}>Огляд</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', margin: 0 }}>Моніторинг показників та керування магазином</p>
      </div>

      <div className={styles.statsGrid} style={{ marginBottom: 48 }}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div className={styles.statLabel}>Всього товарів</div>
            <div className={styles.statIcon}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalProducts}</div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div className={styles.statLabel}>Всього замовлень</div>
            <div className={styles.statIcon}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalOrders}</div>
          <div className={styles.statChangePositive}>+12% за місяць</div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div className={styles.statLabel}>Замовлень цього місяця</div>
            <div className={styles.statIcon}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.monthlyOrders}</div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div className={styles.statLabel}>Дохід за місяць</div>
            <div className={styles.statIcon}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.monthlyRevenue} грн</div>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div className={styles.statLabel}>Загальний дохід</div>
            <div className={styles.statIcon}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
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

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Календар замовлень</h2>
          <div className={styles.calendar}>
            <Calendar orderDates={stats.orderDates} ordersByDate={stats.ordersByDate} />
          </div>
        </div>
    </div>
  );
}
