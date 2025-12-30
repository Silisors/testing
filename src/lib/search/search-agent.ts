import OpenAI from "openai";
import { ProductOffer, SearchAgentResult } from "./types";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class SearchAgent {
    private static TAVILY_API_KEY = process.env.TAVILY_API_KEY;

    /**
     * Main entry point: Interprets the user query and finds the best deals.
     */
    /**
     * Main entry point: Interprets the user query and finds the best deals.
     */
    static async findDeals(userQuery: string, location: string = "Bogota, Colombia"): Promise<SearchAgentResult> {
        try {
            console.log(`[SearchAgent] Processing query: "${userQuery}"`);

            // STRATEGY: Aggressive Multi-Query Expansion to maximize results
            // We split the user's intent into 3 distinct search angles to force the engine to dig deeper.
            const variations = [
                `${userQuery} comprar online precio colombia`,        // General retail
                `${userQuery} oferta homecenter alkosto exito`,       // Big box stores
                `${userQuery} mercado libre linio colombia`,          // Marketplaces
                `${userQuery} precio instagram facebook marketplace colombia` // Social Media (NEW)
            ];

            // Execute 3 parallel searches. This triples the raw data pool.
            const searchPromises = variations.map(q => this.performWebSearch(q, userQuery));
            const searchResults = await Promise.all(searchPromises);

            // Merge raw Tavily results
            let aggregateResults: any[] = [];
            let aggregateImages: string[] = [];

            searchResults.forEach(res => {
                if (res.results) aggregateResults.push(...res.results);
                if (res.images) aggregateImages.push(...res.images);
            });

            // Deduplicate by URL to avoid showing the same link 3 times
            const uniqueResults = Array.from(new Map(aggregateResults.map(item => [item.url, item])).values());

            console.log(`[SearchAgent] Total raw items found (unique): ${uniqueResults.length}`);

            // Synthesize results using AI with the massive pool
            let offers = await this.synthesizeOffers(userQuery, { results: uniqueResults, images: aggregateImages });

            // 4. FALLBACK LOGIC (Discovery Only)
            const isDiscoveryMode = userQuery.toLowerCase().includes("sorprendeme") ||
                userQuery.toLowerCase().includes("ofertas") ||
                userQuery.toLowerCase().includes("mejores");

            if (offers.length < 3 && isDiscoveryMode) {
                console.log("[SearchAgent] Low results in discovery mode. Injecting Trending Products.");
                const trending = this.getTrendingProducts();
                offers = [...offers, ...trending];
            }

            return {
                queryUsed: userQuery,
                offers: offers,
                summary: offers.length > 0
                    ? `Encontré estas ofertas para "${userQuery}".`
                    : `No encontramos ofertas específicas para "${userQuery}".`
            };
        } catch (error) {
            console.error("[SearchAgent] Error:", error);
            // Final safety net
            return {
                queryUsed: userQuery,
                offers: [],
                summary: "Hubo un error al procesar tu búsqueda."
            };
        }
    }

    private static async generateSearchTerms(query: string, location: string): Promise<string> {
        // If query is specific (long), pass it through with location optimization
        if (query.split(" ").length > 4) {
            return `${query} comprar online precio`;
        }

        // Dynamic discovery for short "magic" queries
        if (query.toLowerCase().includes("sorprendeme") || query.toLowerCase().includes("ofertas del dia")) {
            // ... (keep existing smart logic if needed, but the loop uses specific long queries now)
            return "ofertas tecnologia ropa hogar colombia";
        }

        return `${query} tienda online precio colombia`;
    }

    private static async performWebSearch(query: string, originalUserQuery: string): Promise<{ results: any[], images: string[] }> {
        if (!this.TAVILY_API_KEY) return { results: [], images: [] };

        try {
            console.log(`[SearchAgent] Searching Web for: "${query}"`);

            // For broad discovery ("sorprendeme"), we do NOT restrict domains.
            // For specific products, we might want to prioritize trusted stores, but let's trust Tavily ranking for now.
            // We removed the strict 'include_domains' logic to allow "many stores" as requested.

            const response = await fetch("https://api.tavily.com/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    api_key: this.TAVILY_API_KEY,
                    query: query,
                    search_depth: "basic", // Basic is faster for volume. Advanced is too slow for 4x parallel.
                    include_images: true,
                    include_answer: false,
                    max_results: 80, // MAXIMUM SAFE LIMIT per query (4x80 = 320 items)
                    // include_domains: removed to allow broader discovery
                }),
            });

            const data = await response.json();
            return { results: data.results || [], images: data.images || [] };

        } catch (error) {
            console.error("[SearchAgent] Web search failed:", error);
            return { results: [], images: [] };
        }
    }

    private static async synthesizeOffers(originalQuery: string, searchData: { results: any[], images: string[] }): Promise<ProductOffer[]> {
        const { results, images } = searchData;
        if (!results || results.length === 0) return [];

        try {
            const prompt = `
                Act as a shopping assistant for Colombia.
                User wants: "${originalQuery}".
                
                Input Data: ${JSON.stringify(results.slice(0, 200))}
                
                Task: Extract valid CONSUMER products.
                
                STRICT RULES:
                1. EXTRACT AS MANY AS POSSIBLE (Target: 50+ items).
                2. IGNORE "Login Pages", "Blog Posts", "News Articles".
                3. INCLUDE Social Media posts (Instagram/Facebook) if they look like product offers.
                2. IGNORE "Real Estate" (apartments), "Vehicles" (cars), "Services".
                3. INCLUDE "Industrial Tools", "Construction Materials", "Furniture", "Electronics".
                4. Extract Price in COP. If implied, estimate.
                5. Output JSON: { "offers": [ { "title": "...", "price": 100000, "store": "...", "url": "...", "image": "..." } ] }
            `;

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "system", content: "You extract shopping data. JSON only." }, { role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });

            const content = response.choices[0]?.message?.content;
            if (!content) return [];

            const parsed = JSON.parse(content);
            const rawOffers = parsed.offers || [];

            return rawOffers.map((o: any, idx: number) => ({
                id: Math.random().toString(36).substring(7),
                title: o.title,
                price: typeof o.price === 'number' ? o.price : parseInt(o.price?.replace(/\D/g, '') || '0'),
                currency: "COP",
                image: o.image || images[idx % images.length] || "https://placehold.co/600x400?text=Oferta",
                store: o.store || "Tienda Online",
                url: o.url || "#",
                isBestOffer: idx === 0,
                tags: ["Destacado"],
                condition: "Nuevo"
            })).filter((o: any) => o.price > 10000); // Filter out tiny prices/errors

        } catch (error) {
            return [];
        }
    }

    /**
     * "Safe Mode" Fallback: Returns high-quality, real everyday products.
     * Used when the live search fails or returns garbage.
     */
    private static getTrendingProducts(): ProductOffer[] {
        // Expanded pool of ~20 items to ensure variety even when falling back
        const pool = [
            {
                id: "t1", title: "iPhone 15 128GB - Apple Colombia", price: 3599000, currency: "COP", store: "Mac Center",
                url: "https://mac-center.com/", image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692925262335",
                isBestOffer: true, tags: ["Tecnología"], condition: "Nuevo"
            },
            {
                id: "t2", title: "Air Fryer Imusa 4.2 Litros", price: 289900, currency: "COP", store: "Exito",
                url: "https://www.exito.com/", image: "https://grupoexito.vtexassets.com/arquivos/ids/20696773/Freidora-De-Aire-IMUSA-Easy-Fry-4-2L-Negra-3253702.jpg?v=638407425686300000",
                isBestOffer: false, tags: ["Hogar"], condition: "Nuevo"
            },
            {
                id: "t3", title: "Televisor Samsung 55' Crystal UHD 4K", price: 1899900, currency: "COP", store: "Alkosto",
                url: "https://www.alkosto.com/", image: "https://images.samsung.com/is/image/samsung/p6pim/co/un55au7000kxlx/gallery/co-uhd-au7000-un55au7000kxlx-530472099?$684_547_PNG$",
                isBestOffer: false, tags: ["Entretenimiento"], condition: "Nuevo"
            },
            {
                id: "t4", title: "Tenis Nike Air Force 1 '07", price: 549950, currency: "COP", store: "Nike Colombia",
                url: "https://www.nike.com.co/", image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-zapatillas-GjGXSP.png",
                isBestOffer: false, tags: ["Moda"], condition: "Nuevo"
            },
            {
                id: "t5", title: "Lavadora Samsung Carga Superior 18kg", price: 1650000, currency: "COP", store: "Falabella",
                url: "https://www.falabella.com.co/", image: "https://falabella.scene7.com/is/image/FalabellaCO/16543163_1?wid=800&hei=800&qlt=70",
                isBestOffer: false, tags: ["Hogar"], condition: "Nuevo"
            },
            {
                id: "t6", title: "Xiaomi Redmi Note 13", price: 899900, currency: "COP", store: "MercadoLibre",
                url: "https://www.mercadolibre.com.co/", image: "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1705307767.11328637.png",
                isBestOffer: false, tags: ["Calidad Precio"], condition: "Nuevo"
            },
            // NEW ITEMS
            {
                id: "t7", title: "Portátil ASUS Vivobook 15", price: 2100000, currency: "COP", store: "Ktronix",
                url: "https://www.ktronix.com/", image: "https://m.media-amazon.com/images/I/71VjM5LOeYL._AC_SL1500_.jpg",
                isBestOffer: false, tags: ["Computación"], condition: "Nuevo"
            },
            {
                id: "t8", title: "Cafetera Oster Prima Latte", price: 750000, currency: "COP", store: "HomeCenter",
                url: "https://www.homecenter.com.co/", image: "https://m.media-amazon.com/images/I/61+y5w22mPL._AC_SL1500_.jpg",
                isBestOffer: false, tags: ["Cocina"], condition: "Nuevo"
            },
            {
                id: "t9", title: "Audífonos Sony WH-1000XM5", price: 1499900, currency: "COP", store: "Sony Store",
                url: "https://store.sony.com.co/", image: "https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_SL1000_.jpg",
                isBestOffer: false, tags: ["Audio"], condition: "Nuevo"
            },
            {
                id: "t10", title: "Tenis Adidas Ultraboost Light", price: 699900, currency: "COP", store: "Adidas",
                url: "https://www.adidas.co/", image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a0889953q182419a9e32af4d0097f4c7_9366/Tenis_Ultraboost_Light_Negro_HQ6339_01_standard.jpg",
                isBestOffer: false, tags: ["Deportes"], condition: "Nuevo"
            },
            {
                id: "t11", title: "Silla Gamer Ergonómica", price: 450000, currency: "COP", store: "MercadoLibre",
                url: "#", image: "https://m.media-amazon.com/images/I/61HEq-2mTRL._AC_SL1500_.jpg",
                isBestOffer: false, tags: ["Oficina"], condition: "Nuevo"
            },
            {
                id: "t12", title: "Control Xbox Series X Carbon Black", price: 289000, currency: "COP", store: "Alkosto",
                url: "#", image: "https://m.media-amazon.com/images/I/61z3-0-xInL._AC_SL1500_.jpg",
                isBestOffer: false, tags: ["Gaming"], condition: "Nuevo"
            }
        ];

        // Shuffle and pick 6 distinct items each time
        return pool.sort(() => Math.random() - 0.5).slice(0, 6);
    }
}
