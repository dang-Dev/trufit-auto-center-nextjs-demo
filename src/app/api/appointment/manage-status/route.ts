import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

export async function POST(req: Request) {
    try {
        const { status, id, customerId }: { status: AppointmentStatus; id: string; customerId: string } =
            await req.json();

        const appointment = await prisma.appointment.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        });

        const user = await prisma.user.findUnique({
            where: {
                id: customerId,
            },

            select: {
                firstName:true,
                lastName:true,
                phoneNumber: true,
                email: true,
                notifType: true,
            },
        });
        if (user) {
            if (user.notifType === "EMAIL" && user.email) {
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
                                        Your appointment from Trufit Auto Center has been ${status}. 
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
            } else if (user.notifType === "SMS" && user.phoneNumber) {
                const result = await fetch("https://api.semaphore.co/api/v4/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        apikey: process.env.SMS_GATEWAY_API_KEY,
                        number: user.phoneNumber,
                        message:
                            `Your appointment from Trufit Auto Center has been ${status}. Thank you,`,
                    }),
                });
                console.log(await result.json());
            }

            
            pusherServer.trigger("user-notification", "user-incoming-notification", {
                message: appointment,
            });
           
        }
        return NextResponse.json({ data: appointment }, { status: 200 });
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
