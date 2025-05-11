import dbConnect from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
  const { method, query } = req;
  const { limit } = query;

  if (method === "GET") {
    try {
      await dbConnect();
      const query = Review.find().sort({ createdAt: -1 });
      if (limit) {
        query.limit(parseInt(limit, 10));
      }
      const reviews = await query;
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed. Use GET." });
  }
}