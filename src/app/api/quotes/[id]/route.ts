import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get a specific quote
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Mock response
        return NextResponse.json({
            id: params.id,
            status: "RECEIVED",
            items: [],
            supplier: { id: "mock-supplier", name: "Mock Supplier" },
            tender: { id: "mock-tender", title: "Mock Tender" }
        });
    } catch (error) {
        console.error("Error fetching quote:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH - Update quote status
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Mock response
        return NextResponse.json({
            id: params.id,
            ...body
        });
    } catch (error) {
        console.error("Error updating quote:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
