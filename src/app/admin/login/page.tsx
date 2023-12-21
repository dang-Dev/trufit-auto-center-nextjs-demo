import Image from "next/image";
import AdminLoginForm from "@/components/Forms/AdminLoginForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLogin() {
    const session = await getServerSession(authOptions);

    if(session?.user?.role === 'ADMIN'){
        redirect('/admin/dashboard')
    }

    if(session?.user?.role === 'BASIC'){
        redirect('/')
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image className="mx-auto" src={'/trufit-logo.png'} width={40} height={40} alt="Logo" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in Admin Account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <AdminLoginForm/>
            </div>
        </div>
    );
}
