import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                try {
                    const { prisma } = await import("@/lib/prisma");
                    const bcrypt = await import("bcryptjs");

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.fullName,
                        role: user.role,
                        phone: user.phone,
                        accessToken: "", // No access token user-side for local db unless we implement JWT, but NextAuth handles session
                        language: 'en',
                        companyId: 'default-id',
                        companyName: 'Default Company',
                    };
                } catch (error) {
                    console.error("Login failed", error);
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.language = user.language;
                token.companyId = user.companyId ?? "";
                token.companyName = user.companyName ?? "";
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.language = token.language as string;
                session.user.companyId = token.companyId as string;
                session.user.companyName = token.companyName as string;
                session.user.phone = token.phone as string;
            }
            return session;
        },
    },
};
