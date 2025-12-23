"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    FileText,
    Plus,
    Search,
    ChevronRight,
    Clock,
    Users,
    BarChart3,
} from "lucide-react";

interface Tender {
    id: string;
    title: string;
    description: string | null;
    status: string;
    supplierScope: string;
    deadline: string | null;
    createdAt: string;
    items: Array<{ id: string; productName: string }>;
    _count: { quotes: number };
}

const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SEARCHING: "bg-blue-100 text-blue-700",
    QUOTING: "bg-yellow-100 text-yellow-700",
    ANALYZING: "bg-purple-100 text-purple-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function TendersPage() {
    const t = useTranslations();
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchTenders();
    }, []);

    async function fetchTenders() {
        try {
            const response = await fetch("/api/tenders");
            if (response.ok) {
                const data = await response.json();
                setTenders(data);
            }
        } catch (error) {
            console.error("Error fetching tenders:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredTenders = tenders.filter((tender) =>
        tender.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{t("tenders.title")}</h1>
                    <p className="text-muted-foreground">
                        Gestiona tus licitaciones y solicitudes de compra
                    </p>
                </div>
                <Link href="/dashboard/tenders/new">
                    <Button variant="gradient" className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t("tenders.newTender")}
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder={`${t("common.search")}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Tenders List */}
            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                                <div className="h-4 bg-muted rounded w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredTenders.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            {searchQuery ? t("common.noResults") : "No hay licitaciones"}
                        </h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {searchQuery
                                ? "Intenta con otros términos de búsqueda"
                                : "Crea tu primera licitación para comenzar"}
                        </p>
                        {!searchQuery && (
                            <Link href="/dashboard/tenders/new">
                                <Button variant="gradient" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    {t("tenders.newTender")}
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredTenders.map((tender) => (
                        <Link key={tender.id} href={`/dashboard/tenders/${tender.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-medium truncate">
                                                    {tender.title}
                                                </h3>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[tender.status] || "bg-gray-100"
                                                        }`}
                                                >
                                                    {t(`tenders.status.${tender.status.toLowerCase()}`)}
                                                </span>
                                            </div>

                                            {tender.description && (
                                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                    {tender.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <FileText className="w-4 h-4" />
                                                    <span>{tender.items.length} productos</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BarChart3 className="w-4 h-4" />
                                                    <span>{tender._count.quotes} cotizaciones</span>
                                                </div>
                                                {tender.deadline && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {new Date(tender.deadline).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{t(`tenders.scope${tender.supplierScope.charAt(0) + tender.supplierScope.slice(1).toLowerCase()}`)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
