import { model, Schema, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  name: { type: String },
  emailVerified: { type: Date, default: null },
  image: { type: String, default: null },
});

// Hash the password before saving (only for email/password users)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = models.User || model('User', UserSchema);