import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ order: 1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (body.name_pl && (!body.slug || body.slug.trim() === "")) {
      body.slug = body.name_pl
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    } else if (body.slug) {
      body.slug = body.slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    if (!body.id || body.id.trim() === "") {
      body.id = body.slug || `cat-${Date.now()}`;
    }

    const existing = await Category.findOne({
      $or: [{ id: body.id }, { slug: body.slug }]
    });

    if (existing) {
      const suffix = Math.random().toString(36).substring(2, 7);
      body.id = `${body.id}-${suffix}`;
      body.slug = `${body.slug}-${suffix}`;
    }

    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
