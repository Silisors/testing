"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Star, Tag, Store, ExternalLink, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { ProductOffer } from "@/lib/search/types";

export function UserHome() {
    const t = useTranslations();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<ProductOffer[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchSummary, setSearchSummary] = useState("");

    // We can add a location selector later, defaulting to Bogota for now as per requirements
    const [location, setLocation] = useState("Bogota, Colombia");

    const [visibleCount, setVisibleCount] = useState(9); // Pagination mock

    const performSearch = async (query: string) => {
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        setFilteredProducts([]);
        setVisibleCount(9); // Reset pagination
        setSearchSummary(`Buscando ofertas para: "${query}"...`);

        try {
            const response = await fetch("/api/products/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: query, location })
            });

            const data = await response.json();

            if (data.success && data.data) {
                setFilteredProducts(data.data.offers || []);
                setSearchSummary(data.data.summary || "Resultados encontrados:");
            } else {
                setSearchSummary("Hubo un problema al buscar las ofertas. Intenta nuevamente.");
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchSummary("Error de conexión. Por favor verifica tu internet.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = () => {
        performSearch(searchQuery);
    };

    // Initial search: Parallel execution for volume
    useEffect(() => {
        if (hasSearched || filteredProducts.length > 0) return;

        const performParallelSearch = async () => {
            setIsSearching(true);
            setHasSearched(true);
            setSearchSummary("Explorando múltiples categorías para encontrar las mejores ofertas...");

            // Define distinctive categories to force variety
            const categories = [
                "mejores ofertas celulares computadores tecnologia colombia",
                "promociones ropa zapatillas moda colombia",
                "descuentos electrodomesticos hogar cocina colombia"
            ];

            // Helper to fetch valid unique offers
            const fetchCategory = async (query: string) => {
                try {
                    const res = await fetch("/api/products/search", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query, location })
                    });
                    const data = await res.json();
                    if (data.success && data.data?.offers) {
                        return data.data.offers;
                    }
                } catch (e) { console.error(e); }
                return [];
            };

            // Execute in parallel
            const results = await Promise.all(categories.map(cat => fetchCategory(cat)));

            // Merge and dedup
            const allOffers = results.flat();
            const uniqueOffers = Array.from(new Map(allOffers.map(item => [item.title + item.price, item])).values());

            // Randomize order slightly to mix categories
            const shuffled = uniqueOffers.sort(() => Math.random() - 0.5);

            setFilteredProducts(shuffled);

            if (shuffled.length > 0) {
                setSearchSummary(`¡Encontramos ${shuffled.length} ofertas destacadas en varias categorías!`);
            } else {
                setSearchSummary("No encontramos ofertas específicas, pero mira estas tendencias.");
            }

            setIsSearching(false);
        };

        performParallelSearch();
    }, []);

    const loadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
            {/* Header with Blue/Black Gradient */}
            <header className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-black via-slate-900 to-blue-900 text-white shadow-xl sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                        <Sparkles className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                            ComprasIA
                        </h1>
                        <span className="text-[10px] text-blue-200 font-medium px-1.5 py-0.5 bg-blue-950/50 rounded-full border border-blue-500/30">BETA</span>
                    </div>
                </div>
            </header>

            <section className="container mx-auto px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-2xl text-center mb-10 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-slate-900 dark:text-slate-100">
                        Encuentra la <span className="text-blue-700 dark:text-blue-500 relative inline-block">
                            Mejor Oferta
                            <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500/20 rounded-full"></span>
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        El motor de búsqueda inteligente para Colombia.
                    </p>

                    {/* Premium Input Field */}
                    <div className="relative flex items-center w-full max-w-lg mx-auto mt-8 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative flex items-center w-full bg-white dark:bg-slate-900 rounded-full shadow-2xl">
                            <Search className="absolute left-5 w-5 h-5 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Ej: iPhone 15 Pro Max, Televisor..."
                                className="pl-12 pr-14 h-14 w-full rounded-full border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                            />
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching}
                                size="icon"
                                className="absolute right-2 h-10 w-10 rounded-full bg-blue-700 hover:bg-blue-600 shadow-lg text-white transition-all hover:scale-105"
                            >
                                {isSearching ? <Sparkles className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-3">
                        <MapPin className="w-3 h-3" />
                        <span>Buscando en: <span className="font-semibold text-blue-700 dark:text-blue-400">{location}</span></span>
                    </div>
                </div>

                <div className="w-full max-w-7xl">
                    {searchSummary && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{searchSummary}</p>
                        </div>
                    )}

                    {isSearching ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                                {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                                    <Card key={product.id || idx} className={`group overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white dark:bg-slate-900 ${product.isBestOffer ? 'border-yellow-500 shadow-lg ring-1 ring-yellow-500/30' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                                        <div className="aspect-video relative overflow-hidden bg-white">
                                            <img
                                                src={product.image || "https://placehold.co/600x400?text=Ver+en+Tienda"}
                                                alt={product.title}
                                                className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400?text=Sin+Imagen"; }}
                                            />
                                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                                {product.condition && (
                                                    <Badge className={`${product.condition.toLowerCase().includes('nuevo') ? 'bg-blue-600' : 'bg-orange-500'} text-white shadow-md border-0`}>
                                                        {product.condition}
                                                    </Badge>
                                                )}
                                            </div>
                                            {product.isBestOffer && (
                                                <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md z-10 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" /> MEJOR OPCIÓN
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold leading-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]" title={product.title}>
                                                    {product.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                                <Store className="w-3 h-3" />
                                                <span className="font-medium">{product.store}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 space-y-3">
                                            <div className="flex flex-col mt-1">
                                                {product.price === -1 ? (
                                                    <span className="text-lg font-bold text-blue-600">Consultar Precio</span>
                                                ) : (
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xs text-slate-400 font-medium">Aprox</span>
                                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                                            $ {new Intl.NumberFormat('es-CO').format(product.price)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Metadata Comparison Section */}
                                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
                                                {product.warranty ? (
                                                    <div className="flex items-center gap-1.5" title="Garantía">
                                                        <Tag className="w-3 h-3 text-blue-500" />
                                                        <span className="line-clamp-1">{product.warranty}</span>
                                                    </div>
                                                ) : <div />}

                                                {product.paymentOptions && product.paymentOptions.length > 0 && (
                                                    <div className="flex items-center gap-1.5 justify-end" title="Medios de Pago">
                                                        <CreditCard className="w-3 h-3 text-purple-500" />
                                                        <span className="line-clamp-1">Crédito disp.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Button asChild className={`w-full gap-2 ${product.isBestOffer ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`} variant={product.isBestOffer ? "default" : "secondary"}>
                                                <a href={product.url || '#'} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4" />
                                                    {product.price === -1 ? "Consultar" : "Ver Oferta"}
                                                </a>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {visibleCount < filteredProducts.length && (
                                <div className="mt-8 text-center pb-10">
                                    <Button onClick={loadMore} variant="outline" size="lg" className="min-w-[200px] gap-2">
                                        Cargar más resultados
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Search className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No se encontraron ofertas recientes</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                Intenta buscando un producto más general o verifica la ortografía.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
