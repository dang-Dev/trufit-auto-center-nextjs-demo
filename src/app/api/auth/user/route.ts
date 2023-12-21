import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { hash } from "bcrypt";
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
        const selected_ids = searchParams.get("selected_ids");

        if (selected_ids) {
            const result = await prisma.user.findMany({
                where: {
                    id: { in: selected_ids.split(",") },
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            });
            if (result) {
                return NextResponse.json({ data: result }, { status: 200 });
            }
        }

        let parse_offset = 0;
        let parse_limit = 0;
        if (offset) {
            parse_offset = parseInt(offset);
        }
        if (limit) {
            parse_limit = parseInt(limit);
        }

        if (parse_offset === 0 && parse_limit === 0) {
            const result = await prisma.user.findMany({
                where: {
                    role: "BASIC",
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            });
            if (result) {
                return NextResponse.json({ data: result }, { status: 200 });
            }
        }

        const result = await prisma.user.findMany({
            skip: parse_offset,
            take: parse_limit,
            orderBy: {
                createdAt: "desc",
            },
            where: {
                role: "BASIC",
            },
        });

        const total = await prisma.user.count({
            where: {
                role: "BASIC",
            },
        });

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
        const body = await req.json();
        const {
            username,
            password,
            first_name,
            last_name,
            email,
            contact_number,
            street_name,
            city_name,
            province_name,
            zip_code,
            birth_date,
            gender,
        } = body;

        const existing_user_by_email = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existing_user_by_email) {
            return NextResponse.json({ data: null, message: "User with this email already exists!" }, { status: 409 });
        }

        const existing_user_by_username = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (existing_user_by_username) {
            return NextResponse.json(
                { data: null, message: "User with this username already exists!" },
                { status: 409 }
            );
        }

        const existing_user_by_phone_number = await prisma.user.findUnique({
            where: {
                phoneNumber: contact_number,
            },
        });

        if (existing_user_by_phone_number) {
            return NextResponse.json(
                { data: null, message: "User with this Contact Number already exists!" },
                { status: 409 }
            );
        }

        const hashPassword = await hash(password, 10);

        const new_user = await prisma.user.create({
            data: {
                phoneNumber: contact_number,
                email: email,
                username: username,
                firstName: first_name,
                lastName: last_name,
                password: hashPassword,
                gender: gender,
                birthDate: new Date(birth_date),
                address: {
                    create: {
                        street: street_name,
                        city: city_name,
                        province: province_name,
                        zip_code: zip_code,
                    },
                },
            },
        });

        const actionUrl = process.env.BASE_PATH + "/email-verification/" + new_user?.id;
        const encodedURL = encodeURIComponent(actionUrl);

        const mailOptions = {
            from: {
                name: "Trufit Auto Center",
                address: process.env.USER,
            },
            to: [email],
            subject: "Account email verification",
            html: `<div>
                        <h1>Hi, ${username}!</h1>
                        <p>
                            You recently create account for your Trufit Auto Center account. in order to use use account, you need to verify first.
                        </p>
                        <p>
                            <strong>Click the link provided below to verify your account.</strong>
                        </p>
                        <a href="${actionUrl}">${encodedURL}</a>
                    </div>`,
        };

        const sendMail = await transporter.sendMail(mailOptions);
        return NextResponse.json({ data: new_user, message: "User created successfully!" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        return NextResponse.json({ data: null }, { status: 200 });
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
