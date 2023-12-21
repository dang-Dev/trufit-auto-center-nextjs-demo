import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SettingForm from "@/components/Forms/SettingForm";
import Header from "@/components/header";
import { redirect } from 'next/navigation'

async function getUserById<T>(id: T) {
    try {
        const res = await fetch(`${process.env.BASE_PATH}/api/auth/user/${id}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function SettingPage() {
    const session = await getServerSession(authOptions);
    if(!session){
        redirect('/')
    }
    if (session?.user?.id) {
        const { data } = await getUserById(session.user.id);
        return (
            <>
            <Header/>
             <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-5">
                <SettingForm uuid={data.id} notification={data.notifType} />
            </div>
            </>
           
        );
    }
}
