import { mongooseConnect } from '@/lib/mongoose';
import { User } from '@/models/User';

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  await mongooseConnect();

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create a new user
  const user = new User({
    email,
    password,
    name: name || null, // Optional name field
    emailVerified: null, // Email verification not implemented
    image: null, // Optional profile picture
  });
  await user.save();

  res.status(201).json({ message: 'User created successfully' });
}