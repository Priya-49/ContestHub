// app/api/auth/[..nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db"; // Import your DB connection
import User from "@/lib/models/User";
import bcrypt from "bcryptjs"; // Import bcryptjs

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB(); // Connect to the database

        if (!credentials?.email || !credentials?.password) {
          return null; // No credentials provided
        }

        // Find user by email
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null; // User not found
        }

        // Compare provided password with hashed password from the database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (isPasswordValid) {
          // If passwords match, return the user object (minimal info for session)
          return {
            id: user._id.toString(), // Convert MongoDB ObjectId to string
            name: user.email, // Or a separate 'name' field if your User model had one
            email: user.email,
          };
        } else {
          return null; // Passwords do not match
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET, // Redundant if jwt.secret is set, but common to have
  pages: {
    signIn: "/login", // This is if you have a dedicated /login page, otherwise modal handles it.
  },
});

export { handler as GET, handler as POST };