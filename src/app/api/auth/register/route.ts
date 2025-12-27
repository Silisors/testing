import { NextResponse } from "next/server";

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

        // TODO: Uncomment this when the backend is ready
        /*
        try {
            const res = await fetch("https://palacio-motors-backend-production.up.railway.app/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    companyName,
                    country,
                    industry
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
                { message: "User created successfully", userId: data.userId },
                { status: 201 }
            );

        } catch (error) {
             console.error("Registration error:", error);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        }
        */

        // Mock implementation
        const mockUserId = "mock-user-id-" + Math.random().toString(36).substring(7);

        // Simulate checking if user exists
        if (email === "existing@example.com") {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "User created successfully", userId: mockUserId },
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
