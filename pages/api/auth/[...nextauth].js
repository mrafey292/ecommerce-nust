import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import client from '../../../lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export default NextAuth({
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
        const { email, password } = credentials;

        // Connect to the database
        await client.connect();

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check if the password matches (only for email/password users)
        if (user.password) {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }
        } else {
          throw new Error('This account uses Google login');
        }

        // Return the user object
        return { id: user._id, email: user.email, name: user.name };
      },
    }),
  ],
  adapter: MongoDBAdapter(client),
  session: {
    strategy: 'jwt',
  },
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
});