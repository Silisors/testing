import { NextResponse } from "next/server";

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
            const res = await fetch("https://palacio-motors-backend-production.up.railway.app/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    full_name: name,
                    phone
                }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (!res.ok) {
                return NextResponse.json(
                    { error: data.message || "Registration failed" },
                    { status: res.status }
                );
            }

            return NextResponse.json(
                { message: "User created successfully", userId: data.user?.id },
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
