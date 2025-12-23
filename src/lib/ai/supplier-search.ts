import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface SupplierSearchResult {
    name: string;
    description: string;
    email: string;
    phone?: string;
    website?: string;
    country: string;
    scope: "LOCAL" | "NATIONAL" | "INTERNATIONAL";
    categories: string[];
    confidence: number;
}

export interface ProductAnalysis {
    categories: string[];
    keywords: string[];
    suggestedSearchTerms: string[];
}

/**
 * Analyzes products from a tender to understand what categories and keywords to search for
 */
export async function analyzeProducts(items: Array<{ productName: string; specifications?: string }>): Promise<ProductAnalysis> {
    if (!process.env.OPENAI_API_KEY) {
        // Return basic analysis without AI
        return {
            categories: items.map((item) => item.productName.split(" ")[0]),
            keywords: items.map((item) => item.productName),
            suggestedSearchTerms: items.map((item) => item.productName),
        };
    }

    try {
        const productList = items
            .map((item) => `- ${item.productName}${item.specifications ? `: ${item.specifications}` : ""}`)
            .join("\n");

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a procurement expert. Analyze the following list of products and extract:
1. Main product categories (e.g., "Office Equipment", "Electronics", "Raw Materials")
2. Key search keywords
3. Suggested search terms to find suppliers

Respond in JSON format:
{
  "categories": ["category1", "category2"],
  "keywords": ["keyword1", "keyword2"],
  "suggestedSearchTerms": ["term1", "term2"]
}`,
                },
                {
                    role: "user",
                    content: `Products to analyze:\n${productList}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content || "{}");
    } catch (error) {
        console.error("Error analyzing products:", error);
        return {
            categories: items.map((item) => item.productName.split(" ")[0]),
            keywords: items.map((item) => item.productName),
            suggestedSearchTerms: items.map((item) => item.productName),
        };
    }
}

/**
 * Searches for suppliers based on product analysis and scope
 */
