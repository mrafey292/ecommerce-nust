import dbConnect from "@/lib/mongoose";
import {Order} from "@/models/Order";

export default async function handler(req,res) {
  await dbConnect();
  res.json(await Order.find().sort({createdAt:-1}));
}