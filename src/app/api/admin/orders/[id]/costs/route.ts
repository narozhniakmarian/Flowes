import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyAdminSession } from "@/lib/session";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const body = await req.json();
    await dbConnect();

    const orderNumber = params.id.replace('#', '');
    
    const order = await Order.findOneAndUpdate(
      { orderNumber: orderNumber },
      {
        $set: {
          costPrice: body.costPrice,
          deliveryCost: body.deliveryCost
        }
      },
      { new: true, upsert: false }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log('Updated order:', orderNumber, 'with values:', body.costPrice, body.deliveryCost, 'Result:', order);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order costs:", error);
    return NextResponse.json({ error: "Failed to update order costs" }, { status: 500 });
  }
}