export async function searchSuppliers(
    analysis: ProductAnalysis,
    scope: "LOCAL" | "NATIONAL" | "INTERNATIONAL" | "ALL",
    companyCountry: string
): Promise<SupplierSearchResult[]> {
    if (!process.env.OPENAI_API_KEY) {
        // Return demo suppliers without AI
        return getDemoSuppliers(analysis.categories, scope, companyCountry);
    }

    try {
        const scopeDescription = {
            LOCAL: `local suppliers in ${companyCountry} only`,
            NATIONAL: `suppliers from anywhere in ${companyCountry}`,
            INTERNATIONAL: `international suppliers, excluding ${companyCountry}`,
            ALL: `suppliers from anywhere in the world, prioritizing quality and reliability`,
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a procurement AI assistant for Latin American businesses. Generate a comprehensive list of supplier and marketplace suggestions.

IMPORTANT: Include BOTH traditional suppliers AND popular e-commerce/marketplace platforms where these products can be purchased. Consider:

**E-Commerce & Marketplaces (ALWAYS include relevant ones):**
- Mercado Libre (mercadolibre.com.co) - Colombia's largest marketplace
- Amazon (amazon.com) - International marketplace
- Alkosto/Ktronix (alkosto.com) - Tech & home electronics in Colombia
- Éxito/Carulla (exito.com) - Major Colombian retailer
- Falabella (falabella.com.co) - Department store & tech
- Homecenter (homecenter.com.co) - Construction & tools
- Linio (linio.com.co) - Online marketplace
- Facebook Marketplace - Local sellers
- OLX (olx.com.co) - Classifieds marketplace
- Alibaba (alibaba.com) - B2B international wholesale
- AliExpress (aliexpress.com) - International retail
- Dell Direct (dell.com.co) - Direct manufacturer sales
- HP Store (hp.com/co) - Direct manufacturer sales
- Lenovo Direct (lenovo.com/co) - Direct manufacturer sales

**Traditional Suppliers:**
- Local distributors and wholesalers
- Manufacturer representatives
- Specialized B2B suppliers

For each supplier/marketplace, provide:
- Name (company/platform name)
- Description (what they sell and why they're relevant)
- Email (contact email or "marketplace@platform.com" for marketplaces)
- Phone (optional, customer service number)
- Website (REQUIRED - the actual URL where products can be found)
- Country (ISO code)
- Scope (LOCAL, NATIONAL, or INTERNATIONAL)
- Categories (list of product categories)
- Confidence (0-1 score based on product relevance and pricing competitiveness)

Generate 8-15 suppliers/marketplaces. Prioritize platforms where the specific products are actually available with competitive prices.

Respond in JSON format:
{
  "suppliers": [
    {
      "name": "Company Name",
      "description": "Description",
      "email": "contact@company.com",
      "phone": "+1234567890",
      "website": "https://company.com",
      "country": "CO",
      "scope": "NATIONAL",
      "categories": ["category1"],
      "confidence": 0.95
    }
  ]
}`,
                },
                {
                    role: "user",
                    content: `Find suppliers for these categories: ${analysis.categories.join(", ")}

Search terms: ${analysis.suggestedSearchTerms.join(", ")}

Scope: ${scopeDescription[scope]}
Company location: ${companyCountry}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        const parsed = JSON.parse(content || '{"suppliers": []}');
        return parsed.suppliers || [];
    } catch (error) {
        console.error("Error searching suppliers:", error);
        return getDemoSuppliers(analysis.categories, scope, companyCountry);
    }
}

function getDemoSuppliers(
    categories: string[],
    scope: string,
    country: string
): SupplierSearchResult[] {
    const demoSuppliers: SupplierSearchResult[] = [
        {
            name: "Mercado Libre Colombia",
            description: "El marketplace más grande de Colombia con miles de vendedores de tecnología y precios competitivos",
            email: "empresas@mercadolibre.com.co",
            phone: "+57 1 800 123 4567",
            website: "https://www.mercadolibre.com.co",
            country: "CO",
            scope: "NATIONAL",
            categories: ["Tecnología", "Electrónicos", "Todo"],
            confidence: 0.95,
        },
        {
            name: "Alkosto / Ktronix",
            description: "Cadena de retail especializada en tecnología y electrónicos con precios de almacén",
            email: "empresas@alkosto.com",
            phone: "+57 1 423 3000",
            website: "https://www.alkosto.com",
            country: "CO",
            scope: "NATIONAL",
            categories: ["Tecnología", "Computadores", "Electrónicos"],
            confidence: 0.93,
        },
        {
            name: "Éxito Empresas",
            description: "División empresarial del Grupo Éxito con catálogo amplio y opciones de financiación",
            email: "ventasempresariales@exito.com",
            phone: "+57 4 339 6565",
            website: "https://www.exito.com",
            country: "CO",
            scope: "NATIONAL",
            categories: ["Tecnología", "Oficina", "Suministros"],
            confidence: 0.88,
        },
        {
            name: "Falabella Colombia",
            description: "Tienda por departamentos con sección de tecnología y opciones de crédito empresarial",
            email: "empresas@falabella.com.co",
            website: "https://www.falabella.com.co",
            country: "CO",
            scope: "NATIONAL",
            categories: ["Tecnología", "Oficina", "Electrónicos"],
            confidence: 0.85,
        },
        {
            name: "Amazon Business",
            description: "Marketplace internacional con millones de productos y envío a Colombia",
            email: "business@amazon.com",
            website: "https://www.amazon.com",
            country: "US",
            scope: "INTERNATIONAL",
            categories: ["Tecnología", "Industrial", "Todo"],
            confidence: 0.90,
        },
        {
            name: "Dell Colombia Empresas",
            description: "Venta directa del fabricante con configuraciones personalizadas y soporte empresarial",
            email: "ventas_empresas@dell.com",
            phone: "+57 1 800 518 1754",
            website: "https://www.dell.com/co",
            country: "CO",
            scope: "NATIONAL",
            categories: ["Computadores", "Servidores", "Tecnología"],
            confidence: 0.92,
        },
        {
            name: "Alibaba.com",
            description: "Plataforma B2B para compras al por mayor directamente de fabricantes",
            email: "import@alibaba.com",
            website: "https://www.alibaba.com",
            country: "CN",
            scope: "INTERNATIONAL",
            categories: ["Mayorista", "Industrial", "Tecnología"],
            confidence: 0.82,
        },
        {
            name: "Facebook Marketplace",
            description: "Marketplace local con vendedores independientes y negocios pequeños",
            email: "marketplace@facebook.com",
            website: "https://www.facebook.com/marketplace",
            country: "CO",
            scope: "LOCAL",
            categories: ["Usado", "Tecnología", "Todo"],
            confidence: 0.70,
        },
    ];

    // Filter by scope if needed
    if (scope !== "ALL") {
        return demoSuppliers.filter((s) => {
            if (scope === "LOCAL") return s.country === country;
            if (scope === "NATIONAL") return s.country === country;
            if (scope === "INTERNATIONAL") return s.country !== country;
            return true;
        });
    }

    return demoSuppliers;
}

/**
 * Generates a personalized quote request email
 */
export async function generateQuoteRequestEmail(
    supplierName: string,
    companyName: string,
    items: Array<{ productName: string; quantity: number; unit?: string; specifications?: string }>,
    locale: string = "es"
): Promise<{ subject: string; body: string }> {
    if (!process.env.OPENAI_API_KEY) {
        // Return template email without AI
        return getTemplateEmail(supplierName, companyName, items, locale);
    }

    try {
        const itemsList = items
            .map((item) => `- ${item.productName}: ${item.quantity} ${item.unit || "unidades"}`)
            .join("\n");

        const languageMap: Record<string, string> = {
            es: "Spanish",
            en: "English",
            pt: "Portuguese",
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a professional procurement assistant. Write a formal but friendly quote request email in ${languageMap[locale] || "Spanish"}.

The email should:
1. Be professional and clear
2. Introduce the company requesting quotes
3. List the products needed
4. Request pricing, delivery times, and payment terms
5. Provide contact information
6. Be concise but complete

Respond in JSON format:
{
  "subject": "Email subject line",
  "body": "Full email body"
}`,
                },
                {
                    role: "user",
                    content: `Write a quote request email to "${supplierName}" from "${companyName}".

Products needed:
${itemsList}`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content || "{}");
    } catch (error) {
        console.error("Error generating email:", error);
        return getTemplateEmail(supplierName, companyName, items, locale);
    }
}

function getTemplateEmail(
    supplierName: string,
    companyName: string,
    items: Array<{ productName: string; quantity: number; unit?: string }>,
    locale: string
): { subject: string; body: string } {
    const itemsList = items
        .map((item) => `• ${item.productName}: ${item.quantity} ${item.unit || "unidades"}`)
        .join("\n");

    if (locale === "en") {
        return {
            subject: `Quote Request from ${companyName}`,
            body: `Dear ${supplierName},

We are ${companyName} and we are interested in receiving a quote for the following products:

${itemsList}

Please provide us with:
- Unit and total prices
- Estimated delivery time
- Payment terms
- Product warranty

We look forward to your response.

Best regards,
${companyName}`,
        };
    }

    if (locale === "pt") {
        return {
            subject: `Solicitação de Cotação - ${companyName}`,
            body: `Prezado(a) ${supplierName},

Somos a ${companyName} e estamos interessados em receber uma cotação para os seguintes produtos:

${itemsList}

Por favor, forneça-nos:
- Preços unitários e totais
- Prazo estimado de entrega
- Condições de pagamento
- Garantia dos produtos

Aguardamos sua resposta.

Atenciosamente,
${companyName}`,
        };
    }

    // Default: Spanish
    return {
        subject: `Solicitud de Cotización - ${companyName}`,
        body: `Estimado(a) ${supplierName},

Somos ${companyName} y estamos interesados en recibir una cotización para los siguientes productos:

${itemsList}

Por favor, indíquenos:
- Precios unitarios y totales
- Tiempo estimado de entrega
- Condiciones de pago
- Garantía de los productos

Quedamos atentos a su respuesta.

Cordialmente,
${companyName}`,
    };
}
