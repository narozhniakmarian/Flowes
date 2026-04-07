import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Parallel queries
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      monthlyOrders,
      monthlyRevenue,
      ordersByMonth
    ] = await Promise.all([
      // Total products count
      Product.countDocuments(),

      // Total orders all time
      Order.countDocuments(),

      // Total revenue all time
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]).then(res => res[0]?.total || 0),

      // Orders this month
      Order.countDocuments({
        createdAt: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1)
        }
      }),

      // Revenue this month
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentYear, currentMonth, 1),
              $lt: new Date(currentYear, currentMonth + 1, 1)
            }
          }
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]).then(res => res[0]?.total || 0),

      // Last 12 months orders + revenue
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentYear - 1, currentMonth, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$totalPrice" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ])
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        currentMonth: {
          orders: monthlyOrders,
          revenue: monthlyRevenue
        },
        last12Months: ordersByMonth.map(item => ({
          year: item._id.year,
          month: item._id.month,
          orders: item.orders,
          revenue: item.revenue
        }))
      }
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Dashboard stats error:", message);
    return NextResponse.json(
      { error: "Server error while loading dashboard stats" },
      { status: 500 },
    );
  }
}
