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

    const id = params.id;
    console.log("Attempting to update order status:", {
      id,
      status: body.status,
    });

    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          status: body.status,
        },
      },
      { new: true },
    );

    if (!order) {
      console.log("Order not found with id:", id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log(
      "Successfully updated status for order:",
      order._id,
      "to:",
      order.status,
    );

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
