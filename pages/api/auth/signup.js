// pages/api/auth/signup.js
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure database connection is established
    await dbConnect();
    
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'User already exists' });
    }
    
    // Create user (password will be hashed by the pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });
    
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}