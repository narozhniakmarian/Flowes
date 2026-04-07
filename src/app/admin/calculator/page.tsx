import { verifyAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import CalculatorTable from "./CalculatorTable";

async function getOrders() {
  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  return orders.map((order) => ({
    orderNumber: order.orderNumber,
    date: order.createdAt.toISOString().split("T")[0],
    totalPrice: order.totalPrice,
    costPrice: order.costPrice || 0,
    deliveryCost: order.deliveryCost || 0,
  }));
}

export default async function CalculatorPage() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) redirect("/admin/login");

  const orders = await getOrders();

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            margin: "0 0 8px 0",
            color: "var(--color-text)",
          }}
        >
          Калькулятор витрат і прибутків
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--color-text-muted)",
            margin: 0,
          }}
        >
          Вводьте собівартість та витрати на доставку для розрахунку чистого
          прибутку
        </p>
      </div>

      <CalculatorTable initialOrders={orders} />
    </div>
  );
}
