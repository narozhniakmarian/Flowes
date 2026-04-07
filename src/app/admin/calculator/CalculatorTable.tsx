"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { toast } from "sonner";

export default function CalculatorTable({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [editing, setEditing] = useState<{
    orderNumber: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (
    orderNumber: string,
    field: string,
    currentValue: number,
  ) => {
    setEditing({ orderNumber, field });
    setEditValue(currentValue.toString());
  };

  const saveEdit = async () => {
    if (!editing) return;

    const order = orders.find((o) => o.orderNumber === editing.orderNumber);
    if (!order) return;

    const value = parseFloat(editValue) || 0;
    const updatedOrder = {
      ...order,
      [editing.field]: value,
    };

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/costs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costPrice: updatedOrder.costPrice,
          deliveryCost: updatedOrder.deliveryCost,
        }),
      });

      if (!res.ok) {
        throw new Error("Помилка при збереженні");
      }

      setOrders(
        orders.map((o) =>
          o.orderNumber === editing.orderNumber ? updatedOrder : o,
        ),
      );
      toast.success(`Дані для замовлення #${editing.orderNumber} збережено`);
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Не вдалося зберегти дані");
    }

    setEditing(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    }
    if (e.key === "Escape") {
      setEditing(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (editing) saveEdit();
    };
    if (editing) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside, { once: true });
      }, 0);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [editing]);

  const calculateProfit = (order: any) => {
    return order.totalPrice - (order.costPrice + order.deliveryCost);
  };

  const totalStats = orders.reduce(
    (acc, order) => ({
      totalRevenue: acc.totalRevenue + order.totalPrice,
      totalCosts: acc.totalCosts + order.costPrice + order.deliveryCost,
      totalProfit: acc.totalProfit + calculateProfit(order),
    }),
    { totalRevenue: 0, totalCosts: 0, totalProfit: 0 },
  );

  return (
    <div>
      <div className={styles.statsRow}>
        <div className={styles.statMini}>
          <div className={styles.statMiniLabel}>Загальний дохід</div>
          <div className={styles.statMiniValue}>
            {totalStats.totalRevenue} zł
          </div>
        </div>
        <div className={styles.statMini}>
          <div className={styles.statMiniLabel}>Загальні витрати</div>
          <div className={styles.statMiniValue}>{totalStats.totalCosts} zł</div>
        </div>
        <div className={styles.statMini}>
          <div className={styles.statMiniLabel}>Загальний прибуток</div>
          <div
            className={`${styles.statMiniValue} ${totalStats.totalProfit >= 0 ? styles.positive : styles.negative}`}
          >
            {totalStats.totalProfit} zł
          </div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Номер замовлення</th>
              <th>Дата</th>
              <th>Собівартість</th>
              <th>Доставка</th>
              <th>Сума замовлення</th>
              <th>Прибуток нетто</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const profit = calculateProfit(order);
              return (
                <tr key={order.orderNumber}>
                  <td>#{order.orderNumber}</td>
                  <td>{order.date}</td>
                  <td>
                    {editing?.orderNumber === order.orderNumber &&
                    editing?.field === "costPrice" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className={styles.editInput}
                      />
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(
                            order.orderNumber,
                            "costPrice",
                            order.costPrice,
                          );
                        }}
                      >
                        {order.costPrice || 0} zł
                      </div>
                    )}
                  </td>
                  <td>
                    {editing?.orderNumber === order.orderNumber &&
                    editing?.field === "deliveryCost" ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className={styles.editInput}
                      />
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(
                            order.orderNumber,
                            "deliveryCost",
                            order.deliveryCost,
                          );
                        }}
                      >
                        {order.deliveryCost || 0} zł
                      </div>
                    )}
                  </td>
                  <td>{order.totalPrice} zł</td>
                  <td
                    className={profit >= 0 ? styles.positive : styles.negative}
                  >
                    {profit} zł
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
