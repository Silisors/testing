import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface QuoteAnalysis {
    bestOverall: {
        quoteId: string;
        reason: string;
    };
    bestPrice: {
        quoteId: string;
        price: number;
    };
    bestDelivery: {
        quoteId: string;
        days: number;
    };
    recommendations: string[];
    savingsEstimate: number;
    riskFactors: string[];
    scores: Record<string, number>;
}

interface QuoteForAnalysis {
    id: string;
    supplierName: string;
    totalPrice: number;
    currency: string;
    deliveryDays?: number;
    warranty?: string;
    paymentTerms?: string;
    supplierRating?: number;
    items: Array<{
        productName: string;
        quantity: number;
        unitPrice: number;
    }>;
}

/**
 * Analyzes and compares multiple quotes using AI
 */
export async function analyzeQuotes(quotes: QuoteForAnalysis[]): Promise<QuoteAnalysis> {
    if (quotes.length === 0) {
        throw new Error("No quotes to analyze");
    }

    if (quotes.length === 1) {
        return {
            bestOverall: { quoteId: quotes[0].id, reason: "Only quote available" },
            bestPrice: { quoteId: quotes[0].id, price: quotes[0].totalPrice },
            bestDelivery: { quoteId: quotes[0].id, days: quotes[0].deliveryDays || 0 },
            recommendations: ["Consider getting more quotes for comparison"],
            savingsEstimate: 0,
            riskFactors: [],
            scores: { [quotes[0].id]: 80 },
        };
    }

    if (!process.env.OPENAI_API_KEY) {
        return analyzeQuotesWithoutAI(quotes);
    }

    try {
        const quotesDescription = quotes
            .map(
                (q, i) =>
                    `Quote ${i + 1} (ID: ${q.id}):
  - Supplier: ${q.supplierName}
  - Total Price: ${q.currency} ${q.totalPrice}
  - Delivery: ${q.deliveryDays || "Not specified"} days
  - Warranty: ${q.warranty || "Not specified"}
  - Payment Terms: ${q.paymentTerms || "Not specified"}
  - Supplier Rating: ${q.supplierRating || "Not rated"}`
            )
            .join("\n\n");

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a procurement analysis expert. Analyze the following quotes and provide:
1. Best overall quote (considering price, delivery, warranty, and supplier reliability)
2. Best price quote
3. Best delivery time quote
4. Recommendations for the buyer
5. Estimated savings compared to highest quote
6. Any risk factors to consider
7. A score (0-100) for each quote

Consider these factors in your analysis:
- Price competitiveness
- Delivery speed
- Warranty terms
- Payment flexibility
- Supplier reliability (if rating available)

Respond in JSON format:
{
  "bestOverall": { "quoteId": "id", "reason": "explanation" },
  "bestPrice": { "quoteId": "id", "price": number },
  "bestDelivery": { "quoteId": "id", "days": number },
  "recommendations": ["recommendation1", "recommendation2"],
  "savingsEstimate": number,
  "riskFactors": ["risk1", "risk2"],
  "scores": { "quoteId1": score1, "quoteId2": score2 }
}`,
                },
                {
                    role: "user",
                    content: `Analyze these quotes:\n\n${quotesDescription}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content || "{}");
    } catch (error) {
        console.error("Error analyzing quotes with AI:", error);
        return analyzeQuotesWithoutAI(quotes);
    }
}

