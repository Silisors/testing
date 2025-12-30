import { NextResponse } from "next/server";
import { SearchAgent } from "@/lib/search/search-agent";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { query, location } = body;

        if (!query) {
            return NextResponse.json(
                { error: "Query is required" },
                { status: 400 }
            );
        }

        // Call the AI Agent
        const result = await SearchAgent.findDeals(query, location || "Bogota, Colombia");

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("[API] Search failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
