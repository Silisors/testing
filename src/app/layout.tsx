import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ComprasBot - Gestión Inteligente de Compras",
    description: "Software de gestión de compras con IA para empresas. Encuentra proveedores, solicita cotizaciones y analiza ofertas automáticamente.",
    keywords: ["compras", "proveedores", "cotizaciones", "IA", "licitaciones", "procurement"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
