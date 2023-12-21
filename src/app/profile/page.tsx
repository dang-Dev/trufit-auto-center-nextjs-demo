import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import EditUserForm from "@/components/Forms/UserEditForm";
import Header from "@/components/header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Profile() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }
    if (session?.user) {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                phoneNumber: true,
                birthDate: true,
                gender: true,
                email: true,
                isEmailVerify: true,
                notifType: true,
                address: {
                    select: {
                        id: true,
                        street: true,
                        city: true,
                        province: true,
                        zip_code: true,
                    },
                },
            },
        });
        
        return (
            <>
                <Header />
                <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-5">
                    <EditUserForm data={user} isAdmin={false} />
                </div>
            </>
        );
    }
}
