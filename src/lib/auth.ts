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
                    const res = await fetch("https://palacio-motors-backend-production.up.railway.app/auth/login", {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" },
                    });

                    const data = await res.json();

                    if (res.ok && data.user) {
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.full_name,
                            role: data.user.role,
                            accessToken: data.access_token,
                            language: 'en',
                            companyId: 'default-id',
                            companyName: 'Default Company',
                            // language: data.user.language || 'en', // Not in response
                            // companyId: data.user.companyId, // Not in response
                            // companyName: data.user.companyName, // Not in response
                        };
                    }
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
