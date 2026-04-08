import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { rateLimit, getClientIp, RATE_LIMIT_STANDARD } from "@/lib/rateLimit";

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterMs } = rateLimit(ip, "products", RATE_LIMIT_STANDARD);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        },
      );
    }

    await dbConnect();
    const products = await Product.find({}).lean();

    const transformedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const existing = await Product.findOne({ id: body.id });
    if (existing) {
      return NextResponse.json(
        { error: "Product with this ID already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
