"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Building2,
    Search,
    Mail,
    Globe,
    MapPin,
    Star,
    Loader2,
    ExternalLink
} from "lucide-react";

interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    website: string | null;
    country: string;
    categories: string[];
    rating: number | null;
    _count?: {
        quotes: number;
    };
}

export default function SuppliersPage() {
    const t = useTranslations();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch("/api/suppliers");
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{t("suppliers.title")}</h1>
                    <p className="text-muted-foreground">
                        {t("suppliers.subtitle")}
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar proveedores..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Proveedores</p>
                                <p className="text-xl font-bold">{suppliers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <Star className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Con Cotizaciones</p>
                                <p className="text-xl font-bold">
                                    {suppliers.filter(s => s._count && s._count.quotes > 0).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <MapPin className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Países</p>
                                <p className="text-xl font-bold">
                                    {new Set(suppliers.map(s => s.country)).size}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Suppliers Grid */}
            {filteredSuppliers.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            {searchQuery ? "No se encontraron proveedores" : "Sin proveedores aún"}
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            {searchQuery
                                ? "Intenta con otro término de búsqueda"
                                : "Los proveedores aparecerán aquí cuando realices búsquedas con IA en tus licitaciones"
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSuppliers.map((supplier) => (
                        <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {supplier.country}
                                        </CardDescription>
                                    </div>
                                    {supplier.rating && (
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900">
                                            <Star className="w-3 h-3 text-yellow-600 dark:text-yellow-400 fill-current" />
                                            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                                                {supplier.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Contact Info */}
                                <div className="space-y-2 text-sm">
                                    <a
                                        href={`mailto:${supplier.email}`}
                                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Mail className="w-4 h-4" />
                                        {supplier.email}
                                    </a>
                                    {supplier.website && (
                                        <a
                                            href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Globe className="w-4 h-4" />
                                            {supplier.website.replace(/^https?:\/\//, '')}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                {/* Categories */}
                                {supplier.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-2">
                                        {supplier.categories.slice(0, 3).map((cat, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                        {supplier.categories.length > 3 && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                                                +{supplier.categories.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Quotes count */}
                                {supplier._count && supplier._count.quotes > 0 && (
                                    <div className="pt-2 border-t">
                                        <span className="text-sm text-muted-foreground">
                                            {supplier._count.quotes} cotización{supplier._count.quotes !== 1 ? 'es' : ''} recibida{supplier._count.quotes !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <a href={`mailto:${supplier.email}`}>
                                            <Mail className="w-4 h-4 mr-1" />
                                            Contactar
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
