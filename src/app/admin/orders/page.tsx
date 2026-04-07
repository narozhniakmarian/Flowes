import { verifyAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import OrdersList from "./OrdersList";
import styles from "./page.module.css";

async function getOrders() {
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const orders = await getOrders();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Замовлення</h1>
        <p className={styles.subtitle}>Керуйте замовленнями та відстежуйте їх статус</p>
      </div>
      
      <OrdersList initialOrders={orders} />
    </div>
  );
}
