import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            language: string;
            companyId: string;
            companyName: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: string;
        language: string;
        companyId: string | null;
        companyName: string | undefined;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: string;
        language: string;
        companyId: string;
        companyName: string;
    }
}
