import AdminHeader from "@/components/admin/AdminHeader";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import UnAuthorizePage from "@/components/UnAuthorizePage";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const session = await getServerSession(authOptions);
    if(session?.user?.role !== "ADMIN"){
        return <UnAuthorizePage/>
    }
    return (
        <div className="min-h-full">
            <AdminHeader slug={params.slug} />
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-3 xsm:px-2 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
