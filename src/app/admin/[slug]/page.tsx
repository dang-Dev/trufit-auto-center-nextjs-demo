import UserTable from "@/components/admin/UserTable";
import AppointmentTable from "@/components/admin/AppointmentTable";
import { notFound } from "next/navigation";
import DashboardPage from "@/components/Dashboard";
import AdminCalendar from "@/components/admin/AdminCalendar";
import TableFeedback from "@/components/table/TableFeedback";

export default function Dashboard({ params }: { params: { slug: string } }) {
    switch (params.slug) {
        case "dashboard":
            return <DashboardPage />;
        case "appointment":
            return <AppointmentTable slug={params.slug} />;
        case "user":
            return <UserTable slug={params.slug} />;
        case "calendar":
            return <AdminCalendar />;
        case "feedback":
            return <TableFeedback slug={params.slug}/>;
        default:
            notFound();
    }
}
