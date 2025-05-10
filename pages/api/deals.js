import dbConnect from "@/lib/mongoose";
import { Deal } from "@/models/Deal";

export default async function handle(req, res) {
  const { method } = req;
  await dbConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Deal.findOne({ _id: req.query.id }));
    } else {
      res.json(await Deal.find().sort({ createdAt: -1 }));
    }
  }

  if (method === "POST") {
    const { productId, discountType, discountAmount, startDate, endDate, isActive } = req.body;
    const dealDoc = await Deal.create({
      productId,
      discountType,
      discountAmount,
      startDate,
      endDate,
      isActive,
    });
    res.json(dealDoc);
  }

  if (method === "PUT") {
    const { productId, discountType, discountAmount, startDate, endDate, isActive, _id } = req.body;
    await Deal.updateOne(
      { _id },
      {
        productId,
        discountType,
        discountAmount,
        startDate,
        endDate,
        isActive,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?._id) {
      await Deal.deleteOne({ _id: req.query._id });
      res.json(true);
    }
  }
} 