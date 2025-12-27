"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, ShoppingCart } from "lucide-react";

export default function HistoryPage() {
    const t = useTranslations();

    const historyItems = [
        {
            id: 1,
            type: "search",
            query: "Sillas ergonómicas oficina",
            date: "Today, 10:30 AM",
            results: 15,
            status: "completed"
        },
        {
            id: 2,
            type: "purchase",
            product: "Laptop Pro X1",
            price: "$4,500,000",
            date: "Yesterday, 2:15 PM",
            status: "processing"
        },
        {
            id: 3,
            type: "search",
            query: "Monitores 4K 27 pulgadas",
            date: "Dec 24, 9:00 AM",
            results: 8,
            status: "completed"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("nav.history")}</h1>
                <p className="text-muted-foreground">
                    View your recent activity and interactions
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest searches and purchases</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {historyItems.map((item) => (
                            <div key={item.id} className="flex items-center">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        {item.type === 'search' ? (
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <p className="text-sm font-medium leading-none">
                                            {item.type === 'search' ? `Searched for "${item.query}"` : `Purchased ${item.product}`}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {item.date}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    {item.type === 'purchase' ? (
                                        <div className="text-right">
                                            <div>{item.price}</div>
                                            <Badge variant="outline" className="mt-1 text-xs">Processing</Badge>
                                        </div>
                                    ) : (
                                        <Badge variant="secondary">{item.results} results</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
