import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Get all suppliers for the company
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const suppliers = await prisma.supplier.findMany({
            where: {
                companyId: session.user.companyId,
            },
            include: {
                _count: {
                    select: {
                        quotes: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create a new supplier
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, phone, website, country, categories } = body;

        if (!name || !email || !country) {
            return NextResponse.json(
                { error: "Name, email and country are required" },
                { status: 400 }
            );
        }

        const supplier = await prisma.supplier.create({
            data: {
                name,
                email,
                phone,
                website,
                country,
                scope: "NATIONAL",
                categories: categories || [],
                companyId: session.user.companyId,
            },
        });

        return NextResponse.json(supplier, { status: 201 });
    } catch (error) {
        console.error("Error creating supplier:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
