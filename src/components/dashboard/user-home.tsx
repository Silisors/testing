"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Truck, CheckCircle2, Star, Tag, ShoppingCart, ExternalLink, Store } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react"; // Added useState import

export function UserHome() {
    const t = useTranslations();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Mock products data
    const featuredProducts = [
        {
            id: 1,
            title: "Laptop Pro X1 - Intel Core i7 16GB RAM",
            price: 4500000,
            currency: "COP",
            brand: "Apple",
            store: "Alkosto",
            warranty: "24 meses",
            rating: 4.8,
            reviews: 124,
            delivery: "2-3 dias",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
            tags: ["Mejor Oferta", "Envío Gratis"]
        },
        {
            id: 2,
            title: "Monitor 27' 4K Ultra HD IPS",
            price: 1200000,
            currency: "COP",
            brand: "Samsung",
            store: "Falabella",
            warranty: "12 meses",
            rating: 4.5,
            reviews: 89,
            delivery: "3-5 dias",
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
            tags: ["Popular"]
        },
        {
            id: 3,
            title: "Silla Ergonómica Ejecutiva Mesh",
            price: 850000,
            currency: "COP",
            brand: "Herman Miller",
            store: "Office Depot",
            warranty: "36 meses",
            rating: 4.9,
            reviews: 215,
            delivery: "1-2 dias",
            image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
            tags: ["Entrega Inmediata", "Ergonómico"]
        },
        {
            id: 4,
            title: "Kit Teclado + Mouse Inalámbrico Pro",
            price: 180000,
            currency: "COP",
            brand: "Logitech",
            store: "Panamericana",
            warranty: "12 meses",
            rating: 4.6,
            reviews: 56,
            delivery: "2-4 dias",
            image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=800&q=80",
            tags: ["Descuento 15%"]
        }
    ];

    // Debounce search effect
    useEffect(() => {
        if (!searchQuery) {
            setHasSearched(false);
            setFilteredProducts([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            const lowerQuery = searchQuery.toLowerCase();
            const results = featuredProducts.filter(product =>
                product.title.toLowerCase().includes(lowerQuery) ||
                product.brand.toLowerCase().includes(lowerQuery) ||
                product.store.toLowerCase().includes(lowerQuery) ||
                product.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
            );
            setFilteredProducts(results);
            setHasSearched(true);
            setIsSearching(false);
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Manual search trigger (optional, now mostly visual)
    const handleSearch = () => {
        // Validation logic or immediate search if desired (currently redundant with effect but harmless)
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Optional: Could trigger immediate search on Enter instead of waiting
    };

    const displayProducts = hasSearched ? filteredProducts : featuredProducts;

    return (
        <div className="space-y-10">
            {/* AI Search Section */}
            <section className="relative py-16 px-4 md:px-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative max-w-2xl mx-auto space-y-6">
                    <Badge variant="secondary" className="mb-2 gap-1 bg-background/80 backdrop-blur-sm border-primary/20 text-primary">
                        <Sparkles className="w-3 h-3" />
                        AI-Powered Shopping
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Encuentra tus productos con IA
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                        Describe lo que buscas y nuestra inteligencia artificial encontrará las mejores opciones para ti.
                    </p>

                    <div className="relative max-w-xl mx-auto mt-8 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-background rounded-xl shadow-xl border">
                            <Sparkles className="w-5 h-5 text-primary ml-4" />
                            <Input
                                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-lg bg-transparent"
                                placeholder="Ej: Necesito 20 sillas ergonómicas y 5 escritorios..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button
                                className="m-1.5 h-11 px-6 rounded-lg gap-2"
                                size="lg"
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                {isSearching ? "Buscando..." : "Buscar"}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products PLP */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {hasSearched ? `Resultados para "${searchQuery}"` : "Productos Destacados"}
                    </h2>
                    {!hasSearched && <Button variant="ghost">Ver todos</Button>}
                    {hasSearched && <Button variant="ghost" onClick={() => { setHasSearched(false); setSearchQuery(""); }}>Limpiar búsqueda</Button>}
                </div>

                {isSearching ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="overflow-hidden border-2 h-[400px] animate-pulse">
                                <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                                <CardHeader className="space-y-2 p-4">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                                </CardHeader>
                                <CardContent className="space-y-2 p-4 pt-0">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : displayProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                        {displayProducts.map((product) => (
                            <Card key={product.id} className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                                <div className="aspect-square relative overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                                        {product.tags.map(tag => (
                                            <Badge key={tag} className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm hover:bg-background">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <CardHeader className="p-4 pb-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                                            {product.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-medium text-foreground">{product.rating}</span>
                                        <span className="text-muted-foreground">({product.reviews})</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-muted-foreground">{product.currency}</span>
                                        <span className="text-xl font-bold">
                                            {new Intl.NumberFormat('es-CO').format(product.price)}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 flex-shrink-0" />
                                            <span>Marca: <span className="font-medium text-foreground">{product.brand}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 flex-shrink-0" />
                                            <span>Tienda: <span className="font-medium text-foreground">{product.store}</span></span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Link href={`/home/products/${product.id}`} className="w-full">
                                        <Button className="w-full gap-2 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <ExternalLink className="w-4 h-4" />
                                            Ver detalle
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No encontramos lo que buscas</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            Intenta con términos más generales o revisa si escribiste bien el nombre del producto.
                        </p>
                        <Button variant="outline" onClick={() => { setHasSearched(false); setSearchQuery(""); }}>
                            Ver todos los productos
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}
