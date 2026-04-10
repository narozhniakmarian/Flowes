import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyAdminSession } from "@/lib/session";

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const body = await req.json();
    await dbConnect();

    const id = params.id.replace('#', '');
    console.log("Attempting to update order costs:", {
      id,
      costPrice: body.costPrice,
      deliveryCost: body.deliveryCost,
    });

    let order;
    if (id.length === 24) {
      order = await Order.findByIdAndUpdate(
        id,
        {
          $set: {
            costPrice: body.costPrice,
            deliveryCost: body.deliveryCost,
          },
        },
        { new: true },
      );
    }

    if (!order) {
      order = await Order.findOneAndUpdate(
        { orderNumber: id },
        {
          $set: {
            costPrice: body.costPrice,
            deliveryCost: body.deliveryCost,
          },
        },
        { new: true },
      );
    }

    if (!order) {
      console.log("Order not found with ID or orderNumber:", id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Successfully updated order:", order.orderNumber || order._id, "Resulting fields:", {
      costPrice: order.costPrice,
      deliveryCost: order.deliveryCost,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order costs:", error);
    return NextResponse.json(
      { error: "Failed to update order costs" },
      { status: 500 },
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
