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

                // TODO: Uncomment this when the backend is ready
                /*
                try {
                    const res = await fetch("https://palacio-motors-backend-production.up.railway.app/api/auth/login", {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" },
                    });

                    const user = await res.json();

                    if (res.ok && user) {
                         return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            language: user.language || 'en',
                            companyId: user.companyId,
                            companyName: user.companyName,
                        };
                    }
                } catch (error) {
                    console.error("Login failed", error);
                }
                return null;
                */

                // Mock implementation
                const isAdmin = credentials.email === "prueba01@yopmail.com";
                return {
                    id: isAdmin ? "admin-id" : "user-id",
                    email: credentials.email,
                    name: isAdmin ? "Admin User" : "Normal User",
                    role: isAdmin ? "ADMIN" : "USER",
                    language: "en",
                    companyId: "mock-company-id",
                    companyName: "Mock Company",
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
