"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ShoppingCart,
    Menu,
    X,
    Package,
    CreditCard,
    History,
    UserCircle,
    Home,
} from "lucide-react";
import { useState } from "react";

const adminNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "nav.dashboard" },
    { href: "/dashboard/tenders", icon: FileText, label: "nav.tenders" },
    { href: "/dashboard/quotes", icon: BarChart3, label: "nav.quotes" },
    { href: "/dashboard/suppliers", icon: Users, label: "nav.suppliers" },
    { href: "/dashboard/products", icon: Package, label: "nav.products" },
    { href: "/dashboard/my-plan", icon: CreditCard, label: "nav.myPlan" },
    { href: "/dashboard/settings", icon: Settings, label: "nav.settings" },
];

const userNavItems = [
    { href: "/home", icon: Home, label: "nav.home" },
    { href: "/home/my-plan", icon: CreditCard, label: "nav.myPlan" },
    { href: "/home/profile", icon: UserCircle, label: "nav.profile" },
    { href: "/home/history", icon: History, label: "nav.history" },
];

export function Sidebar() {
    const t = useTranslations();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    // const { data: session } = useSession(); // Role check removed

    // Remove locale prefix from pathname for comparison
    const cleanPathname = pathname.replace(/^\/(es|en|pt)/, "");

    // Determine nav items based on current section (Home vs Dashboard)
    const isHomeSection = cleanPathname.startsWith("/home");
    const navItems = isHomeSection ? userNavItems : adminNavItems;

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border md:hidden"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg">{t("common.appName")}</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navItems.map((item) => {
                            // Exact match for root items (/dashboard or /home) unless it's a sub-route
                            // The previous logic was too loose with startsWith(item.href + "/")
                            const isActive =
                                cleanPathname === item.href ||
                                (item.href !== "/dashboard" &&
                                    item.href !== "/home" &&
                                    cleanPathname.startsWith(item.href + "/"));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {t(item.label)}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="w-5 h-5" />
                            {t("auth.logout")}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
