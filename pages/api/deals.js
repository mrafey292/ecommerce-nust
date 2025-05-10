import dbConnect from "@/lib/mongoose";
import { Deal } from "@/models/Deal";
import { Product } from "@/models/Product";

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

    // Update the Product schema to include the new deal
    await Product.findByIdAndUpdate(
      productId,
      { $push: { deals: dealDoc._id } }
    );

    console.log(productId);

    res.json(dealDoc);
  }

  if (method === "PUT") {
    const { productId, discountType, discountAmount, startDate, endDate, isActive, _id } = req.body;
    
    // Get the old deal to check if productId changed
    const oldDeal = await Deal.findById(_id);
    
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

    // If productId changed, update both old and new products
    if (oldDeal && oldDeal.productId.toString() !== productId) {
      // Remove deal from old product
      await Product.findByIdAndUpdate(
        oldDeal.productId,
        { $pull: { deals: _id } }
      );
      // Add deal to new product
      await Product.findByIdAndUpdate(
        productId,
        { $push: { deals: _id } }
      );
    }

    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?._id) {
      const deal = await Deal.findById(req.query._id);
      if (deal) {
        // Remove deal from product before deleting
        await Product.findByIdAndUpdate(
          deal.productId,
          { $pull: { deals: req.query._id } }
        );
        await Deal.deleteOne({ _id: req.query._id });
      }
      res.json(true);
    }
  }
} 