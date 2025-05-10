import dbConnect from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  const { id } = req.query;

  try {
    if (method === "GET") {
      if (id) {
        // Fetch single order
        const order = await Order.findById(id);
        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
      } else {
        // Fetch all orders
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error in orders API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}