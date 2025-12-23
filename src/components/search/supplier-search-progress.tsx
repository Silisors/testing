"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Building2, Search, Sparkles } from "lucide-react";

interface SearchStep {
    id: string;
    name: string;
    status: "pending" | "running" | "completed";
    result?: string;
}

interface SupplierResult {
    name: string;
    location: string;
    score: number;
}

interface SupplierSearchProgressProps {
    isOpen: boolean;
    onComplete: () => void;
    tenderId: string;
    itemCount: number;
}

export function SupplierSearchProgress({
    isOpen,
    onComplete,
    tenderId,
    itemCount
}: SupplierSearchProgressProps) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [suppliers, setSuppliers] = useState<SupplierResult[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [startTime] = useState(Date.now());

    const steps: SearchStep[] = [
        { id: "1", name: "Analizando productos de la licitación", status: currentStep > 0 ? "completed" : currentStep === 0 ? "running" : "pending" },
        { id: "2", name: "Identificando categorías y palabras clave", status: currentStep > 1 ? "completed" : currentStep === 1 ? "running" : "pending" },
        { id: "3", name: "Buscando proveedores en bases de datos", status: currentStep > 2 ? "completed" : currentStep === 2 ? "running" : "pending" },
        { id: "4", name: "Evaluando relevancia de proveedores", status: currentStep > 3 ? "completed" : currentStep === 3 ? "running" : "pending" },
        { id: "5", name: "Generando recomendaciones", status: currentStep > 4 ? "completed" : currentStep === 4 ? "running" : "pending" },
    ];

    useEffect(() => {
        if (!isOpen) return;

        // Simulate progress with demo data (replace with real SSE/WebSocket in production)
        const demoSuppliers: SupplierResult[] = [
            { name: "TechSupply Colombia", location: "Bogotá", score: 95 },
            { name: "Digital Solutions S.A.S", location: "Medellín", score: 88 },
            { name: "Compumax Ltda", location: "Cali", score: 85 },
            { name: "InfoTech Distribuidores", location: "Barranquilla", score: 82 },
            { name: "ProTech Empresarial", location: "Bucaramanga", score: 78 },
        ];

        let currentProgress = 0;
        const totalDuration = 8000; // 8 seconds total
        const stepDuration = totalDuration / 5;

        const progressInterval = setInterval(() => {
            currentProgress += 2;
            if (currentProgress <= 100) {
                setProgress(currentProgress);

                // Calculate time remaining
                const elapsed = Date.now() - startTime;
                const rate = currentProgress / elapsed;
                const remaining = (100 - currentProgress) / rate;
                setTimeRemaining(Math.ceil(remaining / 1000));

                // Update step based on progress
                const stepIndex = Math.min(Math.floor(currentProgress / 20), 4);
                setCurrentStep(stepIndex);

                // Add suppliers progressively
                if (currentProgress >= 40 && suppliers.length < 1) {
                    setSuppliers([demoSuppliers[0]]);
                } else if (currentProgress >= 50 && suppliers.length < 2) {
                    setSuppliers(demoSuppliers.slice(0, 2));
                } else if (currentProgress >= 60 && suppliers.length < 3) {
                    setSuppliers(demoSuppliers.slice(0, 3));
                } else if (currentProgress >= 75 && suppliers.length < 4) {
                    setSuppliers(demoSuppliers.slice(0, 4));
                } else if (currentProgress >= 90 && suppliers.length < 5) {
                    setSuppliers(demoSuppliers);
                }
            } else {
                clearInterval(progressInterval);
                setProgress(100);
                setCurrentStep(5);
                setTimeRemaining(0);

                // Call API to actually perform the search
                fetch(`/api/tenders/${tenderId}/search-suppliers`, {
                    method: "POST",
                }).then(() => {
                    setTimeout(onComplete, 1000);
                });
            }
        }, 160);

        return () => clearInterval(progressInterval);
    }, [isOpen, tenderId, onComplete, startTime, suppliers.length]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/20">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Buscando Proveedores con IA</h2>
                            <p className="text-sm text-muted-foreground">
                                Analizando {itemCount} producto{itemCount > 1 ? "s" : ""} de tu licitación
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="p-6 space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">{progress}% completado</span>
                            {timeRemaining !== null && timeRemaining > 0 && (
                                <span className="text-muted-foreground">
                                    ~{timeRemaining}s restantes
                                </span>
                            )}
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${step.status === "running"
                                        ? "bg-primary/10 border border-primary/30"
                                        : step.status === "completed"
                                            ? "bg-green-500/10"
                                            : "bg-muted/50"
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    {step.status === "running" ? (
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                    ) : step.status === "completed" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                                    )}
                                </div>
                                <span className={`text-sm ${step.status === "pending" ? "text-muted-foreground" : ""
                                    }`}>
                                    {step.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Results Preview */}
                    {suppliers.length > 0 && (
                        <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Proveedores encontrados ({suppliers.length})
                                </span>
                            </div>
                            <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                                {suppliers.map((supplier, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border animate-in slide-in-from-left duration-300"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                <Building2 className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{supplier.name}</p>
                                                <p className="text-xs text-muted-foreground">{supplier.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-bold text-green-500">
                                                {supplier.score}%
                                            </span>
                                            <span className="text-xs text-muted-foreground">match</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completion Message */}
                    {progress === 100 && (
                        <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/30 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-green-600 dark:text-green-400">
                                ¡Búsqueda completada! Redirigiendo...
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
