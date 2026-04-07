export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured, skipping notification");
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Telegram API error:", error);
    }
  } catch (error) {
    console.error("Failed to send telegram notification:", error);
  }
}

export function formatOrderMessage(order: any) {
  const itemsList = order.items
    .map((item: any) => `✅ ${item.name_ua} x${item.quantity} - ${item.price * item.quantity} грн`)
    .join("\n");

  return `<b>🆕 Нове замовлення!</b>

<b>Номер замовлення:</b> #${order.orderNumber}
<b>Сума замовлення:</b> ${order.totalPrice} грн
<b>Тип доставки:</b> ${order.deliveryType === "delivery" ? "🚚 Кур'єр" : "🏃 Самовивіз"}

<b>🔷 Товари:</b>
${itemsList}

<b>👤 Замовник:</b>
${order.customer.firstName} ${order.customer.lastName}
📱 ${order.customer.phone}

${order.customer.comment ? `<b>💬 Коментар:</b> ${order.customer.comment}` : ''}

${order.deliveryDate ? `<b>📅 Дата доставки:</b> ${order.deliveryDate}` : ''}
${order.deliveryTime ? `<b>⏰ Час доставки:</b> ${order.deliveryTime}` : ''}

<b>⏱ Час створення:</b> ${new Date(order.createdAt).toLocaleString('uk-UA')}`;
}
