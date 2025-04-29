// pages/api/auth/[...nextauth].js
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '../../../lib/db';
import dbConnect from '../../../lib/mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Connect to the database with Mongoose for User model operations
          await dbConnect();
          console.log('Connected to MongoDB via Mongoose');

          // Find the user by email
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.log('No user found with this email');
            return null;
          }
          
          console.log('User found:', user.email);
          
          // Check if the password matches (only for email/password users)
          if (user.password) {
            const isValidPassword = await bcrypt.compare(credentials.password, user.password);
            if (!isValidPassword) {
              console.log('Invalid password');
              return null;
            }
          } else {
            console.log('This account uses Google login');
            return null;
          }
          
          // Return the user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image
          };
        } catch (error) {
          console.error('Error in authorize function:', error);
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'YOUR_SECRET_HERE', // Add your secret here
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);