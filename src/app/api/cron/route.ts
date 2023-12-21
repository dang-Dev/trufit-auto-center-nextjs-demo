import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
    },
});

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { success: false },
                {
                    status: 401,
                }
            );
        }

        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999);
        // GET today appointments
        const today_appointments = await prisma.appointment.findMany({
            where: {
                event: {
                    start: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                status: "APPROVED",
            },
            select: {
                id: true,
                customerId: true,
            },
        });

        if (today_appointments.length > 0) {
            // Update to ONGOING the today appointment
            const updated_appointment = await prisma.appointment.updateMany({
                where: {
                    id: {
                        in: [...today_appointments.map((ele) => ele.id)],
                    },
                },
                data: {
                    status: "ONGOING",
                },
            });
        }
        const today_ids = today_appointments.filter((ele) => ele.customerId !== null);

        const customers = await prisma.user.findMany({
            where: {
                id: {
                    in: [...today_ids.map((item) => item.customerId ?? "")],
                },
            },
            select: {
                id: true,
                email: true,
                phoneNumber: true,
            },
        });

        if (customers.length > 0) {
            const mailOptions = {
                from: {
                    name: "Trufit Auto Center",
                    address: process.env.USER,
                },
                to: [...customers.map((e) => e.email)],
                subject: "Trufit Auto Center Notification",
                html: `<div>
                                <h1>Dear Client,</h1>
                                <p>
                                I hope this email finds you well. We appreciate your trust in Trufit Auto Center Daet for your automotive service needs. We would like to remind you of your scheduled appointment today at Trufit Auto Center Daet.
                                </p>
                                <br/>
                                <p>For more information kindly check your appointment in your account.</p>
                                <br/>
                                <p>Trufit Auto Center Daet</p>
                                <p>1042 Vinzons Ave. P-1 Brgy. Gahonon,</p>
                                <p>Daet, Philippines</p>
                                <p>+63918 774 7788</p>

                                <br/>

                                <p>We value your time and business. If there are any changes or if you have questions, feel free to reach out.</p>

                                <br/>

                                <p>Thank you for choosing Trufit Auto Center Daet. We're ready to provide you with excellent service.</p>
                                <br/>

                                <p>Best regards,</p>
                                <br/>
                                <p>Norman Lloyd S. Pagulayan</p>
                                <p>Clerk</p>
                                <p>Trufit Auto Center Daet</p>
                    </div>`,
            };
            try {
                const sendMail = await transporter.sendMail(mailOptions);
                console.log(sendMail);
            } catch (error) {
                console.log(error);
            }

            const phone_number_list = customers.map((e) => e.phoneNumber);

            const result = await fetch("https://api.semaphore.co/api/v4/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apikey: process.env.SMS_GATEWAY_API_KEY,
                    number: phone_number_list.toString(),
                    message: "Hello Mam/Sir, This is Trufit Auto Center Daet. A quick reminder of your appointment today. \nFor any changes or inquiries, feel free to reach out. We appreciate your business.\nBest regards,\nNorman Lloyd Pagulayan\nClerk\nTrufit Auto Center Daet\n+63918 774 7788",
                }),
            });

            console.log(await result.json());
        }

        // Set To EXPIRED when not adding remarks after 3 days
        const update_to_expired = await prisma.appointment.updateMany({
            where: {
                OR: [
                    {
                        status: "PENDING",
                    },
                    {
                        status: "ONGOING",
                    },
                    {
                        status: "APPROVED",
                    },
                ],
                expiredAt: {
                    lte: endOfDay,
                },
            },
            data: {
                status: "EXPIRED",
            },
        });
        console.log("update_to_expired", update_to_expired);
        return NextResponse.json({ success: true });
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
