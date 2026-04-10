import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { verifyAdminSession } from "@/lib/session";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const [products, orders] = await Promise.all([
      Product.find({}).lean(),
      Order.find({}).lean()
    ]);

    const productOrderCounts: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        productOrderCounts[item.productId] = (productOrderCounts[item.productId] || 0) + item.quantity;
      });
    });

    const productsWithOrderCount = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      orderCount: productOrderCounts[product.id] || 0
    }));

    return NextResponse.json(productsWithOrderCount);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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

    const product = new Product({
      id: randomUUID(),
      image: body.image,
      name_ua: body.name_ua,
      name_pl: body.name_pl,
      category_ua: body.category_ua,
      category_pl: body.category_pl,
      price: body.price,
      ingredients: body.ingredients || [],
      tags_ua: body.tags_ua || [],
      tags_pl: body.tags_pl || [],
      description_ua: body.description_ua || "",
      description_pl: body.description_pl || "",
      seo_ua: body.seo_ua || "",
      seo_pl: body.seo_pl || ""
    });

    await product.save();
    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
