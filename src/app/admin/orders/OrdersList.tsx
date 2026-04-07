"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { toast } from "sonner";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

type OrderItem = {
  productId: string;
  name_ua: string;
  name_pl: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  deliveryType: "delivery" | "pickup";
  totalPrice: number;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    comment?: string;
  };
  deliveryDate?: string;
  deliveryTime?: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
};

interface OrdersListProps {
  initialOrders: Order[];
}

export default function OrdersList({ initialOrders }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    orderNumber: string,
    newStatus: OrderStatus,
  ) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedOrder = await response.json();

      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber ? { ...o, status: newStatus } : o,
        ),
      );
      if (selectedOrder?.orderNumber === orderNumber) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }

      toast.success(`Статус замовлення #${orderNumber} оновлено`);
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося оновити статус");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return styles.status_pending;
      case "processing":
        return styles.status_processing;
      case "completed":
        return styles.status_completed;
      case "cancelled":
        return styles.status_cancelled;
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Очікує";
      case "processing":
        return "В роботі";
      case "completed":
        return "Виконано";
      case "cancelled":
        return "Скасовано";
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>№</th>
              <th className={styles.th}>Дата</th>
              <th className={styles.th}>Клієнт</th>
              <th className={styles.th}>Тип</th>
              <th className={styles.th}>Сума</th>
              <th className={styles.th}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className={styles.tr}
                onClick={() => setSelectedOrder(order)}
              >
                <td className={styles.td}>
                  <span className={styles.orderNumber}>
                    #{order.orderNumber}
                  </span>
                </td>
                <td className={styles.td}>
                  {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className={styles.td}>
                  {order.customer.firstName} {order.customer.lastName}
                </td>
                <td className={styles.td}>
                  {order.deliveryType === "delivery"
                    ? "🚚 Доставка"
                    : "🏃 Самовивіз"}
                </td>
                <td className={styles.td}>{order.totalPrice} грн</td>
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <select
                    className={`${styles.statusSelect} ${getStatusClass(
                      order.status,
                    )}`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.orderNumber,
                        e.target.value as OrderStatus,
                      )
                    }
                    disabled={isUpdating}
                  >
                    <option value="pending">Очікує</option>
                    <option value="processing">В роботі</option>
                    <option value="completed">Виконано</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Замовлення #{selectedOrder.orderNumber}
              </h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                <svg
                  width={24}
                  height={24}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Статус замовлення</span>
                <div className={styles.statusUpdateRow}>
                  <select
                    className={`${styles.statusSelect} ${getStatusClass(selectedOrder.status)}`}
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder.orderNumber,
                        e.target.value as OrderStatus,
                      )
                    }
                    disabled={isUpdating}
                  >
                    <option value="pending">Очікує</option>
                    <option value="processing">В роботі</option>
                    <option value="completed">Виконано</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                  {isUpdating && (
                    <span className={styles.updatingLabel}>Оновлення...</span>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <span className={styles.sectionTitle}>
                  Інформація про клієнта
                </span>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Ім'я та Прізвище</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.customer.firstName}{" "}
                      {selectedOrder.customer.lastName}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Телефон</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.customer.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <span className={styles.sectionTitle}>Доставка</span>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Тип доставки</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.deliveryType === "delivery"
                        ? "Кур'єрська доставка"
                        : "Самовивіз"}
                    </span>
                  </div>
                  {(selectedOrder.deliveryDate ||
                    selectedOrder.deliveryTime) && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Дата та час</span>
                      <span className={styles.infoValue}>
                        {selectedOrder.deliveryDate || "—"}{" "}
                        {selectedOrder.deliveryTime || ""}
                      </span>
                    </div>
                  )}
                </div>
                {selectedOrder.customer.comment && (
                  <div
                    className={styles.infoItem}
                    style={{ marginTop: "1rem" }}
                  >
                    <span className={styles.infoLabel}>Коментар</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.customer.comment}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.section}>
                <span className={styles.sectionTitle}>Товари</span>
                <div className={styles.itemsList}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name_ua}</span>
                        <span className={styles.itemMeta}>
                          {item.quantity} x {item.price} грн
                        </span>
                      </div>
                      <span className={styles.itemPrice}>
                        {item.quantity * item.price} грн
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.totalSection}>
                  <span className={styles.totalLabel}>Разом до сплати</span>
                  <span className={styles.totalValue}>
                    {selectedOrder.totalPrice} грн
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
