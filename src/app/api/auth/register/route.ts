import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, phone } = body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: "User already exists" },
                    { status: 409 }
                );
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    fullName: name,
                    phone,
                    role: 'USER'
                },
            });

            return NextResponse.json(
                { message: "User created successfully", userId: user.id },
                { status: 201 }
            );

        } catch (error) {
            console.error("Registration error:", error);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
