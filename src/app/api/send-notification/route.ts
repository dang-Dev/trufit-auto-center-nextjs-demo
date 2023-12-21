import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import moment from "moment";
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
        const { uuid, is_email, is_sms, email_message, sms_message } = await req.json();

        const users = await prisma.user.findMany({
            where: {
                id: { in: uuid.split(",") },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
            },
        });

        if (users.length > 0 && is_email) {
            console.log("TEST SEND EMAIL");

            const mailOptions = {
                from: {
                    name: "Trufit Auto Center",
                    address: process.env.USER,
                },
                to: [...users.map((e) => e.email)],
                subject: "Trufit Auto Center Notification",
                html: `<div>
                                <h1>Hi Mam/Sir,</h1>
                                <p>
                                    ${email_message} 
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
        }
        if (users.length > 0 && is_sms) {
            console.log("SEND SMS", sms_message);
            console.log(
                "Phone Number list",
                users.map((e) => e.phoneNumber)
            );
            const phone_number_list = users.map((e) => e.phoneNumber);

            const result = await fetch("https://api.semaphore.co/api/v4/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apikey: process.env.SMS_GATEWAY_API_KEY,
                    number: phone_number_list.toString(),
                    message: sms_message,
                }),
            });
            console.log(await result.json());
        }

        return NextResponse.json({ data: "OK" }, { status: 200 });
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
