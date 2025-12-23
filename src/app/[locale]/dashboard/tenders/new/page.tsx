"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, ArrowLeft, ArrowRight } from "lucide-react";

interface TenderItem {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    specifications: string;
}

export default function NewTenderPage() {
    const t = useTranslations();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [items, setItems] = useState<TenderItem[]>([
        { id: "1", productName: "", quantity: 1, unit: "", specifications: "" },
    ]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deadline: "",
        supplierScope: "ALL",
        currency: "COP",
    });

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                productName: "",
                quantity: 1,
                unit: "",
                specifications: "",
            },
        ]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof TenderItem, value: string | number) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    async function handleSubmit() {
        setIsLoading(true);

        try {
            const response = await fetch("/api/tenders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items: items.filter((item) => item.productName.trim() !== ""),
                }),
            });

            if (response.ok) {
                const tender = await response.json();
                router.push(`/dashboard/tenders/${tender.id}`);
            }
        } catch (error) {
            console.error("Error creating tender:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{t("tenders.newTender")}</h1>
                    <p className="text-muted-foreground">
                        {step === 1 ? "Información básica" : "Productos y servicios"}
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
                <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            </div>

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Licitación</CardTitle>
                        <CardDescription>
                            Define los detalles básicos y el alcance de proveedores
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t("tenders.tenderTitle")}</Label>
                            <Input
                                id="title"
                                placeholder="Ej: Compra de equipos de cómputo Q1 2025"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t("tenders.tenderDescription")}</Label>
                            <textarea
                                id="description"
                                className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Descripción detallada de lo que necesitas comprar..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="deadline">{t("tenders.deadline")}</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>{t("tenders.supplierScope")}</Label>
                                <Select
                                    value={formData.supplierScope}
                                    onValueChange={(value) => setFormData({ ...formData, supplierScope: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOCAL">{t("tenders.scopeLocal")}</SelectItem>
                                        <SelectItem value="NATIONAL">{t("tenders.scopeNational")}</SelectItem>
                                        <SelectItem value="INTERNATIONAL">{t("tenders.scopeInternational")}</SelectItem>
                                        <SelectItem value="ALL">{t("tenders.scopeAll")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Moneda</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COP">🇨🇴 COP - Peso Colombiano</SelectItem>
                                        <SelectItem value="USD">🇺🇸 USD - Dólar Americano</SelectItem>
                                        <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                                        <SelectItem value="MXN">🇲🇽 MXN - Peso Mexicano</SelectItem>
                                        <SelectItem value="BRL">🇧🇷 BRL - Real Brasileño</SelectItem>
                                        <SelectItem value="ARS">🇦🇷 ARS - Peso Argentino</SelectItem>
                                        <SelectItem value="CLP">🇨🇱 CLP - Peso Chileno</SelectItem>
                                        <SelectItem value="PEN">🇵🇪 PEN - Sol Peruano</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!formData.title}
                                className="gap-2"
                            >
                                {t("common.next")}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t("tenders.items")}</CardTitle>
                        <CardDescription>
                            Agrega los productos o servicios que necesitas cotizar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className="p-4 rounded-lg border bg-muted/30 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Producto #{index + 1}</span>
                                    {items.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <Label>{t("tenders.productName")}</Label>
                                        <Input
                                            placeholder="Ej: Laptop Dell Inspiron 15"
                                            value={item.productName}
                                            onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t("tenders.quantity")}</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                updateItem(item.id, "quantity", val === "" ? 1 : parseInt(val) || 1);
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t("tenders.unit")}</Label>
                                        <Input
                                            placeholder="Ej: Unidades, Cajas, Kg"
                                            value={item.unit}
                                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label>{t("tenders.specifications")}</Label>
                                        <textarea
                                            className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Especificaciones técnicas, marca preferida, etc."
                                            value={item.specifications}
                                            onChange={(e) => updateItem(item.id, "specifications", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" onClick={addItem} className="w-full gap-2">
                            <Plus className="w-4 h-4" />
                            {t("tenders.addItem")}
                        </Button>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                {t("common.previous")}
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={handleSubmit}
                                disabled={isLoading || items.every((i) => !i.productName.trim())}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("common.loading")}
                                    </>
                                ) : (
                                    t("common.create")
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
