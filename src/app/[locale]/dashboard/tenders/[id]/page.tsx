"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SupplierSearchProgress } from "@/components/search/supplier-search-progress";
import {
    ArrowLeft,
    Search,
    Mail,
    BarChart3,
    Loader2,
    Package,
    Calendar,
    Building2,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";

interface TenderItem {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    specifications: string;
}

interface SupplierSearch {
    id: string;
    aiResponse: string | null;
    resultsCount: number;
    createdAt: string;
}

interface FoundSupplier {
    name: string;
    email: string;
    phone?: string;
    website?: string;
    country: string;
    categories: string[];
    relevanceScore?: number;
}

interface Tender {
    id: string;
    title: string;
    description: string;
    status: string;
    supplierScope: string;
    deadline: string | null;
    createdAt: string;
    items: TenderItem[];
    supplierSearches?: SupplierSearch[];
    _count?: {
        quotes: number;
    };
}

export default function TenderDetailPage({ params }: { params: { id: string; locale: string } }) {
    const t = useTranslations();
    const router = useRouter();
    const [tender, setTender] = useState<Tender | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSearchProgress, setShowSearchProgress] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTender = useCallback(async () => {
        try {
            const response = await fetch(`/api/tenders/${params.id}`);
            if (!response.ok) {
                throw new Error("Tender not found");
            }
            const data = await response.json();
            setTender(data);
        } catch (err) {
            setError("No se pudo cargar la licitación");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchTender();
    }, [fetchTender]);

    const handleSearchSuppliers = () => {
        setShowSearchProgress(true);
    };

    const handleSearchComplete = () => {
        setShowSearchProgress(false);
        fetchTender(); // Refresh data
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DRAFT": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
            case "SEARCHING": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
            case "QUOTING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
            case "ANALYZING": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
            case "COMPLETED": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
            case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DRAFT": return <Clock className="w-4 h-4" />;
            case "SEARCHING": return <Search className="w-4 h-4" />;
            case "QUOTING": return <Mail className="w-4 h-4" />;
            case "ANALYZING": return <BarChart3 className="w-4 h-4" />;
            case "COMPLETED": return <CheckCircle2 className="w-4 h-4" />;
            case "CANCELLED": return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getScopeLabel = (scope: string) => {
        switch (scope) {
            case "LOCAL": return "Local";
            case "NATIONAL": return "Nacional";
            case "INTERNATIONAL": return "Internacional";
            case "ALL": return "Todos";
            default: return scope;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !tender) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-lg text-muted-foreground">{error || "Licitación no encontrada"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* Search Progress Modal */}
            <SupplierSearchProgress
                isOpen={showSearchProgress}
                onComplete={handleSearchComplete}
                tenderId={params.id}
                itemCount={tender.items.length}
            />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/${params.locale}/dashboard/tenders`)}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{tender.title}</h1>
                            <p className="text-muted-foreground">
                                Creada el {new Date(tender.createdAt).toLocaleDateString("es-ES")}
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(tender.status)}`}>
                        {getStatusIcon(tender.status)}
                        {tender.status}
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Productos</p>
                                    <p className="text-xl font-bold">{tender.items.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Building2 className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Alcance</p>
                                    <p className="text-xl font-bold">{getScopeLabel(tender.supplierScope)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <Calendar className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha límite</p>
                                    <p className="text-xl font-bold">
                                        {tender.deadline
                                            ? new Date(tender.deadline).toLocaleDateString("es-ES")
                                            : "Sin definir"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Description */}
                {tender.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Descripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{tender.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Productos y Servicios</CardTitle>
                        <CardDescription>
                            Lista de items incluidos en esta licitación
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {tender.items.map((item) => (
                                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h4 className="font-medium">{item.productName}</h4>
                                            {item.specifications && (
                                                <p className="text-sm text-muted-foreground">
                                                    {item.specifications}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium">{item.quantity}</span>
                                            <span className="text-muted-foreground ml-1">{item.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Found Suppliers */}
                {tender.supplierSearches && tender.supplierSearches.length > 0 && tender.supplierSearches[0].aiResponse && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                Proveedores Encontrados
                            </CardTitle>
                            <CardDescription>
                                Proveedores identificados por IA para esta licitación
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(() => {
                                    try {
                                        const suppliers: FoundSupplier[] = JSON.parse(tender.supplierSearches[0].aiResponse || '[]');
                                        return suppliers.map((supplier, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="font-semibold">{supplier.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{supplier.country}</p>
                                                    </div>
                                                    {supplier.relevanceScore && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                                            {Math.round(supplier.relevanceScore * 100)}% match
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3 space-y-2 text-sm">
                                                    {supplier.email && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Mail className="w-3 h-3" />
                                                            <a href={`mailto:${supplier.email}`} className="hover:text-primary">
                                                                {supplier.email}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {supplier.website && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Search className="w-3 h-3" />
                                                            <a
                                                                href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="hover:text-primary"
                                                            >
                                                                {supplier.website}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                {supplier.categories && supplier.categories.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-1">
                                                        {supplier.categories.slice(0, 3).map((cat, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                                                            >
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ));
                                    } catch {
                                        return (
                                            <p className="text-muted-foreground col-span-2">
                                                No se pudieron cargar los proveedores
                                            </p>
                                        );
                                    }
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones</CardTitle>
                        <CardDescription>
                            Inicia la búsqueda de proveedores o analiza las cotizaciones recibidas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                variant="gradient"
                                className="gap-2"
                                onClick={handleSearchSuppliers}
                                disabled={tender.status !== "DRAFT"}
                            >
                                <Search className="w-4 h-4" />
                                Buscar Proveedores con IA
                            </Button>

                            <Button
                                variant="outline"
                                className="gap-2"
                                disabled={tender.status === "DRAFT"}
                            >
                                <Mail className="w-4 h-4" />
                                Contactar Proveedores
                            </Button>

                            <Button
                                variant="outline"
                                className="gap-2"
                                disabled={tender.status !== "QUOTING" && tender.status !== "ANALYZING"}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Analizar Cotizaciones
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
