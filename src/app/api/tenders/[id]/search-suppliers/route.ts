import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { analyzeProducts, searchSuppliers } from "@/lib/ai/supplier-search";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the tender with items
        const tender = await prisma.tender.findFirst({
            where: {
                id: params.id,
                companyId: session.user.companyId,
            },
            include: {
                items: true,
                company: true,
            },
        });

        if (!tender) {
            return NextResponse.json({ error: "Tender not found" }, { status: 404 });
        }

        // Set status to SEARCHING at the beginning
        await prisma.tender.update({
            where: { id: tender.id },
            data: { status: "SEARCHING" },
        });

        // Analyze products
        const productAnalysis = await analyzeProducts(
            tender.items.map((item) => ({
                productName: item.productName,
                specifications: item.specifications || undefined,
            }))
        );

        // Search for suppliers
        const suppliers = await searchSuppliers(
            productAnalysis,
            tender.supplierScope as any,
            tender.company.country
        );

        // Save the search
        await prisma.supplierSearch.create({
            data: {
                tenderId: tender.id,
                query: JSON.stringify(productAnalysis),
                resultsCount: suppliers.length,
                aiResponse: JSON.stringify(suppliers),
            },
        });

        // Update tender status to QUOTING after search completes
        await prisma.tender.update({
            where: { id: tender.id },
            data: { status: "QUOTING" },
        });

        // Save suppliers and generate quotes for online marketplaces
        const createdQuotes = [];

        for (const supplier of suppliers) {
            // Check if supplier exists
            let dbSupplier = await prisma.supplier.findFirst({
                where: {
                    email: supplier.email,
                    companyId: session.user.companyId,
                },
            });

            // Create supplier if doesn't exist
            if (!dbSupplier) {
                dbSupplier = await prisma.supplier.create({
                    data: {
                        name: supplier.name,
                        email: supplier.email,
                        phone: supplier.phone,
                        website: supplier.website,
                        country: supplier.country,
                        scope: supplier.scope,
                        categories: supplier.categories,
                        companyId: session.user.companyId,
                    },
                });
            }

            // Generate automatic quotes for online marketplace suppliers
            const isOnlineMarketplace = ['Mercado Libre', 'Amazon', 'Alkosto', 'Éxito',
                'Falabella', 'Homecenter', 'Linio', 'Dell', 'HP', 'Lenovo', 'AliExpress', 'Alibaba']
                .some(marketplace => supplier.name.toLowerCase().includes(marketplace.toLowerCase()));

            if (isOnlineMarketplace || supplier.confidence > 0.7) {
                // Generate estimated prices based on product analysis
                const quoteItems = tender.items.map(item => {
                    // Estimate price based on product type (this would be replaced with real API calls in production)
                    const basePrice = estimateProductPrice(item.productName, item.specifications || '');
                    const variance = 0.8 + Math.random() * 0.4; // ±20% variance between suppliers
                    const unitPrice = Math.round(basePrice * variance * 100) / 100;

                    return {
                        tenderItemId: item.id,
                        productName: item.productName,
                        quantity: item.quantity,
                        unitPrice: unitPrice,
                        totalPrice: unitPrice * item.quantity,
                    };
                });

                const totalPrice = quoteItems.reduce((sum, item) => sum + item.totalPrice, 0);

                // Create the quote
                const quote = await prisma.quote.create({
                    data: {
                        tenderId: tender.id,
                        supplierId: dbSupplier.id,
                        totalPrice: totalPrice,
                        currency: tender.currency,
                        deliveryDays: Math.floor(Math.random() * 10) + 3, // 3-12 days
                        warranty: '12 meses',
                        paymentTerms: isOnlineMarketplace ? 'Pago en línea' : 'Crédito 30 días',
                        notes: `Cotización automática generada vía ${supplier.name}`,
                        sourceUrl: supplier.website || null,
                        status: 'RECEIVED',
                        items: {
                            create: quoteItems,
                        },
                    },
                    include: {
                        items: true,
                        supplier: true,
                    },
                });

                createdQuotes.push(quote);
            }
        }

        return NextResponse.json({
            success: true,
            analysis: productAnalysis,
            suppliers,
            count: suppliers.length,
            quotesGenerated: createdQuotes.length,
        });
    } catch (error) {
        console.error("Error searching suppliers:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Helper function to estimate product prices
function estimateProductPrice(productName: string, specifications: string): number {
    const lowerName = productName.toLowerCase();
    const lowerSpecs = specifications.toLowerCase();

    // Technology products
    if (lowerName.includes('laptop') || lowerName.includes('portatil')) {
        if (lowerSpecs.includes('i7') || lowerSpecs.includes('i9')) return 4500000; // COP
        if (lowerSpecs.includes('i5')) return 3200000;
        return 2500000;
    }
    if (lowerName.includes('computador') || lowerName.includes('desktop') || lowerName.includes('pc')) {
        return 2800000;
    }
    if (lowerName.includes('monitor')) {
        if (lowerSpecs.includes('27') || lowerSpecs.includes('32')) return 1200000;
        return 800000;
    }
    if (lowerName.includes('impresora') || lowerName.includes('printer')) {
        return 450000;
    }
    if (lowerName.includes('teclado') || lowerName.includes('keyboard')) {
        return 120000;
    }
    if (lowerName.includes('mouse') || lowerName.includes('raton')) {
        return 80000;
    }

    // Office supplies
    if (lowerName.includes('silla') || lowerName.includes('chair')) {
        if (lowerSpecs.includes('ergonomic')) return 850000;
        return 350000;
    }
    if (lowerName.includes('escritorio') || lowerName.includes('desk')) {
        return 650000;
    }
    if (lowerName.includes('papel') || lowerName.includes('paper')) {
        return 25000;
    }

    // Default price
    return 500000;
}

