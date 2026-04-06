import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import data from "@/app/data.json";

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing products and insert the ones from data.json
    await Product.deleteMany({});
    await Product.insertMany(data);
    
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Failed to seed database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
