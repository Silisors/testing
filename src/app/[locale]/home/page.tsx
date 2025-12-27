import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserHome } from "@/components/dashboard/user-home";

export default async function HomePage() {


    return (
        <div className="container mx-auto py-8">
            <UserHome />
        </div>
    );
}
