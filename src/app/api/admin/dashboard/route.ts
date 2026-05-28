import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const [totalRevenue, ordersCount, usersCount, productsCount, contactsCount] =
      await Promise.all([
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
        Order.countDocuments(),
        User.countDocuments(),
        Product.countDocuments(),
        Contact.countDocuments({ isRead: false }),
      ]);

    // Orders by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const ordersByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .lean();

    const revenue = totalRevenue[0]?.total || 0;

    return NextResponse.json({
      stats: {
        revenue,
        orders: ordersCount,
        users: usersCount,
        products: productsCount,
        unreadMessages: contactsCount,
      },
      ordersByMonth,
      recentOrders,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard stats" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}
