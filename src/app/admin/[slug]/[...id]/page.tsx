import { notFound } from "next/navigation";
import EditAppointment from "@/components/admin/EditAppointment";
import EditUser from "@/components/admin/EditUser";

export default function editPage({ params }: { params: { id: string[]; slug: string } }) {
    switch (params.slug) {
        case "user":
            return <EditUser id={params.id[0]} />;
        case "appointment":
            return <EditAppointment id={params.id[0]} notificationId={params.id[1]} />;
        default:
            notFound();
    }
}
