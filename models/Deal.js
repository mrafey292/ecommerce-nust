import mongoose, { model, models, Schema } from "mongoose";

const DealSchema = new Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Deal = models?.Deal || model('Deal', DealSchema); 