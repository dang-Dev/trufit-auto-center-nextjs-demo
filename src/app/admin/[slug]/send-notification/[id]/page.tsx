import SendNotificationForm from "@/components/Forms/SendNotificationForm";

async function getUserById(id: string) {
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

export default async function SendNotification({ params }: { params: { id: string; slug: string } }) {
    const { data } = await getUserById(params.id);

    return (
        <>
            <h1 className="text-xl font-semibold mb-4">
                Send Notification to : {data.firstName} {data.lastName}
            </h1>
            <SendNotificationForm id={data.id} />
        </>
    );
}
