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
    async jwt({ token, account }: { token: Token; account?: { id_token?: string | null } | null }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: Token; }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (token.idToken) {
        session.idToken = token.idToken;
      }
      return session;
    },
  },
});
