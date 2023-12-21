import ResetPasswordForm from "@/components/Forms/ResetPasswordForm";

async function getTokenByID(id: string) {
    try {
        const res = await fetch(`${process.env.BASE_PATH}/api/reset-password/${id}`, { cache: "no-store" });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function ResetPassword({ params }: { params: { uuid: string } }) {
    const token = await getTokenByID(params.uuid);
    const today = new Date();
    if (token.data && today > new Date(token?.data.expires)) {
        return <h1>Reset Password link expired!</h1>;
    }

    return (
        <div className="w-full">
            <div className="w-[450px] mt-5 rounded mx-auto">
                <div className="bg-red-200 rounded-t p-2 font-medium ps-5">RESET PASSWORD</div>
                <div className="bg-slate-50 p-5 rounded-b">
                    <ResetPasswordForm uuid={params.uuid} />
                </div>
            </div>
        </div>
    );
}
