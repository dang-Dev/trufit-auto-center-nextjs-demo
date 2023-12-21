import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import moment from "moment";
import { AppointmentStatus } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
    },
});

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const offset = searchParams.get("offset");
        const limit = searchParams.get("limit");
        const start_date = searchParams.get("start-date");
        const end_date = searchParams.get("end-date");
        const status = searchParams.get("status");
        const isPrint = searchParams.get("is-print");

        let parse_offset = 0;
        let parse_limit = 0;

        if (offset) {
            parse_offset = parseInt(offset);
        }
        if (limit) {
            parse_limit = parseInt(limit);
        }

        let where_query = {};
        let total_query = {};
        if (status) {
            where_query = {
                status: status,
            };
            total_query = {
                status: status,
            };
        }

        if (start_date && end_date) {
            where_query = {
                ...where_query,
                createdAt: {
                    lte: new Date(end_date),
                    gte: new Date(start_date),
                },
            };
            total_query = {
                ...total_query,
                createdAt: {
                    lte: new Date(end_date),
                    gte: new Date(start_date),
                },
            };
        }

        const result = await prisma.appointment.findMany({
            skip: parse_offset,
            take: parse_limit,
            where: where_query,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                event: {
                    select: {
                        start: true,
                        end: true,
                    },
                },
                customer: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        const total = await prisma.appointment.count({
            where: total_query,
        });

        if (isPrint) {
            const result = await prisma.appointment.findMany({
                where: where_query,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    event: {
                        select: {
                            start: true,
                            end: true,
                        },
                    },
                    customer: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            return NextResponse.json({ data: result, total: total }, { status: 200 });
        }

        return NextResponse.json({ data: result, total: total }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error", error },
            {
                status: 500,
            }
        );
    }
}

export async function POST(req: Request) {
    try {
        const {
            customer_id,
            event_id,
            car_brand,
            plate_number,
            vehicle_model,
            mileage,
            car_issue,
            chassis_number,
            engine_number,
            start_date,
            end_date,
            walked_in_full_name,
            status,
        }: {
            walked_in_full_name: string;
            end_date: Date;
            start_date: Date;
            car_issue: string;
            mileage: string;
            vehicle_model: string;
            plate_number: string;
            car_brand: string;
            chassis_number: string
            engine_number: string
            event_id: string;
            customer_id: string;
            status: AppointmentStatus | undefined;
        } = await req.json();

        if (start_date && end_date) {
            const result = await prisma.appointment.findMany({
                where: {
                    createdAt: {
                        lte: new Date(end_date),
                        gte: new Date(start_date),
                    },
                },
                select: {
                    status: true,
                    createdAt: true,
                },
            });
            return NextResponse.json({ data: result }, { status: 200 });
        }

        const event = await prisma.event.findUnique({
            where: {
                id: parseInt(event_id),
            },
            include: {
                appointments: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });

        if (!event) {
            throw new Error("Cannot find selected Schedule.");
        }

        if (
            event.allowed ===
            event.appointments.filter((item) => item.status === "ONGOING" || item.status === "APPROVED").length
        ) {
            throw new Error("Schedule has reach the maximum limit");
        }

        if (!customer_id) {
            const appointment = await prisma.appointment.create({
                data: {
                    carBrand: car_brand,
                    plateNumber: plate_number,
                    carIssue: car_issue,
                    vehicleModel: vehicle_model,
                    mileage: mileage,
                    expiredAt: moment().add(3, "days").format(),
                    event: {
                        connect: {
                            id: parseInt(event_id),
                        },
                    },
                    walkedInFullName: walked_in_full_name,
                    isWalkedIn: true,
                    status: status,
                },
            });

            return NextResponse.json({ data: appointment }, { status: 201 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: customer_id,
            },
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                firstName: true,
                lastName: true,
                notifType: true,
            },
        });

        if (user?.notifType === "EMAIL") {
            const mailOptions = {
                from: {
                    name: "Trufit Auto Center",
                    address: process.env.USER,
                },
                to: [user.email],
                subject: "Appointment Notification",
                html: `<div>
                                <h1>Hi, ${user.firstName} ${user.lastName}!</h1>
                                <p>
                                    You recently set an appointment from Trufit Auto Center. 
                                </p>
                                <p>${moment(event?.start).format("LLL")} - ${moment(event?.end).format("LLL")}</p>
                                <p>
                                    <strong>We will Notify you once your appointment has been approved.</strong>
                                </p>
                                Thank you,
                            </div>`,
            };

            try {
                const sendMail = await transporter.sendMail(mailOptions);
                console.log(sendMail);
            } catch (error) {
                console.log(error);
            }
        } else if (user?.notifType === "SMS") {
            const result = await fetch("https://api.semaphore.co/api/v4/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apikey: process.env.SMS_GATEWAY_API_KEY,
                    number: user.phoneNumber,
                    message:
                        "You recently set an appointment to Trufit Auto Center. We will Notify you once your appointment has been approved.",
                }),
            });
            console.log(await result.json());
        }

        const appointment = await prisma.appointment.create({
            data: {
                carBrand: car_brand,
                plateNumber: plate_number,
                carIssue: car_issue,
                vehicleModel: vehicle_model,
                mileage: mileage,
                chassisNumber: chassis_number,
                engineNumber: engine_number,
                expiredAt: moment().add(3, "days").format(),
                event: {
                    connect: {
                        id: parseInt(event_id),
                    },
                },
                customer: {
                    connect: {
                        id: customer_id,
                    },
                },
            },
        });

        const notification = await prisma.notification.create({
            data: {
                appointment: {
                    connect: {
                        id: appointment.id,
                    },
                },
            },
        });

        const get_notification = await prisma.notification.findUnique({
            where: {
                id: notification.id,
            },
            select: {
                id: true,
                un_read: true,
                created_at: true,
                appointmentId:true,
                appointment: {
                    select: {
                        customer: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        event: {
                            select: {
                                start: true,
                                end: true,
                            },
                        },
                    },
                },
            },
        });

        if (notification) {
            pusherServer.trigger("notification", "incoming-notification", {
                message: get_notification,
            });
        }

        return NextResponse.json({ data: appointment }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: (error as Error).message },
            {
                status: 500,
            }
        );
    }
}
