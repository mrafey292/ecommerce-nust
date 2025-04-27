import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      const productDoc = await Product.findOne({ _id: req.query.id });
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body; //MADE CHANGES HERE
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, price, images, category, properties, _id } =
      req.body; //CHANGES HERE
    await Product.updateOne(
      { _id },
      {
        title,
        description,
        price,
        images,
        category,
        properties,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
