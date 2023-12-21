import prisma from "@/lib/prisma";
import AppointmentEditForm from "../Forms/AppointmentEditForm";

async function getAppointmentById(id: string) {
    try {
        const res = await fetch(`${process.env.BASE_PATH}/api/appointment/${id}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }

        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function EditAppointment({ id, notificationId }: { id: string; notificationId: string }) {
    const { data } = await getAppointmentById(id);

    return <AppointmentEditForm data={data} notificationId={notificationId} />;
}
