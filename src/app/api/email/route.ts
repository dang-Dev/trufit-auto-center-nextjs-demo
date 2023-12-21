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
        const body = await req.json();
        const { email } = body;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
                role: "BASIC",
            },
        });

        if(user){
            await prisma.resetPasswordToken.create({
                data: {
                    uuid : user.id,
                    expires: moment().add(1, 'days').toISOString(),
                    token: ''
                }
            })
        }

        const username = user?.username;
        const actionUrl = process.env.BASE_PATH + "/reset-password/" + user?.id;
        const encodedURL = encodeURIComponent(actionUrl);

        const mailOptions = {
            from: {
                name: "Trufit Auto Center",
                address: process.env.USER,
            },
            to: [email],
            subject: "Reset Password",
            html: `<div>
                        <h1>Hi, ${username}!</h1>
                        <p>
                            You recently requested to reset your password for your Trufit Auto Center account. Use the button below to
                            reset it.
                        </p>
                        <p>
                            <strong>This password reset is only valid for the next 24 hours.</strong>
                        </p>
                        Reset your password <a href="${actionUrl}">${encodedURL}</a>
                    </div>`,
        };

        try {
            const sendMail = await transporter.sendMail(mailOptions);
            return NextResponse.json({sendMail});
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        return NextResponse.json({ error });
    }
}
