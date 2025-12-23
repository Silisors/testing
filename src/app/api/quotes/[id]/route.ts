import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
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

        const quote = await prisma.quote.findFirst({
            where: {
                id: params.id,
                tender: {
                    companyId: session.user.companyId,
                },
            },
            include: {
                items: true,
                supplier: true,
                tender: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                    },
                },
            },
        });

        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        return NextResponse.json(quote);
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
        const { status } = body;

        if (!status || !['RECEIVED', 'ANALYZING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        // Verify the quote belongs to the user's company
        const existingQuote = await prisma.quote.findFirst({
            where: {
                id: params.id,
                tender: {
                    companyId: session.user.companyId,
                },
            },
        });

        if (!existingQuote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        const quote = await prisma.quote.update({
            where: { id: params.id },
            data: { status },
            include: {
                items: true,
                supplier: true,
                tender: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return NextResponse.json(quote);
    } catch (error) {
        console.error("Error updating quote:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
