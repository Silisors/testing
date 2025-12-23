import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, companyName, country, industry } = body;

        // Validate required fields
        if (!name || !email || !password || !companyName || !country) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create company and user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: companyName,
                    country,
                    industry,
                },
            });

            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "ADMIN",
                    companyId: company.id,
                },
            });

            return { user, company };
        });

        return NextResponse.json(
            { message: "User created successfully", userId: result.user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
