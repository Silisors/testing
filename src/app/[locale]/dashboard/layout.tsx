import { Sidebar } from "@/components/dashboard/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);



    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="md:ml-64 min-h-screen">
                <div className="p-6 md:p-8">{children}</div>
            </main>
        </div>
    );
}
