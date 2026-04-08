import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { rateLimit, getClientIp, RATE_LIMIT_STRICT } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { CreateOrderSchema, formatZodErrors } from "@/lib/validation";
import { sendTelegramNotification, formatOrderMessage } from "@/lib/telegram";
import { generateNextOrderNumber } from "@/lib/orderNumber";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch orders:", message);
    return NextResponse.json(
      { error: "Server error while fetching orders" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterMs } = rateLimit(
      ip,
      "orders",
      RATE_LIMIT_STRICT,
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        },
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const sanitized = sanitizeObject(rawBody as Record<string, unknown>);

    const result = CreateOrderSchema.safeParse(sanitized);
    if (!result.success) {
      return NextResponse.json(
        { error: formatZodErrors(result.error) },
        { status: 400 },
      );
    }

    const {
      items,
      deliveryType,
      totalPrice,
      customer,
      deliveryDate,
      deliveryTime,
    } = result.data;

    await dbConnect();
    const orderNumber = await generateNextOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      items,
      deliveryType,
      totalPrice,
      customer,
      deliveryDate: deliveryDate ?? null,
      deliveryTime: deliveryTime ?? null,
      status: "pending",
    });

    const orderData = {
      ...newOrder.toObject(),
      orderNumber,
    };

    try {
      await sendTelegramNotification(formatOrderMessage(orderData));
    } catch (err) {
      console.error("Telegram notification failed:", err);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder._id,
        orderNumber: newOrder.orderNumber,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Order processing error:", message);
    return NextResponse.json(
      { error: "Server error while processing order" },
      { status: 500 },
    );
  }
}
