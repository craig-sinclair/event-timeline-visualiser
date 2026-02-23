import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import { dbConnect } from "@/lib/mongoose";
import { findUserByEmailOrPhone } from "@/services/authService";
import { comparePassword } from "@/services/passwordService";

const handler = NextAuth({
	session: { strategy: "jwt" },
	pages: {
		signIn: "/signin",
	},
	providers: [
		CredentialsProvider({
			id: "email-password",
			name: "Email + Password",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				await dbConnect();

				const user = await findUserByEmailOrPhone(credentials!.email);
				if (!user) return null;

				const valid = await comparePassword(credentials!.password, user.passwordHash!);
				if (!valid) return null;

				return { id: user._id.toString(), email: user.email, name: user.name };
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user?.id) token.id = user.id;
			return token;
		},
		async session({ session, token }) {
			if (session.user && typeof token?.id === "string") {
				session.user.id = token.id;
			}
			return session;
		},
	},
});

export { handler as GET, handler as POST };
