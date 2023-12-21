import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Header from "@/components/header";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import StatusTag from "@/components/StatusTag";
import moment from "moment";
import DeleteAppointmentButton from "@/components/DeleteAppoitmentButton";


async function getAppointmentByCustomer(customerId: string | undefined) {
    const appointments = await prisma.appointment.findMany({
        where: {
            customerId: customerId,
        },
        include: {
            event: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });

    return appointments;
}

export default async function ViewAppointment() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }
    const appointments = await getAppointmentByCustomer(session.user?.id);

    return (
        <>
            <Header />
            <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-5">
                <div className="text-center mb-5 text-slate-400">
                    {appointments.length > 0 ? "Shows latest 10 records you have." : "No Record Found!"}
                </div>
                <div className="space-y-3">
                    {appointments.map((element) => (
                        <div
                            key={element.id}
                            className="flex justify-between shadow-lg bg-slate-50 rounded-lg p-5 text-sm"
                        >
                            <div>
                                <div>
                                    <strong>Appointment Date:</strong> {moment(element.event.start).format("LLL")} -{" "}
                                    {moment(element.event.end).format("LLL")}
                                </div>
                                <div>
                                    <strong>Vehicle Brand:</strong> {element.carBrand}
                                </div>
                                <div>
                                    <strong>Vehicle Model:</strong> {element.vehicleModel}
                                </div>
                                <div>
                                    <strong>Vehicle Issue:</strong> {element.carIssue}
                                </div>
                                <div>
                                    <strong>Remark:</strong> {element.remark}
                                </div>
                                <div>
                                    <strong>CreatedAt:</strong> {moment(element.createdAt).format("LLL")}
                                </div>
                            </div>

                            <div className="inline-flex items-start">
                                {element.status === "PENDING" || element.status === "ONGOING" || element.status === "APPROVED" ? (
                                    <DeleteAppointmentButton id={element.id}/>
                                ) : (
                                    ""
                                )}
                                <StatusTag status={element.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
