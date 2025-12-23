"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    Building2,
    Calendar,
    DollarSign,
    Package,
    Truck,
    Shield,
    CreditCard,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertCircle,
    Globe,
    Mail,
    FileText,
    ExternalLink,
    ShoppingCart
} from "lucide-react";

interface QuoteItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes: string | null;
}

interface Quote {
    id: string;
    totalPrice: number;
    currency: string;
    deliveryDays: number | null;
    warranty: string | null;
    paymentTerms: string | null;
    notes: string | null;
    sourceUrl: string | null;
    status: string;
    createdAt: string;
    items: QuoteItem[];
    supplier: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        website: string | null;
        country: string;
    };
    tender: {
        id: string;
        title: string;
        description: string | null;
    };
}

export default function QuoteDetailPage({ params }: { params: { id: string; locale: string } }) {
    const t = useTranslations();
    const router = useRouter();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchQuote = useCallback(async () => {
        try {
            const response = await fetch(`/api/quotes/${params.id}`);
            if (!response.ok) {
                throw new Error("Quote not found");
            }
            const data = await response.json();
            setQuote(data);
        } catch (err) {
            setError("No se pudo cargar la cotización");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchQuote();
    }, [fetchQuote]);

    const updateStatus = async (newStatus: string) => {
        if (!quote) return;
        setUpdating(true);
        try {
            const response = await fetch(`/api/quotes/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                fetchQuote();
            }
        } catch (error) {
            console.error("Error updating quote:", error);
        } finally {
            setUpdating(false);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency || 'COP',
            maximumFractionDigits: 0,
        }).format(amount);
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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "RECEIVED": return "Recibida";
            case "ANALYZING": return "Analizando";
            case "ACCEPTED": return "Aceptada";
            case "REJECTED": return "Rechazada";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !quote) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-lg text-muted-foreground">{error || "Cotización no encontrada"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/${params.locale}/dashboard/quotes`)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Cotización de {quote.supplier.name}</h1>
                        <p className="text-muted-foreground">
                            Para: {quote.tender.title}
                        </p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                    {getStatusLabel(quote.status)}
                </div>
            </div>

            {/* Source URL - Prominent link to e-commerce */}
            {quote.sourceUrl && (
                <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-green-500/20">
                                    <ShoppingCart className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">Ver producto en la tienda</p>
                                    <p className="text-sm text-muted-foreground">Cotización obtenida de {quote.supplier.name}</p>
                                </div>
                            </div>
                            <Button
                                variant="gradient"
                                className="gap-2"
                                onClick={() => window.open(quote.sourceUrl!.startsWith('http') ? quote.sourceUrl! : `https://${quote.sourceUrl}`, '_blank')}
                            >
                                <ExternalLink className="w-4 h-4" />
                                Ir a la tienda
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Price Summary */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Precio Total</p>
                            <p className="text-4xl font-bold text-primary">
                                {formatCurrency(quote.totalPrice, quote.currency)}
                            </p>
                        </div>
                        <div className="flex gap-6">
                            {quote.deliveryDays && (
                                <div className="text-center">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Truck className="w-4 h-4" />
                                        <span className="text-sm">Entrega</span>
                                    </div>
                                    <p className="text-xl font-semibold">{quote.deliveryDays} días</p>
                                </div>
                            )}
                            {quote.warranty && (
                                <div className="text-center">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Shield className="w-4 h-4" />
                                        <span className="text-sm">Garantía</span>
                                    </div>
                                    <p className="text-xl font-semibold">{quote.warranty}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Productos Cotizados
                            </CardTitle>
                            <CardDescription>
                                Detalle de precios por producto
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2 font-medium">Producto</th>
                                            <th className="text-right py-3 px-2 font-medium">Cantidad</th>
                                            <th className="text-right py-3 px-2 font-medium">Precio Unit.</th>
                                            <th className="text-right py-3 px-2 font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quote.items.map((item) => (
                                            <tr key={item.id} className="border-b last:border-0">
                                                <td className="py-3 px-2">
                                                    <span className="font-medium">{item.productName}</span>
                                                </td>
                                                <td className="py-3 px-2 text-right text-muted-foreground">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-3 px-2 text-right text-muted-foreground">
                                                    {formatCurrency(item.unitPrice, quote.currency)}
                                                </td>
                                                <td className="py-3 px-2 text-right font-semibold">
                                                    {formatCurrency(item.totalPrice, quote.currency)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-muted/50">
                                            <td colSpan={3} className="py-3 px-2 text-right font-bold">
                                                TOTAL:
                                            </td>
                                            <td className="py-3 px-2 text-right font-bold text-primary text-lg">
                                                {formatCurrency(quote.totalPrice, quote.currency)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    {(quote.paymentTerms || quote.notes) && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Condiciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {quote.paymentTerms && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Términos de Pago</p>
                                        <p className="font-medium">{quote.paymentTerms}</p>
                                    </div>
                                )}
                                {quote.notes && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Notas</p>
                                        <p className="font-medium">{quote.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Supplier Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Proveedor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="font-semibold text-lg">{quote.supplier.name}</p>
                                <p className="text-sm text-muted-foreground">{quote.supplier.country}</p>
                            </div>
                            <div className="space-y-2 pt-2">
                                <a
                                    href={`mailto:${quote.supplier.email}`}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    {quote.supplier.email}
                                </a>
                                {quote.supplier.website && (
                                    <a
                                        href={quote.supplier.website.startsWith('http') ? quote.supplier.website : `https://${quote.supplier.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        {quote.supplier.website}
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tender Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Licitación
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{quote.tender.title}</p>
                            {quote.tender.description && (
                                <p className="text-sm text-muted-foreground mt-2">{quote.tender.description}</p>
                            )}
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => router.push(`/${params.locale}/dashboard/tenders/${quote.tender.id}`)}
                            >
                                Ver Licitación
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {quote.status === "RECEIVED" && (
                                <>
                                    <Button
                                        variant="gradient"
                                        className="w-full gap-2"
                                        onClick={() => updateStatus("ACCEPTED")}
                                        disabled={updating}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Aceptar Cotización
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 text-destructive hover:text-destructive"
                                        onClick={() => updateStatus("REJECTED")}
                                        disabled={updating}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Rechazar
                                    </Button>
                                </>
                            )}
                            {quote.status === "ACCEPTED" && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="font-medium">Cotización aceptada</span>
                                </div>
                            )}
                            {quote.status === "REJECTED" && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                    <XCircle className="w-5 h-5" />
                                    <span className="font-medium">Cotización rechazada</span>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground text-center pt-2">
                                Creada el {new Date(quote.createdAt).toLocaleDateString("es-ES")}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
