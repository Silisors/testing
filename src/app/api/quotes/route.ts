import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Get all quotes for the company
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const quotes = await prisma.quote.findMany({
            where: {
                tender: {
                    companyId: session.user.companyId,
                },
            },
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        country: true,
                    },
                },
                tender: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(quotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
