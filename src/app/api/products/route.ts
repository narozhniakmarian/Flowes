import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { rateLimit, getClientIp, RATE_LIMIT_STANDARD } from "@/lib/rateLimit";

export async function GET(req: Request) {
  try {
    // Rate limiting — standard: 30 req/min per IP
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
