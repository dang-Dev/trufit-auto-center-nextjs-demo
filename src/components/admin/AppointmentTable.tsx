import Table from "../table/TableAppointment";

async function getAppointments() {
    try {
        const res = await fetch(`${process.env.BASE_PATH}/api/appointment?limit=10`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error("Failed Fetching data.");
        }
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export default async function AppointmentTable({ slug }: { slug: string }) {
    const appointments = await getAppointments();

    return (
        <div className="bg-neutral-100 rounded-md shadow-xl p-2">
            <Table appointments={appointments.data} total={appointments.total ?? 0} slug={slug} />
        </div>
    );
}
