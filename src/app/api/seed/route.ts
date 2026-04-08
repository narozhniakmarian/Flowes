import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    await Product.deleteMany({});

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Failed to seed database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
