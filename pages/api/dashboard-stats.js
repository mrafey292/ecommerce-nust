import dbConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const reviewsCount = await Review.countDocuments();
    const revenue = await Order.aggregate([
      { $unwind: "$line_items" }, // Unwind the line_items array
      { $group: { _id: null, total: { $sum: "$line_items.price" } } },
    ]);

    res.status(200).json({
      products: productsCount,
      orders: ordersCount,
      reviews: reviewsCount,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}