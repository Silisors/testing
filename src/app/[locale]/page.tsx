import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Search,
    Mail,
    BarChart3,
    Globe,
    ShoppingCart,
    Users,
    FileText,
    Zap,
    ArrowRight,
    Check
} from "lucide-react";

export default function HomePage() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold">{t("common.appName")}</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            {t("landing.features.title")}
                        </Link>
                        <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            {t("landing.pricing.title")}
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost">{t("auth.login")}</Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="gradient">{t("auth.register")}</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                            {t("landing.hero.title")}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
                            {t("landing.hero.subtitle")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                            <Link href="/register">
                                <Button size="xl" variant="gradient" className="gap-2">
                                    {t("landing.hero.cta")}
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="#demo">
                                <Button size="xl" variant="outline">
                                    {t("landing.hero.demo")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        {t("landing.features.title")}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="group hover:border-primary/50 transition-all hover:-translate-y-1">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Search className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{t("landing.features.search.title")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("landing.features.search.description")}</p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:border-primary/50 transition-all hover:-translate-y-1">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{t("landing.features.autoContact.title")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("landing.features.autoContact.description")}</p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:border-primary/50 transition-all hover:-translate-y-1">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <BarChart3 className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{t("landing.features.analysis.title")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("landing.features.analysis.description")}</p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:border-primary/50 transition-all hover:-translate-y-1">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{t("landing.features.multiLanguage.title")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("landing.features.multiLanguage.description")}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        {t("landing.pricing.title")}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <Card className="relative">
                            <CardHeader>
                                <CardTitle>{t("landing.pricing.free.name")}</CardTitle>
                                <CardDescription className="text-3xl font-bold text-foreground">
                                    {t("landing.pricing.free.price")}
                                    <span className="text-sm font-normal text-muted-foreground">/mes</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {(t.raw("landing.pricing.free.features") as string[]).map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="outline" className="w-full">
                                    {t("landing.hero.cta")}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="relative border-primary shadow-lg shadow-primary/10">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                                Popular
                            </div>
                            <CardHeader>
                                <CardTitle>{t("landing.pricing.pro.name")}</CardTitle>
                                <CardDescription className="text-3xl font-bold text-foreground">
                                    {t("landing.pricing.pro.price")}
                                    <span className="text-sm font-normal text-muted-foreground">/mes</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {(t.raw("landing.pricing.pro.features") as string[]).map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="gradient" className="w-full">
                                    {t("landing.hero.cta")}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Enterprise Plan */}
                        <Card className="relative">
                            <CardHeader>
                                <CardTitle>{t("landing.pricing.enterprise.name")}</CardTitle>
                                <CardDescription className="text-3xl font-bold text-foreground">
                                    {t("landing.pricing.enterprise.price")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    {(t.raw("landing.pricing.enterprise.features") as string[]).map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="outline" className="w-full">
                                    Contactar
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold">{t("common.appName")}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2024 ComprasBot. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
