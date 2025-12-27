"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Truck, Star, Shield, ArrowLeft, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const t = useTranslations();
    const router = useRouter();

    // Mock data based on ID - in a real app this would fetch from API
    const product = {
        id: params.id,
        title: "Laptop Pro X1 - Intel Core i7 16GB RAM",
        price: 4500000,
        currency: "COP",
        brand: "TechBrand",
        description: "La Laptop Pro X1 está diseñada para profesionales que buscan rendimiento y portabilidad. Con su procesador Intel Core i7 de última generación, 16GB de RAM y almacenamiento SSD ultrarrápido, podrás manejar las tareas más exigentes con facilidad. Su pantalla Retina Display ofrece colores vibrantes y detalles nítidos, ideal para diseño gráfico y edición de video.",
        warranty: "24 meses directamente con el fabricante",
        rating: 4.8,
        reviews: 124,
        delivery: "2-3 días hábiles",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
        tags: ["Mejor Oferta", "Envío Gratis", "Garantía Extendida"],
        storeName: "TechStore Oficial",
        storeRating: 4.9,
        features: [
            "Procesador Intel Core i7 de 12ª generación",
            "16GB de memoria RAM DDR5",
            "512GB SSD NVMe",
            "Pantalla 14 pulgadas 2.8K OLED",
            "Batería de larga duración (hasta 12 horas)"
        ],
        pros: [
            "Excelente relación calidad-precio",
            "Servicio post-venta calificado con 5 estrellas",
            "Envío asegurado y seguimiento en tiempo real",
            "Política de devolución flexible de 30 días"
        ],
        cons: [
            "Stock limitado para este modelo",
            "El tiempo de entrega puede variar en zonas rurales"
        ]
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="gap-2 pl-0 hover:pl-2 transition-all"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a resultados
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Product Image Section */}
                <div className="space-y-6">
                    <div className="aspect-square relative rounded-3xl overflow-hidden border-2 shadow-lg bg-gray-50 flex items-center justify-center">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {product.tags.map(tag => (
                                <Badge key={tag} className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm py-1.5 px-3">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Info Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-500">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <span className="font-medium text-foreground">{product.rating}</span>
                            <span className="text-muted-foreground">({product.reviews} reseñas)</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {product.title}
                        </h1>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                                <Shield className="w-4 h-4" />
                                <span className="font-medium">Marca: {product.brand}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300">
                                <ExternalLink className="w-4 h-4" />
                                <span className="font-medium">Tienda: {product.storeName}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Truck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Entrega estimada: {product.delivery}</p>
                                <p className="text-xs text-muted-foreground">Envío asegurado por {product.storeName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl border space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">{product.currency}</span>
                            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                {new Intl.NumberFormat('es-CO').format(product.price)}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Precio incluye IVA. Garantía de {product.warranty}.
                        </p>

                        <div className="pt-2">
                            <Button size="lg" className="w-full gap-2 text-lg h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                <ExternalLink className="w-5 h-5" />
                                Ver en tienda {product.storeName}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-3">
                                Serás redirigido al sitio oficial del vendedor para completar tu compra.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Características Principales</h3>
                        <ul className="grid grid-cols-1 gap-2">
                            {product.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Pros and Cons Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <Card className="border-green-100 dark:border-green-900/50 bg-green-50/30 dark:bg-green-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <ThumbsUp className="w-5 h-5" />
                            Ventajas de comprar aquí
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {product.pros.map((pro, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5" />
                                    <span className="text-green-900 dark:text-green-100">{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <ThumbsDown className="w-5 h-5" />
                            Lo que debes saber (Desventajas)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {product.cons.map((con, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <Shield className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
                                    <span className="text-red-900 dark:text-red-100">{con}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Description Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Descripción del Producto</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {product.description}
                </p>
            </div>
        </div>
    );
}
