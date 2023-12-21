import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const result = await prisma.user.findUnique({
            where: {
                id: params.id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                phoneNumber: true,
                birthDate: true,
                gender: true,
                email: true,
                isEmailVerify: true,
                notifType: true,
                address: {
                    select: {
                        id: true,
                        street: true,
                        city: true,
                        province: true,
                        zip_code: true,
                    },
                },
            },
        });
        return NextResponse.json({ data: result }, { status: 200 });
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const {
            username,
            first_name,
            last_name,
            email,
            contact_number,
            birth_date,
            gender,
            street_name,
            city_name,
            province_name,
            zip_code,
            email_verified
        } = await req.json();

        const updatedUser = await prisma.user.update({
            where: {
                id: params.id,
            },
            data: {
                username: username,
                firstName: first_name,
                lastName: last_name,
                email: email,
                phoneNumber: contact_number,
                birthDate: new Date(birth_date),
                gender: gender,
                isEmailVerify: email_verified,
                address: {
                    update: {
                        data: {
                            street: street_name,
                            city: city_name,
                            province: province_name,
                            zip_code: zip_code,
                        },
                    },
                },
            },
            include: {
                address: true,
            },
        });
        return NextResponse.json({ data: updatedUser }, { status: 200 });
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const deleteUser = await prisma.user.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json({ data: deleteUser }, { status: 200 });
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
