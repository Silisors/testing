import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
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
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
    const t = await getTranslations();
    const session = await getServerSession(authOptions);

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
                    <p className="text-muted-foreground">{t("dashboard.welcome", { name: session?.user?.name || "Usuario" })}</p>
                </div>
                <Link href="/dashboard/tenders/new">
                    <Button variant="default" className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700">
                        <Plus className="w-4 h-4" />
                        {t("dashboard.newTender")}
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium bg-green-50 w-fit px-2 py-0.5 rounded-full">
                                {stat.change} desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>{t("dashboard.quickActions")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/dashboard/tenders/new" className="block">
                            <div className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-all group hover:border-primary/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <Plus className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium group-hover:text-blue-700 transition-colors">{t("tenders.newTender")}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Crear una nueva licitación de compras
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        <Link href="/dashboard/suppliers" className="block">
                            <div className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-all group hover:border-primary/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium group-hover:text-purple-700 transition-colors">{t("suppliers.aiSearch")}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Buscar proveedores con inteligencia artificial
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        <Link href="/dashboard/quotes" className="block">
                            <div className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-all group hover:border-primary/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                        <BarChart3 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium group-hover:text-green-700 transition-colors">{t("dashboard.viewQuotes")}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Ver y comparar cotizaciones recibidas
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-0 pl-4 border-l-2 border-muted">
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
                                    className="relative pl-6 pb-8 last:pb-0 group"
                                >
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-primary border-4 border-background group-hover:scale-125 transition-transform" />
                                    <div>
                                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">{activity.detail}</p>
                                        <p className="text-xs text-muted-foreground mt-1 bg-muted/50 w-fit px-2 py-0.5 rounded-md">{activity.time}</p>
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
