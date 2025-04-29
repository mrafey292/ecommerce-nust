// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Check if the User model already exists to prevent OverwriteModelError
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  name: { type: String },
  emailVerified: { type: Date, default: null },
  image: { type: String, default: null },
}, { timestamps: true });

// Hash the password before saving (only for email/password users)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Export the User model if it doesn't exist already
export const User = mongoose.models.User || mongoose.model('User', UserSchema);