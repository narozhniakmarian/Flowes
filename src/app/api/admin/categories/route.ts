import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { verifyAdminSession } from "@/lib/session";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const categories = await Category.find({}).sort({ order: 1 }).lean();

    return NextResponse.json(categories.map(cat => ({
      ...cat,
      _id: cat._id.toString()
    })));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const category = new Category({
      id: randomUUID(),
      name_ua: body.name_ua,
      name_pl: body.name_pl,
      slug: body.slug,
      order: body.order || 0,
      active: body.active !== false
    });

    await category.save();
    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
