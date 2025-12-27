"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
    const t = useTranslations();
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("nav.profile")}</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and preferences
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                    {session?.user?.name?.substring(0, 2).toUpperCase() || "US"}
                                </AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Avatar</Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input defaultValue={session?.user?.name || ""} />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input defaultValue={session?.user?.email || ""} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input placeholder="+1 234 567 890" />
                        </div>

                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Manage your app settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="pt">Português</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Notifications</Label>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="email-notif" className="rounded border-gray-300" defaultChecked />
                                <label htmlFor="email-notif" className="text-sm">Email Notifications</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="push-notif" className="rounded border-gray-300" defaultChecked />
                                <label htmlFor="push-notif" className="text-sm">Push Notifications</label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
