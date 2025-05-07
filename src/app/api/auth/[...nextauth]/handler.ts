import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { Token } from "./route";

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CREDENTIALS_OAUTH_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CREDENTIALS_OAUTH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token }: { token: Token; }) {
      return token;
    },
    async session({ session, token }: { session: any; token: Token; }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
