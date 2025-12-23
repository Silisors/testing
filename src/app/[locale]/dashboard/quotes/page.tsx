"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Building2,
    Calendar,
    DollarSign,
    Loader2,
    Eye,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";

interface Quote {
    id: string;
    totalPrice: number;
    currency: string;
    deliveryDays: number | null;
    warranty: string | null;
    paymentTerms: string | null;
    status: string;
    createdAt: string;
    supplier: {
        id: string;
        name: string;
        country: string;
    };
    tender: {
        id: string;
        title: string;
    };
    items: Array<{
        id: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
}

export default function QuotesPage({ params }: { params: { locale: string } }) {
    const t = useTranslations();
    const router = useRouter();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const response = await fetch("/api/quotes");
            if (response.ok) {
                const data = await response.json();
                setQuotes(data);
            }
        } catch (error) {
            console.error("Error fetching quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "RECEIVED": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
            case "ANALYZING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
            case "ACCEPTED": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
            case "REJECTED": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "RECEIVED": return <Clock className="w-4 h-4" />;
            case "ANALYZING": return <Clock className="w-4 h-4" />;
            case "ACCEPTED": return <CheckCircle2 className="w-4 h-4" />;
            case "REJECTED": return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "RECEIVED": return "Recibida";
            case "ANALYZING": return "Analizando";
            case "ACCEPTED": return "Aceptada";
            case "REJECTED": return "Rechazada";
            default: return status;
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency || 'COP',
            maximumFractionDigits: 0,
        }).format(amount);
    };

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
            <div>
                <h1 className="text-2xl font-bold">{t("quotes.title")}</h1>
                <p className="text-muted-foreground">
                    {t("quotes.subtitle")}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-xl font-bold">{quotes.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Recibidas</p>
                                <p className="text-xl font-bold">
                                    {quotes.filter(q => q.status === "RECEIVED").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Aceptadas</p>
                                <p className="text-xl font-bold">
                                    {quotes.filter(q => q.status === "ACCEPTED").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10">
                                <XCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Rechazadas</p>
                                <p className="text-xl font-bold">
                                    {quotes.filter(q => q.status === "REJECTED").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quotes List */}
            {quotes.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Sin cotizaciones aún</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Las cotizaciones aparecerán aquí cuando ejecutes &quot;Buscar Proveedores con IA&quot; en una licitación
                        </p>
                        <Button
                            variant="gradient"
                            className="mt-4"
                            onClick={() => router.push(`/${params.locale}/dashboard/tenders/new`)}
                        >
                            Crear Licitación
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {quotes.map((quote) => (
                        <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{quote.tender.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Building2 className="w-4 h-4" />
                                                {quote.supplier.name}
                                                <span className="text-muted-foreground/50">•</span>
                                                {quote.supplier.country}
                                            </div>
                                            {/* Show items summary */}
                                            <div className="text-xs text-muted-foreground mt-2">
                                                {quote.items.length} producto(s): {quote.items.map(i => i.productName).join(", ")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-lg font-bold text-primary">
                                                <DollarSign className="w-4 h-4" />
                                                {formatCurrency(quote.totalPrice, quote.currency)}
                                            </div>
                                            {quote.deliveryDays && (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    Entrega en {quote.deliveryDays} días
                                                </div>
                                            )}
                                        </div>

                                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                                            {getStatusIcon(quote.status)}
                                            {getStatusLabel(quote.status)}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/${params.locale}/dashboard/quotes/${quote.id}`)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Ver
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
