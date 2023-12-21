"use client";
import { NoSymbolIcon  } from "@heroicons/react/24/outline";

export default function DeleteAppointmentButton({ id }: { id: string }) {
    const handleDelete = async () => {
        if (confirm(`Are you sure CANCEL selected Appointment ${id} ?`)) {
            try {
                const res = await fetch(`${process.env.BASE_PATH}/api/appointment/${id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) {
                    throw new Error("Failed Fetching data.");
                }
                const data = await res.json();
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
    };
    return (
        <button onClick={handleDelete} className="outline outline-1 outline-red-500 rounded-sm me-2 px-1.5 inline-flex items-center">
            <NoSymbolIcon  className="h-6 w-6 text-red-500" />
            CANCEL
        </button>
    );
}
