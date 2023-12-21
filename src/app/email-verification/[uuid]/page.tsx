
async function verifyAccount(id: string) {
    try {
        const res = await fetch(`${process.env.BASE_PATH}/api/email/verification/${id}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function EmailVerification({ params }: { params: { uuid: string } }){
    const data = await verifyAccount(params.uuid);
    return (
        <div className="text-xl">{data.message}</div>
    )
}