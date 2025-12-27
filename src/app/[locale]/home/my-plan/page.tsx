"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AavanceWidget from "@/components/pricing/AavanceWidget";

export default function MyPlanPage() {
    const t = useTranslations();

    // Mock current plan
    const currentPlan = "free";

    const plans = [
        {
            id: "free",
            name: t("landing.pricing.free.name"),
            price: t("landing.pricing.free.price"),
            priceAmount: 0,
            features: [
                "5 tenders/month",
                "10 suppliers",
                "Manual search",
                "1 user"
            ]
        },
        {
            id: "pro",
            name: t("landing.pricing.pro.name"),
            price: t("landing.pricing.pro.price"),
            priceAmount: 49000,
            features: [
                "Unlimited tenders",
                "Unlimited suppliers",
                "AI search",
                "5 users",
                "Automatic contact"
            ],
            popular: true
        },
        {
            id: "enterprise",
            name: t("landing.pricing.enterprise.name"),
            price: t("landing.pricing.enterprise.price"),
            priceAmount: 299000,
            features: [
                "Everything in Pro",
                "Unlimited users",
                "API access",
                "Priority support",
                "ERP integration"
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("nav.myPlan")}</h1>
                <p className="text-muted-foreground">
                    Manage your subscription and billing details
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg relative' : ''}`}>
                        {plan.popular && (
                            <div className="absolute top-0 right-0 -mt-3 -mr-3">
                                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {plan.name}
                                {currentPlan === plan.id && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                        Current
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription className="text-2xl font-bold">
                                {plan.price}
                                <span className="text-sm font-normal text-muted-foreground">/month</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            {currentPlan === plan.id ? (
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    disabled
                                >
                                    Current Plan
                                </Button>
                            ) : (
                                <AavanceWidget
                                    amount={plan.priceAmount}
                                    description={`Upgrade to ${plan.name}`}
                                    buttonText="Mejorar Plan"
                                    // User details would come from session in a real app
                                    userEmail="user@example.com"
                                    userName="User"
                                />
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View your recent payments</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No payment history available yet.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