function analyzeQuotesWithoutAI(quotes: QuoteForAnalysis[]): QuoteAnalysis {
    // Sort by price
    const sortedByPrice = [...quotes].sort((a, b) => a.totalPrice - b.totalPrice);
    const bestPriceQuote = sortedByPrice[0];
    const highestPriceQuote = sortedByPrice[sortedByPrice.length - 1];

    // Sort by delivery
    const quotesWithDelivery = quotes.filter((q) => q.deliveryDays !== undefined);
    const sortedByDelivery = [...quotesWithDelivery].sort(
        (a, b) => (a.deliveryDays || 999) - (b.deliveryDays || 999)
    );
    const bestDeliveryQuote = sortedByDelivery[0] || bestPriceQuote;

    // Calculate scores based on price and delivery
    const scores: Record<string, number> = {};
    const maxPrice = Math.max(...quotes.map((q) => q.totalPrice));
    const minPrice = Math.min(...quotes.map((q) => q.totalPrice));
    const priceRange = maxPrice - minPrice || 1;

    quotes.forEach((quote) => {
        const priceScore = 100 - ((quote.totalPrice - minPrice) / priceRange) * 50;
        const deliveryScore = quote.deliveryDays ? Math.max(0, 100 - quote.deliveryDays * 2) : 50;
        scores[quote.id] = Math.round((priceScore * 0.6 + deliveryScore * 0.4));
    });

    // Find best overall
    const bestOverallId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const bestOverallQuote = quotes.find((q) => q.id === bestOverallId)!;

    const savingsEstimate = highestPriceQuote.totalPrice - bestPriceQuote.totalPrice;

    return {
        bestOverall: {
            quoteId: bestOverallId,
            reason: `Best balance of price (${bestOverallQuote.currency} ${bestOverallQuote.totalPrice}) and delivery time`,
        },
        bestPrice: {
            quoteId: bestPriceQuote.id,
            price: bestPriceQuote.totalPrice,
        },
        bestDelivery: {
            quoteId: bestDeliveryQuote.id,
            days: bestDeliveryQuote.deliveryDays || 0,
        },
        recommendations: [
            `The best price is ${((savingsEstimate / highestPriceQuote.totalPrice) * 100).toFixed(1)}% lower than the highest quote`,
            "Consider negotiating with the best overall supplier for better terms",
            quotes.length < 3 ? "Getting more quotes could provide better options" : "",
        ].filter(Boolean),
        savingsEstimate,
        riskFactors: quotes
            .filter((q) => !q.warranty)
            .map((q) => `${q.supplierName} did not specify warranty terms`),
        scores,
    };
}

/**
 * Generates a summary report of the quote analysis
 */
export async function generateQuoteReport(
    analysis: QuoteAnalysis,
    quotes: QuoteForAnalysis[],
    locale: string = "es"
): Promise<string> {
    const bestQuote = quotes.find((q) => q.id === analysis.bestOverall.quoteId);

    if (locale === "en") {
        return `# Quote Analysis Report

## Best Overall Option
**${bestQuote?.supplierName}** - Score: ${analysis.scores[analysis.bestOverall.quoteId]}/100
Reason: ${analysis.bestOverall.reason}

## Best Price
${quotes.find((q) => q.id === analysis.bestPrice.quoteId)?.supplierName}: $${analysis.bestPrice.price}

## Fastest Delivery
${quotes.find((q) => q.id === analysis.bestDelivery.quoteId)?.supplierName}: ${analysis.bestDelivery.days} days

## Estimated Savings
$${analysis.savingsEstimate.toFixed(2)} compared to highest quote

## Recommendations
${analysis.recommendations.map((r) => `- ${r}`).join("\n")}

## Risk Factors
${analysis.riskFactors.length > 0 ? analysis.riskFactors.map((r) => `- ${r}`).join("\n") : "No significant risks identified"}
`;
    }

    // Default: Spanish
    return `# Informe de Análisis de Cotizaciones

## Mejor Opción General
**${bestQuote?.supplierName}** - Puntuación: ${analysis.scores[analysis.bestOverall.quoteId]}/100
Razón: ${analysis.bestOverall.reason}

## Mejor Precio
${quotes.find((q) => q.id === analysis.bestPrice.quoteId)?.supplierName}: $${analysis.bestPrice.price}

## Entrega Más Rápida
${quotes.find((q) => q.id === analysis.bestDelivery.quoteId)?.supplierName}: ${analysis.bestDelivery.days} días

## Ahorro Estimado
$${analysis.savingsEstimate.toFixed(2)} comparado con la cotización más alta

## Recomendaciones
${analysis.recommendations.map((r) => `- ${r}`).join("\n")}

## Factores de Riesgo
${analysis.riskFactors.length > 0 ? analysis.riskFactors.map((r) => `- ${r}`).join("\n") : "No se identificaron riesgos significativos"}
`;
}
