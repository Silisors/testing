import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    FileText,
    Users,
    BarChart3,
    TrendingUp,
    Plus,
    ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
    const t = useTranslations();

    const stats = [
        {
            title: t("dashboard.activeTenders"),
            value: "12",
            icon: FileText,
            change: "+3",
            changeType: "positive" as const,
        },
        {
            title: t("dashboard.pendingQuotes"),
            value: "28",
            icon: BarChart3,
            change: "+8",
            changeType: "positive" as const,
        },
        {
            title: t("dashboard.totalSuppliers"),
            value: "156",
            icon: Users,
            change: "+12",
            changeType: "positive" as const,
        },
        {
            title: t("dashboard.monthlySavings"),
            value: "$24,500",
            icon: TrendingUp,
            change: "+15%",
            changeType: "positive" as const,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
                    <p className="text-muted-foreground">{t("dashboard.welcome", { name: "Usuario" })}</p>
                </div>
                <Link href="/dashboard/tenders/new">
                    <Button variant="gradient" className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t("dashboard.newTender")}
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                {stat.change} desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.quickActions")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/dashboard/tenders/new" className="block">
                            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t("tenders.newTender")}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Crear una nueva licitación de compras
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>

                        <Link href="/dashboard/suppliers" className="block">
                            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t("suppliers.aiSearch")}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Buscar proveedores con inteligencia artificial
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>

                        <Link href="/dashboard/quotes" className="block">
                            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t("dashboard.viewQuotes")}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Ver y comparar cotizaciones recibidas
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    action: "Nueva cotización recibida",
                                    detail: "Proveedor ABC - Licitación #1234",
                                    time: "Hace 2 horas",
                                },
                                {
                                    action: "Búsqueda de proveedores completada",
                                    detail: "Se encontraron 15 proveedores para equipos de oficina",
                                    time: "Hace 5 horas",
                                },
                                {
                                    action: "Licitación creada",
                                    detail: "Suministros de limpieza Q4 2024",
                                    time: "Hace 1 día",
                                },
                                {
                                    action: "Proveedor contactado",
                                    detail: "Email enviado a 8 proveedores",
                                    time: "Hace 2 días",
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">{activity.detail}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
