import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { company: true },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    language: user.language,
                    companyId: user.companyId,
                    companyName: user.company?.name,
                };
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
            }
            return session;
        },
    },
};
