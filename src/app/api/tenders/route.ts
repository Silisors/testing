import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - List all tenders for the user's company
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        const tenders = await prisma.tender.findMany({
            where: {
                companyId: session.user.companyId,
                ...(status && { status: status as any }),
            },
            include: {
                items: true,
                supplierSearches: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                _count: {
                    select: {
                        quotes: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(tenders);
    } catch (error) {
        console.error("Error fetching tenders:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create a new tender
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, deadline, supplierScope, currency, items } = body;

        if (!title || !items || items.length === 0) {
            return NextResponse.json(
                { error: "Title and at least one item are required" },
                { status: 400 }
            );
        }

        const tender = await prisma.tender.create({
            data: {
                title,
                description,
                deadline: deadline ? new Date(deadline) : null,
                supplierScope: supplierScope || "ALL",
                currency: currency || "USD",
                companyId: session.user.companyId,
                items: {
                    create: items.map((item: any) => ({
                        productName: item.productName,
                        description: item.description,
                        quantity: item.quantity || 1,
                        unit: item.unit,
                        specifications: item.specifications,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(tender, { status: 201 });
    } catch (error) {
        console.error("Error creating tender:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
