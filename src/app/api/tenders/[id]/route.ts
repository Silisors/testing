import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Get a specific tender
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tender = await prisma.tender.findUnique({
            where: {
                id: params.id,
                companyId: session.user.companyId,
            },
            include: {
                items: true,
                quotes: {
                    include: {
                        supplier: true,
                        items: true,
                    },
                },
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
        });

        if (!tender) {
            return NextResponse.json({ error: "Tender not found" }, { status: 404 });
        }

        return NextResponse.json(tender);
    } catch (error) {
        console.error("Error fetching tender:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update a tender
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, deadline, supplierScope, status } = body;

        const tender = await prisma.tender.update({
            where: {
                id: params.id,
                companyId: session.user.companyId,
            },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(deadline && { deadline: new Date(deadline) }),
                ...(supplierScope && { supplierScope }),
                ...(status && { status }),
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(tender);
    } catch (error) {
        console.error("Error updating tender:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a tender
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.tender.delete({
            where: {
                id: params.id,
                companyId: session.user.companyId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting tender:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
